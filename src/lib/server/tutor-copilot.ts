import {
  ApprovalStatus,
  AttendanceStatus,
  ClassSessionStatus,
  EnrollmentStatus,
  Prisma,
  PrismaClient,
  UserRole,
} from "@prisma/client";

import { average } from "@/lib/server/dashboard-helpers";
import {
  appendVersionHistory,
  createInitialVersionHistory,
} from "@/lib/server/workflow-api";

type PrismaCopilotClient = PrismaClient | Prisma.TransactionClient;

function getJsonStringArray(value: Prisma.JsonValue | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function getAttendanceSummary(statuses: AttendanceStatus[]) {
  if (statuses.length === 0) {
    return {
      attendanceRate: null,
      attendedCount: 0,
      totalCount: 0,
    };
  }

  const attendedStatuses = new Set<AttendanceStatus>([
    AttendanceStatus.PRESENT,
    AttendanceStatus.LATE,
    AttendanceStatus.EXCUSED,
  ]);
  const attendedCount = statuses.filter((status) => attendedStatuses.has(status)).length;

  return {
    attendanceRate: Math.round((attendedCount / statuses.length) * 100),
    attendedCount,
    totalCount: statuses.length,
  };
}

export async function generateWarmUpQuizDraft(
  client: PrismaCopilotClient,
  {
    tutorId,
    classId,
  }: {
    tutorId: string;
    classId: string;
  },
) {
  const signalSummary = await getClassSignalSummary(client, classId);
  const { classRecord, focusTopic, supportTopic, rankedTopics } = signalSummary;

  const aiDraft = {
    summary: `AI generated a warm-up quiz focused on ${focusTopic} for ${classRecord.title}.`,
    quizItems: [
      `1. Short check-in question on ${focusTopic}`,
      `2. Scaffolded example on ${focusTopic}`,
      `3. Quick confidence check on ${supportTopic}`,
      `4. Pair discussion prompt on the most common mistake pattern`,
      `5. Exit warm-up poll before the live explanation starts`,
    ],
    rationale: {
      focusTopic,
      supportTopic,
      readinessSignals: rankedTopics.slice(0, 3).map((topic) => ({
        topic: topic.topic,
        averageMastery: topic.averageMastery,
        readinessFlags: topic.readinessFlags,
      })),
    },
  } satisfies Prisma.InputJsonValue;

  const objectives = [
    `Check class readiness in ${focusTopic}`,
    `Surface the most common pre-class misconception before live teaching`,
    `Help ${classRecord.title} start with a tutor-approved warm-up sequence`,
  ] satisfies Prisma.InputJsonValue;

  return upsertLessonPlanDraft(client, {
    tutorId,
    classId,
    subjectId: classRecord.subjectId,
    title: `Warm-up quiz draft for ${focusTopic}`,
    objectives,
    aiDraft,
    versionNote:
      "AI generated warm-up quiz draft from latest readiness and mastery signals",
    featureUsed: "warm_up_quiz_generation",
  });
}

async function getClassSignalSummary(
  client: PrismaCopilotClient,
  classId: string,
): Promise<{
  classRecord: NonNullable<Awaited<ReturnType<PrismaCopilotClient["class"]["findUnique"]>>>;
  focusTopic: string;
  supportTopic: string;
  rankedTopics: Array<{
    topic: string;
    riskScore: number;
    averageMastery: number;
    readinessFlags: number;
  }>;
}> {
  const classRecord = await client.class.findUnique({
    where: { id: classId },
    include: {
      subject: true,
      enrollments: {
        where: {
          status: EnrollmentStatus.ACTIVE,
        },
      },
      readinessChecks: {
        orderBy: {
          submittedAt: "desc",
        },
        take: 20,
      },
    },
  });

  if (!classRecord) {
    throw new Error("Class not found for tutor copilot generation.");
  }

  const studentIds = classRecord.enrollments.map((enrollment) => enrollment.studentId);
  const masteryRecords =
    studentIds.length > 0
      ? await client.studentMastery.findMany({
          where: {
            studentId: {
              in: studentIds,
            },
            subjectId: classRecord.subjectId,
          },
        })
      : [];

  const topicScores = new Map<string, number[]>();
  for (const record of masteryRecords) {
    const current = topicScores.get(record.topicLabel) ?? [];
    current.push(record.masteryScore);
    topicScores.set(record.topicLabel, current);
  }

  const readinessWeakTopics = classRecord.readinessChecks.flatMap((submission) =>
    getJsonStringArray(submission.weakTopics),
  );
  const readinessTopicCounts = new Map<string, number>();
  for (const topic of readinessWeakTopics) {
    readinessTopicCounts.set(topic, (readinessTopicCounts.get(topic) ?? 0) + 1);
  }

  const rankedTopics = Array.from(
    new Set([...topicScores.keys(), ...readinessTopicCounts.keys()]),
  )
    .map((topic) => {
      const averageMastery = topicScores.get(topic)?.length
        ? average(topicScores.get(topic) ?? [])
        : 45;
      const readinessFlags = readinessTopicCounts.get(topic) ?? 0;

      return {
        topic,
        riskScore: (100 - averageMastery) + readinessFlags * 12,
        averageMastery: Math.round(averageMastery),
        readinessFlags,
      };
    })
    .sort((left, right) => right.riskScore - left.riskScore);

  const focusTopic = rankedTopics[0]?.topic ?? classRecord.subject.name;
  const supportTopic = rankedTopics[1]?.topic ?? focusTopic;

  return {
    classRecord,
    focusTopic,
    supportTopic,
    rankedTopics,
  };
}

async function upsertLessonPlanDraft(
  client: PrismaCopilotClient,
  {
    tutorId,
    classId,
    subjectId,
    title,
    objectives,
    aiDraft,
    versionNote,
    featureUsed,
  }: {
    tutorId: string;
    classId: string;
    subjectId: string;
    title: string;
    objectives: Prisma.InputJsonValue;
    aiDraft: Prisma.InputJsonValue;
    versionNote: string;
    featureUsed: string;
  },
) {
  const existingDraft = await client.lessonPlan.findFirst({
    where: {
      classId,
      tutorId,
      title,
      approvalStatus: {
        in: [ApprovalStatus.DRAFT, ApprovalStatus.TUTOR_REVIEWED],
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const lessonPlan = existingDraft
    ? await client.lessonPlan.update({
        where: { id: existingDraft.id },
        data: {
          objectives,
          aiDraft,
          generatedByAiAt: new Date(),
          versionHistory: appendVersionHistory(existingDraft.versionHistory, versionNote),
        },
      })
    : await client.lessonPlan.create({
        data: {
          classId,
          tutorId,
          subjectId,
          title,
          objectives,
          aiDraft,
          approvalStatus: ApprovalStatus.DRAFT,
          generatedByAiAt: new Date(),
          versionHistory: createInitialVersionHistory({
            generatedByAi: true,
            versionNote,
          }),
        },
      });

  await client.aiActivityLog.create({
    data: {
      userId: tutorId,
      role: UserRole.TUTOR,
      featureUsed,
      inputType: "tutor_copilot_request",
      outputType: "lesson_plan_draft",
      approvalRequired: true,
      approvedBy: tutorId,
      sourceEntityType: "lesson_plan",
      sourceEntityId: lessonPlan.id,
      moderationStatus: "draft",
    },
  });

  return lessonPlan;
}

export async function generateQuickQuizDraft(
  client: PrismaCopilotClient,
  {
    tutorId,
    classId,
  }: {
    tutorId: string;
    classId: string;
  },
) {
  const { classRecord, focusTopic, supportTopic, rankedTopics } =
    await getClassSignalSummary(client, classId);

  const aiDraft = {
    summary: `AI generated a quick in-class quiz focused on ${focusTopic}.`,
    quizItems: [
      `1. One fast recall question on ${focusTopic}`,
      `2. One worked-step check on ${focusTopic}`,
      `3. One misconception trap on ${supportTopic}`,
    ],
    rationale: {
      focusTopic,
      supportTopic,
      riskSignals: rankedTopics.slice(0, 3).map((topic) => ({
        topic: topic.topic,
        averageMastery: topic.averageMastery,
        readinessFlags: topic.readinessFlags,
      })),
    },
  } satisfies Prisma.InputJsonValue;

  const objectives = [
    `Check real-time understanding in ${focusTopic}`,
    `Let the tutor quickly spot misconceptions during class`,
    `Keep the live pace aligned with ${classRecord.title}`,
  ] satisfies Prisma.InputJsonValue;

  return upsertLessonPlanDraft(client, {
    tutorId,
    classId,
    subjectId: classRecord.subjectId,
    title: `Quick quiz draft for ${focusTopic}`,
    objectives,
    aiDraft,
    versionNote: "AI generated quick quiz draft from current class risk signals",
    featureUsed: "quick_quiz_generation",
  });
}

export async function generateClassPollDraft(
  client: PrismaCopilotClient,
  {
    tutorId,
    classId,
  }: {
    tutorId: string;
    classId: string;
  },
) {
  const { classRecord, focusTopic, supportTopic } = await getClassSignalSummary(
    client,
    classId,
  );

  const aiDraft = {
    summary: `AI generated a live class poll on ${focusTopic} and ${supportTopic}.`,
    pollItems: [
      `Poll 1: Which step in ${focusTopic} feels hardest right now?`,
      `Poll 2: Confidence check before the tutor explains ${supportTopic}`,
      "Poll 3: Quick signal on whether the class is ready to move on",
    ],
    facilitationNotes: [
      "Use poll results to decide whether to reteach or accelerate.",
      "Keep the tutor in control of pacing after each response round.",
    ],
  } satisfies Prisma.InputJsonValue;

  const objectives = [
    `Check live confidence in ${focusTopic}`,
    `Let students signal confusion without leaving the tutor-led flow`,
  ] satisfies Prisma.InputJsonValue;

  return upsertLessonPlanDraft(client, {
    tutorId,
    classId,
    subjectId: classRecord.subjectId,
    title: `Class poll draft for ${focusTopic}`,
    objectives,
    aiDraft,
    versionNote: "AI generated class poll draft from current class risk signals",
    featureUsed: "class_poll_generation",
  });
}

export async function generateConceptExplanationDraft(
  client: PrismaCopilotClient,
  {
    tutorId,
    classId,
  }: {
    tutorId: string;
    classId: string;
  },
) {
  const { classRecord, focusTopic, supportTopic } = await getClassSignalSummary(
    client,
    classId,
  );

  const aiDraft = {
    summary: `AI generated a tutor-facing explanation draft for ${focusTopic}.`,
    explanationOutline: [
      `Start with a simple story-based example in ${focusTopic}.`,
      `Contrast the correct setup with a common mistake in ${supportTopic}.`,
      "End with a short check-for-understanding prompt the tutor can ask live.",
    ],
    tutorTalkingPoints: [
      "Keep the explanation short enough to preserve class pace.",
      "Use the draft as a script support, not as a replacement for live teaching.",
    ],
  } satisfies Prisma.InputJsonValue;

  const objectives = [
    `Support the tutor's live explanation of ${focusTopic}`,
    `Reduce confusion before students move into independent practice`,
  ] satisfies Prisma.InputJsonValue;

  return upsertLessonPlanDraft(client, {
    tutorId,
    classId,
    subjectId: classRecord.subjectId,
    title: `Concept explanation draft for ${focusTopic}`,
    objectives,
    aiDraft,
    versionNote: "AI generated concept explanation draft from current class risk signals",
    featureUsed: "concept_explanation_generation",
  });
}

export async function generateClassSummaryDraft(
  client: PrismaCopilotClient,
  {
    tutorId,
    classId,
  }: {
    tutorId: string;
    classId: string;
  },
) {
  const classRecord = await client.class.findUnique({
    where: { id: classId },
    include: {
      sessions: {
        include: {
          attendanceRecords: true,
        },
        where: {
          status: ClassSessionStatus.COMPLETED,
        },
        orderBy: {
          startsAt: "desc",
        },
        take: 1,
      },
      subject: true,
    },
  });

  if (!classRecord) {
    throw new Error("Class not found for summary generation.");
  }

  const latestSession = classRecord.sessions[0];

  if (!latestSession) {
    throw new Error("No completed class session is available yet for summary generation.");
  }

  const studentIds = latestSession.attendanceRecords.map((record) => record.studentId);
  const masteryRecords =
    studentIds.length > 0
      ? await client.studentMastery.findMany({
          where: {
            studentId: {
              in: studentIds,
            },
            subjectId: classRecord.subjectId,
          },
        })
      : [];

  const lowestMastery = [...masteryRecords].sort(
    (left, right) => left.masteryScore - right.masteryScore,
  )[0];
  const attendanceSummary = getAttendanceSummary(
    latestSession.attendanceRecords.map((record) => record.status),
  );

  const aiDraft = {
    summary: `${classRecord.title} completed with ${
      attendanceSummary.attendanceRate ?? "pending"
    }% attendance visibility and a live focus on ${
      lowestMastery?.topicLabel ?? classRecord.subject.name
    }.`,
    attendance: attendanceSummary,
    participationRate: latestSession.participationRate ?? null,
    keyTakeaways: [
      `Live teaching focused on ${lowestMastery?.topicLabel ?? classRecord.subject.name}.`,
      "Tutor can review where students hesitated before assigning follow-up work.",
      "Parent-facing summary should stay concise and tutor-approved.",
    ],
    nextSteps: [
      `Review post-class homework around ${
        lowestMastery?.topicLabel ?? classRecord.subject.name
      }.`,
      "Confirm which students need extra check-ins during the next live session.",
    ],
  } satisfies Prisma.InputJsonValue;

  const existingSummary = await client.classSummary.findUnique({
    where: {
      classSessionId: latestSession.id,
    },
  });

  const summary = existingSummary
    ? await client.classSummary.update({
        where: { id: existingSummary.id },
        data: {
          aiDraft,
          generatedByAiAt: new Date(),
          approvalStatus: ApprovalStatus.DRAFT,
          reviewedByTutorAt: null,
          approvedByTutorId: null,
          approvedAt: null,
          versionHistory: appendVersionHistory(
            existingSummary.versionHistory,
            "AI regenerated class summary draft from the latest completed session",
          ),
        },
      })
    : await client.classSummary.create({
        data: {
          classId,
          classSessionId: latestSession.id,
          tutorId,
          aiDraft,
          approvalStatus: ApprovalStatus.DRAFT,
          generatedByAiAt: new Date(),
          versionHistory: createInitialVersionHistory({
            generatedByAi: true,
            versionNote:
              "AI generated class summary draft from the latest completed session",
          }),
        },
      });

  await client.aiActivityLog.create({
    data: {
      userId: tutorId,
      role: UserRole.TUTOR,
      featureUsed: "class_summary_generation",
      inputType: "tutor_copilot_request",
      outputType: "class_summary_draft",
      approvalRequired: true,
      approvedBy: tutorId,
      sourceEntityType: "class_summary",
      sourceEntityId: summary.id,
      moderationStatus: "draft",
    },
  });

  return summary;
}
