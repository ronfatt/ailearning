import {
  ApprovalStatus,
  HomeworkLifecycleStatus,
  UserRole,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
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

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const action = parseAction(body.action);
    const tutorId = requireString(body, "tutorId");
    const classId = requireString(body, "classId");
    const studentId = requireString(body, "studentId");
    const studentName = requireString(body, "studentName");
    const focusTopic = optionalString(body, "focusTopic") ?? "the current focus topic";

    const [classRecord, latestLessonPlan] = await Promise.all([
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

      const homework = await prisma.homeworkAssignment.create({
        data: {
          classId,
          lessonPlanId: latestLessonPlan?.id,
          studentId,
          tutorId,
          generatedByAi: true,
          approvedByTutor: false,
          assignmentContent: {
            title: `${studentName} mini revision on ${focusTopic}`,
            focus: focusTopic,
            questions: 3,
            instructions:
              "Keep this short. Use one worked example, one guided attempt, and one self-check.",
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
