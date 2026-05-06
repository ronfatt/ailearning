import {
  ApprovalStatus,
  HomeworkLifecycleStatus,
  StudyPlanStatus,
  UserRole,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  normalizeTopicToken,
  resolveCurriculumLevelCodeForSubject,
  resolveTopicAliasCodeForSubject,
} from "@/lib/server/curriculum-topic-links";
import {
  ApiError,
  assertRecord,
  optionalString,
  requireString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

const liveWorkspaceActions = [
  "mark_checked",
  "flag_follow_up",
  "draft_parent_note",
  "draft_mini_revision",
] as const;

type LiveWorkspaceAction = (typeof liveWorkspaceActions)[number];

function parseAction(value: unknown): LiveWorkspaceAction {
  if (typeof value !== "string") {
    throw new ApiError('Field "action" must be a string.');
  }

  const normalized = value.trim().toLowerCase();

  if (!liveWorkspaceActions.includes(normalized as LiveWorkspaceAction)) {
    throw new ApiError(
      'Field "action" must be one of: mark_checked, flag_follow_up, draft_parent_note, draft_mini_revision.',
    );
  }

  return normalized as LiveWorkspaceAction;
}

function getStudentLevelFromProfileData(profileData: unknown) {
  if (!profileData || typeof profileData !== "object" || Array.isArray(profileData)) {
    return undefined;
  }

  const rawLevel = (profileData as Record<string, unknown>).studentLevel;
  return typeof rawLevel === "string" && rawLevel.trim().length > 0 ? rawLevel : undefined;
}

function pickRecommendedNodes(
  topic:
    | {
        masteryNodes: Array<{ id: string; title: string; sequenceOrder: number }>;
      }
    | null,
  masteryScore?: number | null,
) {
  if (!topic || topic.masteryNodes.length === 0) {
    return {
      nodes: [] as Array<{ id: string; title: string }>,
      phaseLabel: masteryScore === null || masteryScore === undefined ? "start" : "review",
    };
  }

  const orderedNodes = [...topic.masteryNodes].sort(
    (left, right) => left.sequenceOrder - right.sequenceOrder,
  );

  let startIndex = 0;
  let phaseLabel: "start" | "rebuild" | "secure" | "review" = "start";

  if (masteryScore === null || masteryScore === undefined) {
    phaseLabel = "start";
    startIndex = 0;
  } else if (masteryScore < 50) {
    phaseLabel = "rebuild";
    startIndex = 0;
  } else if (masteryScore < 75) {
    phaseLabel = "secure";
    startIndex = Math.min(1, Math.max(0, orderedNodes.length - 2));
  } else {
    phaseLabel = "review";
    startIndex = Math.max(0, orderedNodes.length - 2);
  }

  return {
    nodes: orderedNodes.slice(startIndex, startIndex + 3).map((node) => ({
      id: node.id,
      title: node.title,
    })),
    phaseLabel,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const action = parseAction(body.action);
    const tutorId = requireString(body, "tutorId");
    const classId = requireString(body, "classId");
    const studentId = requireString(body, "studentId");
    const studentName = requireString(body, "studentName");
    const focusTopic = optionalString(body, "focusTopic") ?? "the current focus topic";

    const [classRecord, latestLessonPlan, activeStudyPlan, studentRecord] = await Promise.all([
      prisma.class.findUnique({
        where: { id: classId },
        include: {
          subject: true,
        },
      }),
      prisma.lessonPlan.findFirst({
        where: { classId, tutorId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.studyPlan.findFirst({
        where: {
          classId,
          studentId,
          status: StudyPlanStatus.ACTIVE,
        },
        include: {
          revisionTopics: {
            orderBy: { sequenceOrder: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.user.findUnique({
        where: { id: studentId },
        select: {
          profileData: true,
        },
      }),
    ]);

    if (!classRecord) {
      throw new ApiError("Class not found.", 404);
    }

    let result: Record<string, unknown> = {
      action,
      studentId,
    };

    if (action === "mark_checked" || action === "flag_follow_up") {
      const featureUsed =
        action === "mark_checked"
          ? "live_workspace_mark_checked"
          : "live_workspace_flag_follow_up";

      await prisma.aiActivityLog.create({
        data: {
          userId: tutorId,
          role: UserRole.TUTOR,
          featureUsed,
          inputType: "live_workspace_action",
          outputType: action === "mark_checked" ? "student_check_complete" : "student_follow_up_flag",
          approvalRequired: false,
          approvedBy: tutorId,
          sourceEntityType: "student",
          sourceEntityId: studentId,
          moderationStatus: classId,
        },
      });

      result = {
        ...result,
        status:
          action === "mark_checked"
            ? `${studentName} marked as checked for this live session.`
            : `${studentName} flagged for follow-up before or after class.`,
      };
    }

    if (action === "draft_parent_note") {
      const report = await prisma.parentReport.create({
        data: {
          classId,
          studentId,
          tutorId,
          aiSummary: {
            summary: `${studentName} needs a parent-facing update linked to ${focusTopic}.`,
            keyTakeaways: [
              `${studentName} needed extra support during the tutor-led live session.`,
              `The main focus area was ${focusTopic}.`,
              "Tutor will review the note before it is shared with the parent.",
            ],
          },
          tutorNotes:
            "Drafted from live workspace. Please refine before approval or sending.",
          approvalStatus: ApprovalStatus.DRAFT,
          generatedByAiAt: new Date(),
          versionHistory: ["v1 AI draft from live workspace parent note action"],
        },
      });

      await prisma.aiActivityLog.create({
        data: {
          userId: tutorId,
          role: UserRole.TUTOR,
          featureUsed: "live_workspace_parent_note_draft",
          inputType: "live_workspace_action",
          outputType: "parent_report_draft",
          approvalRequired: true,
          sourceEntityType: "parent_report",
          sourceEntityId: report.id,
          moderationStatus: classId,
        },
      });

      result = {
        ...result,
        parentReportId: report.id,
        status: `Parent note draft created for ${studentName}.`,
      };
    }

    if (action === "draft_mini_revision") {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      const studentLevelHint = getStudentLevelFromProfileData(studentRecord?.profileData);
      const curriculumLevelCode = resolveCurriculumLevelCodeForSubject(
        classRecord.subject.code,
        classRecord.subject.name,
        studentLevelHint,
      );
      const matchedRevisionTopic =
        activeStudyPlan?.revisionTopics.find((topic) => {
          const normalizedFocus = normalizeTopicToken(focusTopic);
          return (
            topic.topicKey === focusTopic ||
            normalizeTopicToken(topic.topicLabel) === normalizedFocus ||
            normalizeTopicToken(topic.topicKey) === normalizedFocus
          );
        }) ?? null;
      const aliasCode = resolveTopicAliasCodeForSubject(
        classRecord.subject.code,
        classRecord.subject.name,
        matchedRevisionTopic?.topicKey ?? focusTopic,
        matchedRevisionTopic?.topicLabel ?? focusTopic,
      );
      const fallbackTopicMatchers = [
        matchedRevisionTopic?.topicKey
          ? ({ id: matchedRevisionTopic.topicKey } as const)
          : null,
        matchedRevisionTopic?.topicLabel
          ? ({ name: matchedRevisionTopic.topicLabel } as const)
          : null,
        aliasCode ? ({ code: aliasCode } as const) : null,
        focusTopic ? ({ name: focusTopic } as const) : null,
      ].filter(
        (entry): entry is { id: string } | { name: string } | { code: string } =>
          entry !== null,
      );
      const resolvedSubjectTopic = matchedRevisionTopic
        ? await prisma.subjectTopic.findFirst({
            where: {
              subjectId: classRecord.subjectId,
              ...(curriculumLevelCode
                ? {
                    level: {
                      code: curriculumLevelCode,
                    },
                  }
                : {}),
              OR: [
                { id: matchedRevisionTopic.topicKey },
                { name: matchedRevisionTopic.topicLabel },
                ...(aliasCode ? [{ code: aliasCode }] : []),
              ],
            },
            select: {
              id: true,
              code: true,
              name: true,
              masteryNodes: {
                where: {
                  active: true,
                },
                select: {
                  id: true,
                  title: true,
                  sequenceOrder: true,
                },
                orderBy: {
                  sequenceOrder: "asc",
                },
              },
            },
          })
        : await prisma.subjectTopic.findFirst({
            where: {
              subjectId: classRecord.subjectId,
              ...(curriculumLevelCode
                ? {
                    level: {
                      code: curriculumLevelCode,
                    },
                  }
                : {}),
              OR: [
                { name: focusTopic },
                ...(aliasCode ? [{ code: aliasCode }] : []),
              ],
            },
            select: {
              id: true,
              code: true,
              name: true,
              masteryNodes: {
                where: {
                  active: true,
                },
                select: {
                  id: true,
                  title: true,
                  sequenceOrder: true,
                },
                orderBy: {
                  sequenceOrder: "asc",
                },
              },
            },
          });
      const fallbackSubjectTopic =
        resolvedSubjectTopic ??
        (await prisma.subjectTopic.findFirst({
          where: {
            subjectId: classRecord.subjectId,
            OR: fallbackTopicMatchers,
          },
          select: {
            id: true,
            code: true,
            name: true,
            masteryNodes: {
              where: {
                active: true,
              },
              select: {
                id: true,
                title: true,
                sequenceOrder: true,
              },
              orderBy: {
                sequenceOrder: "asc",
              },
            },
          },
        }));
      const currentMastery =
        (resolvedSubjectTopic ?? fallbackSubjectTopic)
          ? await prisma.studentMastery.findFirst({
              where: {
                studentId,
                subjectId: classRecord.subjectId,
                OR: [
                  { topicId: (resolvedSubjectTopic ?? fallbackSubjectTopic)!.id },
                  { topicLabel: (resolvedSubjectTopic ?? fallbackSubjectTopic)!.name },
                ],
              },
              orderBy: {
                updatedAt: "desc",
              },
            })
          : null;
      const recommendedNodes = pickRecommendedNodes(
        resolvedSubjectTopic ?? fallbackSubjectTopic,
        currentMastery?.masteryScore ?? null,
      );
      const nodeTitles = recommendedNodes.nodes.map((node) => node.title);
      const revisionLabel = resolvedSubjectTopic
        ? `${resolvedSubjectTopic.code} ${resolvedSubjectTopic.name}`
        : fallbackSubjectTopic
          ? `${fallbackSubjectTopic.code} ${fallbackSubjectTopic.name}`
          : focusTopic;
      const questionPrompts =
        nodeTitles.length > 0
          ? nodeTitles.map(
              (nodeTitle, index) =>
                `Question ${index + 1}: Complete one short worked step for ${nodeTitle} and explain why it matters for ${revisionLabel}.`,
            )
          : [
              `Question 1: Show the first step you would use for ${revisionLabel}.`,
              `Question 2: Complete one guided example from ${revisionLabel}.`,
              `Question 3: Write one self-check note about what still feels difficult in ${revisionLabel}.`,
            ];

      const homework = await prisma.homeworkAssignment.create({
        data: {
          classId,
          lessonPlanId: latestLessonPlan?.id,
          studyPlanId: activeStudyPlan?.id ?? null,
          studentId,
          tutorId,
          generatedByAi: true,
          approvedByTutor: false,
          assignmentContent: {
            title: `${studentName} mini revision on ${revisionLabel}`,
            focus: revisionLabel,
            subjectTopicId:
              resolvedSubjectTopic?.id ??
              fallbackSubjectTopic?.id ??
              matchedRevisionTopic?.topicKey ??
              null,
            subjectTopicLabel:
              resolvedSubjectTopic?.name ??
              fallbackSubjectTopic?.name ??
              matchedRevisionTopic?.topicLabel ??
              focusTopic,
            masteryNodeIds: recommendedNodes.nodes.map((node) => node.id),
            masteryNodeTitles: nodeTitles,
            questions: questionPrompts.length,
            questionPrompts,
            instructions:
              nodeTitles.length > 0
                ? `Keep this short. ${recommendedNodes.phaseLabel === "rebuild" ? "Rebuild" : recommendedNodes.phaseLabel === "secure" ? "Secure" : recommendedNodes.phaseLabel === "review" ? "Review" : "Start"} ${revisionLabel} through ${nodeTitles.join(", ")}.`
                : "Keep this short. Use one worked example, one guided attempt, and one self-check.",
            source: "live_workspace_quick_action",
          },
          dueDate,
          status: HomeworkLifecycleStatus.DRAFT,
          approvalStatus: ApprovalStatus.DRAFT,
          generatedByAiAt: new Date(),
          versionHistory: ["v1 AI draft from live workspace mini revision action"],
        },
      });

      await prisma.aiActivityLog.create({
        data: {
          userId: tutorId,
          role: UserRole.TUTOR,
          featureUsed: "live_workspace_mini_revision_draft",
          inputType: "live_workspace_action",
          outputType: "homework_assignment_draft",
          approvalRequired: true,
          sourceEntityType: "homework_assignment",
          sourceEntityId: homework.id,
          moderationStatus: classId,
        },
      });

      result = {
        ...result,
        homeworkAssignmentId: homework.id,
        status: `Mini revision draft created for ${studentName}.`,
      };
    }

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
