import {
  ApprovalStatus as PrismaApprovalStatus,
  AttendanceStatus,
  ClassSessionStatus,
  ClassStatus,
  EnrollmentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ApprovalStatus } from "@/lib/mvp-data";
import { average } from "@/lib/server/dashboard-helpers";

type ApprovalQueueItem = {
  id: string;
  entityType:
    | "lesson_plan"
    | "study_plan"
    | "class_summary"
    | "homework_assignment"
    | "parent_report"
    | "readiness_check";
  resourcePath: string;
  title: string;
  owner: string;
  status: ApprovalStatus;
  generatedAt: string;
  reviewedAt: string;
  approvedByTutorId: string;
  versionHistory: string[];
  availableActions: ApprovalStatus[];
  draftPreview?: {
    summary?: string;
    lines: string[];
  };
  studyPlanTopics?: Array<{
    id: string;
    topicKey: string;
    topicLabel: string;
    accessApproved: boolean;
    sequenceOrder: number;
  }>;
};

type LessonSuggestionItem = {
  id: string;
  entityType: "lesson_plan";
  resourcePath: string;
  title: string;
  detail: string;
  status: ApprovalStatus;
  generatedAt: string;
  reviewedAt: string;
  approvedByTutorId: string;
  versionHistory: string[];
  availableActions: ApprovalStatus[];
  draftPreview?: {
    summary?: string;
    lines: string[];
  };
};

type SubmissionReviewItem = {
  id: string;
  studentId: string;
  homeworkAssignmentId: string;
  title: string;
  owner: string;
  submittedAt: string;
  score: string;
  tutorFeedback: string;
  needsReview: boolean;
};

type TutorClassOverview = {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  readiness: string;
  attendance: string;
  focus: string;
};

type WeakTopicHeatmapItem = {
  className: string;
  topic: string;
  intensity: number;
  note: string;
};

type RiskAlertItem = {
  student: string;
  risk: string;
  action: string;
};

type ClassIntelligencePulseRow = {
  label: string;
  values: number[];
};

type ClassIntelligenceCheckpoint = {
  id: string;
  timeLabel: string;
  title: string;
  signal: string;
  note: string;
};

type ClassIntelligenceBalanceItem = {
  mode: string;
  percent: number;
  note: string;
};

type ClassIntelligenceSlice = {
  id: string;
  timeLabel: string;
  title: string;
  summary: string;
  teacherMove: string;
  studentSignal: string;
};

type ClassIntelligenceQuestion = {
  id: string;
  timeLabel: string;
  question: string;
  intent: string;
  recommendedFollowUp: string;
};

type LiveClassStudentSignal = {
  studentId: string;
  studentName: string;
  readinessLabel: string;
  masteryLabel: string;
  attendanceLabel: string;
  homeworkLabel: string;
  priority: "high" | "medium" | "steady";
  coachNote: string;
  recentActionLabel?: string;
};

type LiveClassWorkspace = {
  classId: string;
  sessionTitle: string;
  sessionStatus: string;
  sessionTime: string;
  liveRoomUrl: string | null;
  focusTopic: string;
  sessionMode: string;
  rosterReadyCount: number;
  supportCount: number;
  quickWins: string[];
  tutorChecklist: string[];
  studentSignals: LiveClassStudentSignal[];
};

type AfterClassFollowUpStudent = {
  studentId: string;
  studentName: string;
  reason: string;
  nextAction: string;
};

type AfterClassFollowUpDraft = {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  status: ApprovalStatus;
  updatedAt: string;
};

type AfterClassFollowUpPanel = {
  classId: string;
  className: string;
  focusTopic: string;
  flaggedStudents: AfterClassFollowUpStudent[];
  miniRevisionDrafts: AfterClassFollowUpDraft[];
  parentNoteDrafts: AfterClassFollowUpDraft[];
  summary: string;
};

type ClassIntelligenceItem = {
  classId: string;
  className: string;
  subject: string;
  linkedLessonPlanId: string | null;
  linkedLessonPlanTitle: string | null;
  linkedLessonPlanStatus: ApprovalStatus | null;
  durationMinutes: number;
  readinessScore: number;
  participationScore: number;
  tutorGuidanceRatio: number;
  studentPracticeRatio: number;
  teachingPattern: string;
  aiInsight: string;
  nextMove: string;
  pulseRows: ClassIntelligencePulseRow[];
  focusCheckpoints: ClassIntelligenceCheckpoint[];
  teachingBalance: ClassIntelligenceBalanceItem[];
  teachingSlices: ClassIntelligenceSlice[];
  coreQuestions: ClassIntelligenceQuestion[];
};

type TutorDashboardData = {
  summary: {
    lessonPlanDrafts: number;
    studyPlanQueue: number;
    homeworkQueue: number;
    parentReportQueue: number;
    readinessQueue: number;
    submissionReviewQueue: number;
    classSummaryQueue: number;
    totalPendingApprovals: number;
  };
  lessonSuggestions: LessonSuggestionItem[];
  studyPlanQueue: ApprovalQueueItem[];
  assignmentQueue: ApprovalQueueItem[];
  parentReportQueue: ApprovalQueueItem[];
  readinessQueue: ApprovalQueueItem[];
  submissionReviewQueue: SubmissionReviewItem[];
  classSummaryQueue: ApprovalQueueItem[];
  todaysClasses: TutorClassOverview[];
  liveClassWorkspace: LiveClassWorkspace[];
  afterClassFollowUp: AfterClassFollowUpPanel[];
  weakTopicHeatmap: WeakTopicHeatmapItem[];
  riskAlerts: RiskAlertItem[];
  classIntelligence: ClassIntelligenceItem[];
  source: "database" | "unconfigured";
  message?: string;
};

const prismaToUiStatus: Record<
  PrismaApprovalStatus,
  ApprovalStatus
> = {
  [PrismaApprovalStatus.DRAFT]: "draft",
  [PrismaApprovalStatus.TUTOR_REVIEWED]: "tutor_reviewed",
  [PrismaApprovalStatus.APPROVED]: "approved",
  [PrismaApprovalStatus.ASSIGNED]: "assigned",
  [PrismaApprovalStatus.ARCHIVED]: "archived",
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);
}

function getVersionHistory(value: Prisma.JsonValue | null) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function getAvailableActions(status: ApprovalStatus): ApprovalStatus[] {
  switch (status) {
    case "draft":
      return ["tutor_reviewed", "archived"];
    case "tutor_reviewed":
      return ["approved", "archived"];
    case "approved":
      return ["assigned", "archived"];
    case "assigned":
      return ["archived"];
    case "archived":
      return [];
    default:
      return [];
  }
}

function getJsonStringArray(value: Prisma.JsonValue | null) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function getJsonStringRecord(
  value: Prisma.JsonValue | null,
): Record<string, Prisma.JsonValue> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, Prisma.JsonValue>;
}

function getJsonObjectArray(
  value: Prisma.JsonValue | null | undefined,
): Record<string, Prisma.JsonValue>[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (entry): entry is Record<string, Prisma.JsonValue> =>
      typeof entry === "object" && entry !== null && !Array.isArray(entry),
  );
}

function getDraftPreview(value: Prisma.JsonValue | null) {
  const record = getJsonStringRecord(value);

  if (!record) {
    return undefined;
  }

  const summary =
    typeof record.summary === "string" ? record.summary : undefined;
  const candidateKeys = [
    "quizItems",
    "pollItems",
    "explanationOutline",
    "tutorTalkingPoints",
    "facilitationNotes",
    "keyTakeaways",
    "nextSteps",
    "homeworkHighlights",
  ];

  const lines = candidateKeys.flatMap((key) => getJsonStringArray(record[key] ?? null));

  if (!summary && lines.length === 0) {
    return undefined;
  }

  return {
    summary,
    lines: lines.slice(0, 5),
  };
}

function formatSessionRange(
  startsAt: Date,
  endsAt: Date | null,
) {
  const formatter = new Intl.DateTimeFormat("en-MY", {
    hour: "numeric",
    minute: "2-digit",
  });

  const start = formatter.format(startsAt);
  const end = endsAt ? formatter.format(endsAt) : null;

  return end ? `${start} - ${end}` : start;
}

function getAttendanceRate(statuses: AttendanceStatus[]) {
  if (statuses.length === 0) {
    return null;
  }

  const attendedStatuses = new Set<AttendanceStatus>([
    AttendanceStatus.PRESENT,
    AttendanceStatus.LATE,
    AttendanceStatus.EXCUSED,
  ]);
  const attendedCount = statuses.filter((status) => attendedStatuses.has(status)).length;

  return Math.round((attendedCount / statuses.length) * 100);
}

function roundPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizePercentages(values: number[]) {
  const total = values.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return values.map(() => 0);
  }

  const normalized = values.map((value) => Math.round((value / total) * 100));
  const diff = 100 - normalized.reduce((sum, value) => sum + value, 0);

  if (normalized.length > 0 && diff !== 0) {
    normalized[normalized.length - 1] += diff;
  }

  return normalized;
}

function buildPulseRow(base: number, offsets: number[]) {
  return offsets.map((offset) => clampNumber(Math.round(base + offset), 16, 96));
}

function formatMinuteWindow(startMinute: number, endMinute: number) {
  const start = String(Math.max(0, startMinute)).padStart(2, "0");
  const end = String(Math.max(startMinute, endMinute)).padStart(2, "0");

  return `${start}-${end} min`;
}

export async function getTutorDashboardData(
  tutorId?: string,
): Promise<TutorDashboardData> {
  if (!process.env.DATABASE_URL) {
    return {
      summary: {
        lessonPlanDrafts: 0,
        studyPlanQueue: 0,
        homeworkQueue: 0,
        parentReportQueue: 0,
        readinessQueue: 0,
      submissionReviewQueue: 0,
      classSummaryQueue: 0,
      totalPendingApprovals: 0,
      },
      lessonSuggestions: [],
      studyPlanQueue: [],
      assignmentQueue: [],
      parentReportQueue: [],
      readinessQueue: [],
      submissionReviewQueue: [],
      classSummaryQueue: [],
      todaysClasses: [],
      liveClassWorkspace: [],
      afterClassFollowUp: [],
      weakTopicHeatmap: [],
      riskAlerts: [],
      classIntelligence: [],
      source: "unconfigured",
      message:
        "DATABASE_URL is not configured yet. Connect a database to load live tutor workflow data.",
    };
  }

  const lessonWhere: Prisma.LessonPlanWhereInput = tutorId
    ? { tutorId }
    : {};
  const homeworkWhere: Prisma.HomeworkAssignmentWhereInput = tutorId
    ? { tutorId }
    : {};
  const reportWhere: Prisma.ParentReportWhereInput = tutorId
    ? { tutorId }
    : {};

  const classes = await prisma.class.findMany({
    where: {
      ...(tutorId ? { tutorId } : {}),
      status: {
        in: [ClassStatus.ACTIVE],
      },
    },
    include: {
      subject: true,
      enrollments: {
        where: {
          status: EnrollmentStatus.ACTIVE,
        },
        include: {
          student: true,
        },
      },
      sessions: {
        include: {
          attendanceRecords: true,
        },
        orderBy: {
          startsAt: "asc",
        },
        take: 10,
      },
      readinessChecks: {
        orderBy: {
          submittedAt: "desc",
        },
        take: 20,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 6,
  });

  const classIds = classes.map((item) => item.id);
  const studentIds = Array.from(
    new Set(classes.flatMap((item) => item.enrollments.map((enrollment) => enrollment.studentId))),
  );
  const subjectIds = Array.from(new Set(classes.map((item) => item.subjectId)));

  const [
    masteryRecords,
    classHomeworkAssignments,
    lessonPlans,
    studyPlans,
    classSummaries,
    homeworkAssignments,
    parentReports,
    readinessSubmissions,
    homeworkSubmissions,
    recentLiveWorkspaceActions,
  ] = await Promise.all([
    studentIds.length > 0 && subjectIds.length > 0
      ? prisma.studentMastery.findMany({
          where: {
            studentId: {
              in: studentIds,
            },
            subjectId: {
              in: subjectIds,
            },
          },
        })
      : Promise.resolve([]),
    classIds.length > 0
      ? prisma.homeworkAssignment.findMany({
          where: {
            classId: {
              in: classIds,
            },
            approvalStatus: {
              in: [PrismaApprovalStatus.APPROVED, PrismaApprovalStatus.ASSIGNED],
            },
          },
          include: {
            submissions: true,
          },
        })
      : Promise.resolve([]),
    prisma.lessonPlan.findMany({
      where: {
        ...lessonWhere,
        approvalStatus: {
          in: [PrismaApprovalStatus.DRAFT, PrismaApprovalStatus.TUTOR_REVIEWED],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.studyPlan.findMany({
      where: {
        ...(tutorId ? { tutorId } : {}),
        approvalStatus: {
          in: [PrismaApprovalStatus.DRAFT, PrismaApprovalStatus.TUTOR_REVIEWED],
        },
        classId: {
          not: null,
        },
      },
      include: {
        revisionTopics: {
          orderBy: { sequenceOrder: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.classSummary.findMany({
      where: {
        ...(tutorId ? { tutorId } : {}),
        approvalStatus: {
          in: [PrismaApprovalStatus.DRAFT, PrismaApprovalStatus.TUTOR_REVIEWED],
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.homeworkAssignment.findMany({
      where: {
        ...homeworkWhere,
        approvalStatus: {
          in: [
            PrismaApprovalStatus.DRAFT,
            PrismaApprovalStatus.TUTOR_REVIEWED,
            PrismaApprovalStatus.APPROVED,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.parentReport.findMany({
      where: {
        ...reportWhere,
        approvalStatus: {
          in: [
            PrismaApprovalStatus.DRAFT,
            PrismaApprovalStatus.TUTOR_REVIEWED,
            PrismaApprovalStatus.APPROVED,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.readinessCheckSubmission.findMany({
      where: {
        ...(tutorId ? { tutorId } : {}),
        approvalStatus: {
          in: [PrismaApprovalStatus.DRAFT, PrismaApprovalStatus.TUTOR_REVIEWED],
        },
      },
      orderBy: { submittedAt: "desc" },
      take: 6,
    }),
    prisma.homeworkSubmission.findMany({
      where: {
        homeworkAssignment: {
          ...(tutorId ? { tutorId } : {}),
        },
        submittedAt: {
          not: null,
        },
        OR: [{ score: null }, { tutorFeedback: null }],
      },
      include: {
        homeworkAssignment: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 6,
    }),
    tutorId && (studentIds.length > 0 || classIds.length > 0)
      ? prisma.aiActivityLog.findMany({
          where: {
            userId: tutorId,
            sourceEntityType: {
              in: ["student", "parent_report", "homework_assignment"],
            },
            OR: [
              {
                sourceEntityType: "student",
                sourceEntityId: {
                  in: studentIds,
                },
              },
              {
                moderationStatus: {
                  in: classIds,
                },
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 40,
        })
      : Promise.resolve([]),
  ]);

  const recentActionByStudent = new Map<string, string>();

  for (const log of recentLiveWorkspaceActions) {
    if (log.sourceEntityType === "student" && log.sourceEntityId) {
      if (recentActionByStudent.has(log.sourceEntityId)) {
        continue;
      }

      const label =
        log.featureUsed === "live_workspace_mark_checked"
          ? "Checked by tutor"
          : log.featureUsed === "live_workspace_flag_follow_up"
            ? "Needs follow-up"
            : undefined;

      if (label) {
        recentActionByStudent.set(log.sourceEntityId, label);
      }
    }
  }

  const afterClassFollowUp = classes.map((classItem) => {
    const classStudentMap = new Map(
      classItem.enrollments.map((enrollment) => [
        enrollment.studentId,
        enrollment.student.fullName,
      ]),
    );
    const focusTopic = weakestTopicByClass.get(classItem.id)?.topic ?? classItem.subject.name;

    const flaggedStudents = recentLiveWorkspaceActions
      .filter(
        (log) =>
          log.featureUsed === "live_workspace_flag_follow_up" &&
          log.sourceEntityType === "student" &&
          log.sourceEntityId &&
          log.moderationStatus === classItem.id,
      )
      .map((log) => {
        const studentId = log.sourceEntityId as string;

        return {
          studentId,
          studentName: classStudentMap.get(studentId) ?? studentId,
          reason: `Marked during the live workspace for extra support on ${focusTopic.toLowerCase()}.`,
          nextAction:
            "Follow up with a short tutor check-in, then decide whether a parent note or mini revision should be assigned.",
        };
      })
      .slice(0, 4);

    const miniRevisionDrafts = homeworkAssignments
      .filter((item) => {
        const record = getJsonStringRecord(item.assignmentContent);

        return (
          item.classId === classItem.id &&
          prismaToUiStatus[item.approvalStatus] === "draft" &&
          record?.source === "live_workspace_quick_action"
        );
      })
      .map((item) => {
        const record = getJsonStringRecord(item.assignmentContent);
        const title =
          typeof record?.title === "string"
            ? record.title
            : `Mini revision for ${item.studentId}`;

        return {
          id: item.id,
          studentId: item.studentId,
          studentName: classStudentMap.get(item.studentId) ?? item.studentId,
          title,
          status: prismaToUiStatus[item.approvalStatus],
          updatedAt: formatDate(item.updatedAt),
        };
      })
      .slice(0, 4);

    const parentNoteDrafts = parentReports
      .filter((item) => {
        const record = getJsonStringRecord(item.aiSummary);
        const summary = typeof record?.summary === "string" ? record.summary : "";

        return (
          item.classId === classItem.id &&
          prismaToUiStatus[item.approvalStatus] === "draft" &&
          summary.includes("parent-facing update")
        );
      })
      .map((item) => ({
        id: item.id,
        studentId: item.studentId,
        studentName: classStudentMap.get(item.studentId) ?? item.studentId,
        title: `Parent note for ${classStudentMap.get(item.studentId) ?? item.studentId}`,
        status: prismaToUiStatus[item.approvalStatus],
        updatedAt: formatDate(item.updatedAt),
      }))
      .slice(0, 4);

    const summaryParts = [
      flaggedStudents.length > 0
        ? `${flaggedStudents.length} learner(s) still need follow-up`
        : null,
      miniRevisionDrafts.length > 0
        ? `${miniRevisionDrafts.length} mini revision draft(s) are waiting`
        : null,
      parentNoteDrafts.length > 0
        ? `${parentNoteDrafts.length} parent note draft(s) are waiting`
        : null,
    ].filter((value): value is string => Boolean(value));

    return {
      classId: classItem.id,
      className: classItem.title,
      focusTopic,
      flaggedStudents,
      miniRevisionDrafts,
      parentNoteDrafts,
      summary:
        summaryParts.length > 0
          ? `${summaryParts.join(". ")}.`
          : "No live follow-up items are waiting for this class right now.",
    };
  });

  const heatmapCandidates = classes.flatMap((classItem) => {
    const classStudentIds = new Set(
      classItem.enrollments.map((enrollment) => enrollment.studentId),
    );
    const relevantMastery = masteryRecords.filter(
      (record) =>
        record.subjectId === classItem.subjectId && classStudentIds.has(record.studentId),
    );
    const readinessWeakTopics = classItem.readinessChecks.flatMap((submission) =>
      getJsonStringArray(submission.weakTopics),
    );

    const groupedTopics = new Map<
      string,
      {
        masteryScores: number[];
        readinessFlags: number;
      }
    >();

    for (const record of relevantMastery) {
      const existing =
        groupedTopics.get(record.topicLabel) ?? { masteryScores: [], readinessFlags: 0 };
      existing.masteryScores.push(record.masteryScore);
      groupedTopics.set(record.topicLabel, existing);
    }

    for (const topic of readinessWeakTopics) {
      const existing =
        groupedTopics.get(topic) ?? { masteryScores: [], readinessFlags: 0 };
      existing.readinessFlags += 1;
      groupedTopics.set(topic, existing);
    }

    return Array.from(groupedTopics.entries()).map(([topic, stats]) => {
      const averageMastery = stats.masteryScores.length
        ? average(stats.masteryScores)
        : 45;
      const intensity = roundPercentage(
        (100 - averageMastery) + stats.readinessFlags * 12,
      );

      return {
        classId: classItem.id,
        className: classItem.title,
        topic,
        intensity,
        note:
          stats.readinessFlags > 0
            ? `Flagged in ${stats.readinessFlags} recent readiness submission(s); average mastery is ${Math.round(averageMastery)}%.`
            : `Average class mastery is ${Math.round(averageMastery)}% for this topic.`,
      };
    });
  });

  const weakTopicHeatmap = heatmapCandidates
    .sort((left, right) => right.intensity - left.intensity)
    .slice(0, 4);

  const weakestTopicByClass = new Map(
    weakTopicHeatmap.map((item) => [item.classId, item]),
  );
  const latestLessonPlanByClass = new Map<string, (typeof lessonPlans)[number]>();

  for (const item of lessonPlans) {
    if (!latestLessonPlanByClass.has(item.classId)) {
      latestLessonPlanByClass.set(item.classId, item);
    }
  }

  const todaysClasses = classes.map((classItem) => {
    const nextSession =
      classItem.sessions.find(
        (session) =>
          session.status === ClassSessionStatus.SCHEDULED ||
          session.status === ClassSessionStatus.LIVE,
      ) ?? null;
    const latestCompletedSession =
      [...classItem.sessions]
        .filter((session) => session.status === ClassSessionStatus.COMPLETED)
        .sort((left, right) => right.startsAt.getTime() - left.startsAt.getTime())[0] ?? null;
    const readinessScores = classItem.readinessChecks.map((item) => item.score);
    const classStudentIds = new Set(
      classItem.enrollments.map((enrollment) => enrollment.studentId),
    );
    const classMastery = masteryRecords.filter(
      (record) =>
        record.subjectId === classItem.subjectId && classStudentIds.has(record.studentId),
    );
    const readinessScore = readinessScores.length
      ? Math.round(average(readinessScores))
      : classMastery.length
        ? Math.round(average(classMastery.map((record) => record.masteryScore)))
        : 0;
    const expectedCount = classItem.enrollments.length;
    const attendedStatuses =
      latestCompletedSession?.attendanceRecords.map((record) => record.status) ?? [];
    const attendedCount = attendedStatuses.filter((status) =>
      new Set<AttendanceStatus>([
        AttendanceStatus.PRESENT,
        AttendanceStatus.LATE,
        AttendanceStatus.EXCUSED,
      ]).has(status),
    ).length;
    const focusTopic = weakestTopicByClass.get(classItem.id)?.topic ?? classItem.subject.name;

    return {
      id: classItem.id,
      name: classItem.title,
      subject: classItem.subject.name,
      schedule: nextSession
        ? formatSessionRange(nextSession.startsAt, nextSession.endsAt)
        : classItem.schedule,
      readiness:
        readinessScore > 0
          ? `${readinessScore}% class readiness`
          : "Readiness pending first submission",
      attendance:
        latestCompletedSession && expectedCount > 0
          ? `${attendedCount} / ${expectedCount} present last session`
          : `${expectedCount} active learners enrolled`,
      focus: focusTopic,
    };
  });

  const liveClassWorkspace = classes.map((classItem) => {
    const nextSession =
      classItem.sessions.find(
        (session) =>
          session.status === ClassSessionStatus.LIVE ||
          session.status === ClassSessionStatus.SCHEDULED,
      ) ?? null;
    const latestCompletedSession =
      [...classItem.sessions]
        .filter((session) => session.status === ClassSessionStatus.COMPLETED)
        .sort((left, right) => right.startsAt.getTime() - left.startsAt.getTime())[0] ?? null;
    const activeSession = nextSession ?? latestCompletedSession;
    const focusTopic = weakestTopicByClass.get(classItem.id)?.topic ?? classItem.subject.name;
    const assignmentsForClass = classHomeworkAssignments.filter(
      (assignment) => assignment.classId === classItem.id,
    );

    const studentSignals = classItem.enrollments
      .map((enrollment) => {
        const readinessSubmission = classItem.readinessChecks.find(
          (submission) => submission.studentId === enrollment.studentId,
        );
        const studentMastery = masteryRecords
          .filter(
            (record) =>
              record.studentId === enrollment.studentId &&
              record.subjectId === classItem.subjectId,
          )
          .sort((left, right) => left.masteryScore - right.masteryScore)[0];
        const studentAttendance = classItem.sessions
          .flatMap((session) => session.attendanceRecords)
          .filter((record) => record.studentId === enrollment.studentId)
          .map((record) => record.status);
        const attendanceRate = getAttendanceRate(studentAttendance);
        const studentAssignments = assignmentsForClass.filter(
          (assignment) => assignment.studentId === enrollment.studentId,
        );
        const studentSubmissions = studentAssignments.flatMap((assignment) =>
          assignment.submissions.filter(
            (submission) => submission.studentId === enrollment.studentId,
          ),
        );
        const completionRate =
          studentAssignments.length > 0
            ? Math.round((studentSubmissions.length / studentAssignments.length) * 100)
            : null;

        let priority: LiveClassStudentSignal["priority"] = "steady";
        let coachNote = "Keep this learner engaged with one short explanation or retrieval check.";

        if ((readinessSubmission?.score ?? 100) < 50 || (studentMastery?.masteryScore ?? 100) < 55) {
          priority = "high";
          coachNote = `Check ${studentMastery?.topicLabel ?? focusTopic} early and give one guided success before independent work.`;
        } else if ((completionRate ?? 100) < 75 || (attendanceRate !== null && attendanceRate < 80)) {
          priority = "medium";
          coachNote =
            "Use one named check-in during class and confirm this learner knows the first step.";
        }

        return {
          studentId: enrollment.studentId,
          studentName: enrollment.student.fullName,
          readinessLabel: readinessSubmission
            ? `${Math.round(readinessSubmission.score)}% readiness`
            : "Readiness pending",
          masteryLabel: studentMastery
            ? `${Math.round(studentMastery.masteryScore)}% on ${studentMastery.topicLabel}`
            : `Mastery baseline pending`,
          attendanceLabel:
            attendanceRate !== null
              ? `${attendanceRate}% attendance signal`
              : "Attendance baseline pending",
          homeworkLabel:
            completionRate !== null
              ? `${completionRate}% homework completion`
              : "No homework signal yet",
          priority,
          coachNote,
          recentActionLabel: recentActionByStudent.get(enrollment.studentId),
        };
      })
      .sort((left, right) => {
        const priorityRank = { high: 0, medium: 1, steady: 2 };

        return priorityRank[left.priority] - priorityRank[right.priority];
      });

    const rosterReadyCount = studentSignals.filter(
      (item) => item.priority === "steady",
    ).length;
    const supportCount = studentSignals.filter((item) => item.priority !== "steady").length;
    const sessionMode =
      supportCount > 0 ? "Targeted support live class" : "Balanced guided practice";

    return {
      classId: classItem.id,
      sessionTitle: activeSession?.title ?? `${classItem.title} live class`,
      sessionStatus: activeSession
        ? activeSession.status === ClassSessionStatus.LIVE
          ? "Live now"
          : activeSession.status === ClassSessionStatus.SCHEDULED
            ? "Upcoming"
            : "Recent session"
        : "No session scheduled yet",
      sessionTime: activeSession
        ? formatSessionRange(activeSession.startsAt, activeSession.endsAt)
        : classItem.schedule,
      liveRoomUrl: activeSession?.liveRoomUrl ?? null,
      focusTopic,
      sessionMode,
      rosterReadyCount,
      supportCount,
      quickWins: [
        `Open with one easy win on ${focusTopic.toLowerCase()}.`,
        supportCount > 0
          ? `Name-check ${supportCount} learner(s) who need extra confidence in the first 10 minutes.`
          : "Keep the room moving with one short concept check before longer practice.",
        "Use one student explanation before moving into the next exercise.",
      ],
      tutorChecklist: [
        "Confirm the live objective in one sentence before teaching.",
        "Use a quick quiz or poll if the room slows down.",
        "Close by linking the recap to tutor-approved homework or revision tasks.",
      ],
      studentSignals,
    };
  });

  const riskCandidates = classes.flatMap((classItem) => {
    const assignmentsForClass = classHomeworkAssignments.filter(
      (assignment) => assignment.classId === classItem.id,
    );

    return classItem.enrollments.map((enrollment) => {
      const studentAssignments = assignmentsForClass.filter(
        (assignment) => assignment.studentId === enrollment.studentId,
      );
      const studentSubmissions = studentAssignments.flatMap((assignment) =>
        assignment.submissions.filter(
          (submission) => submission.studentId === enrollment.studentId,
        ),
      );
      const completionRate =
        studentAssignments.length > 0
          ? Math.round((studentSubmissions.length / studentAssignments.length) * 100)
          : null;
      const studentAttendance = classItem.sessions
        .flatMap((session) => session.attendanceRecords)
        .filter((record) => record.studentId === enrollment.studentId)
        .map((record) => record.status);
      const attendanceRate = getAttendanceRate(studentAttendance);
      const weakestMastery = masteryRecords
        .filter(
          (record) =>
            record.studentId === enrollment.studentId &&
            record.subjectId === classItem.subjectId,
        )
        .sort((left, right) => left.masteryScore - right.masteryScore)[0];
      const readinessSubmission = classItem.readinessChecks.find(
        (submission) => submission.studentId === enrollment.studentId,
      );

      let severity = 0;
      let risk = "";
      let action = "";

      if (attendanceRate !== null && attendanceRate < 75) {
        severity = 90 - attendanceRate;
        risk = `Attendance dropped to ${attendanceRate}% in recent completed sessions.`;
        action =
          "Follow up before the next live class and include attendance context in the next parent report.";
      } else if (completionRate !== null && completionRate < 60) {
        severity = 80 - completionRate;
        risk = `Homework completion is ${completionRate}% across tutor-approved assignments.`;
        action =
          "Assign a shorter revision task and review the barrier during the next class check-in.";
      } else if (weakestMastery && weakestMastery.masteryScore < 55) {
        severity = 75 - weakestMastery.masteryScore;
        risk = `Repeated mistakes in ${weakestMastery.topicLabel}.`;
        action =
          "Use guided examples during live teaching and keep the next revision set tightly scoped.";
      } else if (readinessSubmission && readinessSubmission.score < 50) {
        severity = 60 - readinessSubmission.score;
        risk = `Latest readiness check came back at ${Math.round(readinessSubmission.score)}%.`;
        action =
          "Adjust the live warm-up and give this student extra attention in the first 10 minutes.";
      }

      if (severity <= 0 || !risk) {
        return null;
      }

      return {
        student: enrollment.student.fullName,
        risk,
        action,
        severity,
      };
    });
  });

  const riskAlerts = riskCandidates
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((left, right) => right.severity - left.severity)
    .slice(0, 4)
    .map((item) => ({
      student: item.student,
      risk: item.risk,
      action: item.action,
    }));

  const classIntelligence = classes.map((classItem) => {
    const linkedLessonPlan = latestLessonPlanByClass.get(classItem.id) ?? null;
    const classStudentIds = new Set(
      classItem.enrollments.map((enrollment) => enrollment.studentId),
    );
    const classMastery = masteryRecords.filter(
      (record) =>
        record.subjectId === classItem.subjectId && classStudentIds.has(record.studentId),
    );
    const classAssignments = classHomeworkAssignments.filter(
      (assignment) => assignment.classId === classItem.id,
    );
    const readinessSubmissionsForClass = classItem.readinessChecks;
    const readinessScore = readinessSubmissionsForClass.length
      ? Math.round(average(readinessSubmissionsForClass.map((item) => item.score)))
      : classMastery.length
        ? Math.round(average(classMastery.map((record) => record.masteryScore)))
        : 0;
    const latestCompletedSession =
      [...classItem.sessions]
        .filter((session) => session.status === ClassSessionStatus.COMPLETED)
        .sort((left, right) => right.startsAt.getTime() - left.startsAt.getTime())[0] ?? null;
    const completedSessions = classItem.sessions.filter(
      (session) => session.status === ClassSessionStatus.COMPLETED,
    );
    const sessionParticipationSignals = completedSessions
      .map((session) =>
        session.participationRate === null ? null : session.participationRate * 100,
      )
      .filter((value): value is number => value !== null);
    const attendanceParticipationSignals = completedSessions.flatMap((session) =>
      session.attendanceRecords
        .map((record) =>
          record.participationScore === null ? null : record.participationScore * 100,
        )
        .filter((value): value is number => value !== null),
    );
    const participationSignals = [
      ...sessionParticipationSignals,
      ...attendanceParticipationSignals,
    ];
    const participationScore = participationSignals.length
      ? roundPercentage(average(participationSignals))
      : readinessScore > 0
        ? roundPercentage(readinessScore - 4)
        : 62;
    const studentPracticeRatio = clampNumber(
      Math.round(42 + (participationScore - 55) * 0.45 + (readinessScore - 50) * 0.18),
      36,
      74,
    );
    const tutorGuidanceRatio = 100 - studentPracticeRatio;
    const weakTopic = weakestTopicByClass.get(classItem.id)?.topic ?? classItem.subject.name;
    const lowReadinessStudents = readinessSubmissionsForClass.filter(
      (item) => item.score < 50,
    ).length;
    const openHomeworkCount = classAssignments.filter((assignment) =>
      assignment.submissions.every((submission) => submission.submittedAt === null),
    ).length;
    const durationMinutes =
      latestCompletedSession?.endsAt
        ? Math.max(
            1,
            Math.round(
              (latestCompletedSession.endsAt.getTime() -
                latestCompletedSession.startsAt.getTime()) /
                60000,
            ),
          )
        : 60;
    const teachingPattern =
      studentPracticeRatio >= 62
        ? "Practice-led hybrid"
        : studentPracticeRatio >= 50
          ? "Balanced guided practice"
          : "Tutor-guided intervention";
    const aiInsight =
      lowReadinessStudents > 0
        ? `${lowReadinessStudents} learner(s) need extra support before the live session, with ${weakTopic} as the main drag on confidence.`
        : `${weakTopic} remains the weakest class-wide topic, but live participation is stable enough to keep the lesson interactive.`;
    const nextMove =
      lowReadinessStudents > 0
        ? `Start with a short rebuild on ${weakTopic}, then move into paired practice before widening the task.`
        : `Keep the opening brief, check understanding early, and spend the longest block on applied ${weakTopic.toLowerCase()}.`;

    const pulseRows: ClassIntelligencePulseRow[] = [
      {
        label: "Entry",
        values: buildPulseRow(readinessScore || 48, [-12, -6, 3, 8, 2, -4]),
      },
      {
        label: "Concept",
        values: buildPulseRow(participationScore, [-18, -8, 6, 10, 2, -6]),
      },
      {
        label: "Guided",
        values: buildPulseRow(100 - tutorGuidanceRatio + 28, [-10, -2, 8, 6, -3, -10]),
      },
      {
        label: "Practice",
        values: buildPulseRow(studentPracticeRatio + 14, [-20, -10, 2, 10, 6, -2]),
      },
      {
        label: "Close",
        values: buildPulseRow(
          latestCompletedSession?.attendanceRecords.length
            ? participationScore - 6
            : readinessScore - 8,
          [-8, -3, 5, 8, 2, -7],
        ),
      },
    ];

    const balanceValues = normalizePercentages([
      tutorGuidanceRatio - 6,
      16 + lowReadinessStudents * 5,
      studentPracticeRatio,
      12 + Math.max(0, 2 - lowReadinessStudents) * 2,
    ]);

    const teachingBalance: ClassIntelligenceBalanceItem[] = [
      {
        mode: "Explain",
        percent: balanceValues[0] ?? 0,
        note: "Tutor-led framing and worked examples.",
      },
      {
        mode: "Check",
        percent: balanceValues[1] ?? 0,
        note: "Quick questions, polls, and cold-check moments.",
      },
      {
        mode: "Practice",
        percent: balanceValues[2] ?? 0,
        note: "Student attempt time with visible tutor support.",
      },
      {
        mode: "Reflect",
        percent: balanceValues[3] ?? 0,
        note: "Exit review, recap, and error correction.",
      },
    ];

    const focusCheckpoints: ClassIntelligenceCheckpoint[] = [
      {
        id: `${classItem.id}-checkpoint-entry`,
        timeLabel: "First 8 min",
        title: `Reset confidence in ${weakTopic}`,
        signal:
          readinessScore > 0
            ? `${readinessScore}% readiness signal`
            : "No readiness signal yet",
        note:
          lowReadinessStudents > 0
            ? "Use one easy success question before moving into the core task."
            : "Use a short warm-up to confirm baseline understanding.",
      },
      {
        id: `${classItem.id}-checkpoint-middle`,
        timeLabel: "Middle block",
        title: "Ask one high-value concept check",
        signal: `${participationScore}% participation energy`,
        note:
          participationScore >= 80
            ? "Push for student explanation, not just correct answers."
            : "Pause and rephrase before moving into independent attempts.",
      },
      {
        id: `${classItem.id}-checkpoint-close`,
        timeLabel: "Final 10 min",
        title: "Close the loop with tutor-approved next steps",
        signal:
          openHomeworkCount > 0
            ? `${openHomeworkCount} assignment(s) still open`
            : "Homework flow ready",
        note:
          openHomeworkCount > 0
            ? "Keep homework light and tightly linked to the weakest topic."
            : "Use the closing recap to point students to the assigned revision path.",
      },
    ];

    const teachingSlices: ClassIntelligenceSlice[] = [
      {
        id: `${classItem.id}-slice-open`,
        timeLabel: formatMinuteWindow(0, 8),
        title: `Warm-up and reset on ${weakTopic}`,
        summary:
          readinessScore > 0
            ? `Use the opening to quickly re-anchor the class around ${weakTopic} before increasing pace.`
            : `Use the opening to establish baseline understanding before the main live teaching starts.`,
        teacherMove:
          lowReadinessStudents > 0
            ? "Lead with one low-stakes success question, then ask one student to explain the method."
            : "Start with a short retrieval prompt and confirm the class can name the key method.",
        studentSignal:
          readinessScore > 0
            ? `${readinessScore}% readiness suggests the opener should stay short and confidence-building.`
            : "No readiness check yet, so the opening should act as the first live diagnostic.",
      },
      {
        id: `${classItem.id}-slice-model`,
        timeLabel: formatMinuteWindow(8, 20),
        title: "Guided modelling with visible reasoning",
        summary:
          "This is the best window for the tutor to show how to think, not just what answer to write.",
        teacherMove:
          participationScore >= 80
            ? "Model one worked example, then ask students to narrate the next step back to you."
            : "Slow the explanation slightly and pause after each transformation to check understanding.",
        studentSignal: `${participationScore}% participation energy supports a guided explanation block here.`,
      },
      {
        id: `${classItem.id}-slice-practice`,
        timeLabel: formatMinuteWindow(20, 42),
        title: "Student practice with targeted tutor intervention",
        summary:
          "Shift into short practice bursts so the tutor can spot repeated mistakes before they harden.",
        teacherMove: `Spend the longest block on ${weakTopic.toLowerCase()}, then circulate with one recovery hint at a time.`,
        studentSignal: `${studentPracticeRatio}% of this lesson should feel like supervised student attempt time.`,
      },
      {
        id: `${classItem.id}-slice-close`,
        timeLabel: formatMinuteWindow(42, durationMinutes),
        title: "Close, reflect, and connect homework",
        summary:
          "Use the final stretch to consolidate the method and tie the next assignment to exactly what happened in class.",
        teacherMove:
          openHomeworkCount > 0
            ? "End with one recap question and assign the smallest useful next step."
            : "End with one student explanation and preview the tutor-approved revision path.",
        studentSignal:
          openHomeworkCount > 0
            ? `${openHomeworkCount} homework item(s) still need follow-through after class.`
            : "The current homework flow is clear enough for a short, focused close.",
      },
    ];

    const coreQuestions: ClassIntelligenceQuestion[] = [
      {
        id: `${classItem.id}-question-1`,
        timeLabel: formatMinuteWindow(4, 6),
        question: `What is the first clue that tells us this is a ${weakTopic.toLowerCase()} problem?`,
        intent: "Checks whether students can classify the task before they try to solve it.",
        recommendedFollowUp:
          "If answers are vague, rephrase with two choices and ask students to justify which one fits.",
      },
      {
        id: `${classItem.id}-question-2`,
        timeLabel: formatMinuteWindow(18, 22),
        question: "Which step would break first if we rushed this method?",
        intent: "Surfaces fragile understanding before independent practice begins.",
        recommendedFollowUp:
          "Ask one student to explain the step verbally while you write their reasoning in tutor language.",
      },
      {
        id: `${classItem.id}-question-3`,
        timeLabel: formatMinuteWindow(38, 44),
        question: "If you had to teach this to a friend in one sentence, what would you say?",
        intent: "Creates a final retrieval moment and shows whether students can summarize the method clearly.",
        recommendedFollowUp:
          "Use the strongest student answer as the verbal bridge into homework or parent-visible progress notes.",
      },
    ];

    const tutorEditedRecord = getJsonStringRecord(linkedLessonPlan?.tutorEditedContent ?? null);
    const tutorEditedInsight =
      tutorEditedRecord && typeof tutorEditedRecord.aiInsight === "string"
        ? tutorEditedRecord.aiInsight
        : null;
    const tutorEditedNextMove =
      tutorEditedRecord && typeof tutorEditedRecord.nextMove === "string"
        ? tutorEditedRecord.nextMove
        : null;
    const tutorEditedSlices = getJsonObjectArray(tutorEditedRecord?.teachingSlices ?? null)
      .map((item, index) => {
        const id =
          typeof item.id === "string" ? item.id : `${classItem.id}-edited-slice-${index}`;
        const timeLabel =
          typeof item.timeLabel === "string" ? item.timeLabel : formatMinuteWindow(index * 10, (index + 1) * 10);
        const title = typeof item.title === "string" ? item.title : "Tutor-edited slice";
        const summary = typeof item.summary === "string" ? item.summary : "";
        const teacherMove =
          typeof item.teacherMove === "string" ? item.teacherMove : "";
        const studentSignal =
          typeof item.studentSignal === "string" ? item.studentSignal : "";

        return {
          id,
          timeLabel,
          title,
          summary,
          teacherMove,
          studentSignal,
        };
      });
    const tutorEditedQuestions = getJsonObjectArray(tutorEditedRecord?.coreQuestions ?? null)
      .map((item, index) => {
        const id =
          typeof item.id === "string" ? item.id : `${classItem.id}-edited-question-${index}`;
        const timeLabel =
          typeof item.timeLabel === "string" ? item.timeLabel : formatMinuteWindow(index * 10, index * 10 + 4);
        const question =
          typeof item.question === "string" ? item.question : "Tutor-edited question";
        const intent = typeof item.intent === "string" ? item.intent : "";
        const recommendedFollowUp =
          typeof item.recommendedFollowUp === "string" ? item.recommendedFollowUp : "";

        return {
          id,
          timeLabel,
          question,
          intent,
          recommendedFollowUp,
        };
      });

    return {
      classId: classItem.id,
      className: classItem.title,
      subject: classItem.subject.name,
      linkedLessonPlanId: linkedLessonPlan?.id ?? null,
      linkedLessonPlanTitle: linkedLessonPlan?.title ?? null,
      linkedLessonPlanStatus: linkedLessonPlan
        ? prismaToUiStatus[linkedLessonPlan.approvalStatus]
        : null,
      durationMinutes,
      readinessScore,
      participationScore,
      tutorGuidanceRatio,
      studentPracticeRatio,
      teachingPattern,
      aiInsight: tutorEditedInsight ?? aiInsight,
      nextMove: tutorEditedNextMove ?? nextMove,
      pulseRows,
      focusCheckpoints,
      teachingBalance,
      teachingSlices: tutorEditedSlices.length > 0 ? tutorEditedSlices : teachingSlices,
      coreQuestions: tutorEditedQuestions.length > 0 ? tutorEditedQuestions : coreQuestions,
    };
  });

  return {
    summary: {
      lessonPlanDrafts: lessonPlans.length,
      studyPlanQueue: studyPlans.length,
      homeworkQueue: homeworkAssignments.length,
      parentReportQueue: parentReports.length,
      readinessQueue: readinessSubmissions.length,
      submissionReviewQueue: homeworkSubmissions.length,
      classSummaryQueue: classSummaries.length,
      totalPendingApprovals:
        lessonPlans.length +
        studyPlans.length +
        classSummaries.length +
        homeworkAssignments.length +
        parentReports.length +
        readinessSubmissions.length +
        homeworkSubmissions.length,
    },
    lessonSuggestions: lessonPlans.map((item) => ({
      id: item.id,
      entityType: "lesson_plan",
      resourcePath: `/api/lesson-plans/${item.id}`,
      title: item.title,
      detail:
        item.aiDraft && typeof item.aiDraft === "object"
          ? "AI-generated lesson draft ready for tutor review."
          : "Lesson plan requires tutor review before class delivery.",
      status: prismaToUiStatus[item.approvalStatus],
      generatedAt: formatDate(item.generatedByAiAt ?? item.createdAt),
      reviewedAt: formatDate(item.reviewedByTutorAt),
      approvedByTutorId: item.approvedByTutorId ?? "pending",
      versionHistory: getVersionHistory(item.versionHistory),
      availableActions: getAvailableActions(prismaToUiStatus[item.approvalStatus]),
      draftPreview: getDraftPreview(item.aiDraft),
    })),
    studyPlanQueue: studyPlans.map((item) => ({
      id: item.id,
      entityType: "study_plan",
      resourcePath: `/api/study-plans/${item.id}`,
      title: item.title,
      owner:
        classes.find((classItem) => classItem.id === item.classId)?.title ??
        "Tutor study plan",
      status: prismaToUiStatus[item.approvalStatus],
      generatedAt: formatDate(item.generatedByAiAt ?? item.createdAt),
      reviewedAt: formatDate(item.reviewedByTutorAt),
      approvedByTutorId: item.approvedByTutorId ?? "pending",
      versionHistory: getVersionHistory(item.versionHistory),
      availableActions: getAvailableActions(prismaToUiStatus[item.approvalStatus]),
      draftPreview: getDraftPreview(item.tutorEditedContent ?? item.aiDraft),
      studyPlanTopics: item.revisionTopics.map((topic) => ({
        id: topic.id,
        topicKey: topic.topicKey,
        topicLabel: topic.topicLabel,
        accessApproved: topic.accessApproved,
        sequenceOrder: topic.sequenceOrder,
      })),
    })),
    classSummaryQueue: classSummaries.map((item) => ({
      id: item.id,
      entityType: "class_summary",
      resourcePath: `/api/class-summaries/${item.id}`,
      title: `Class summary for session ${item.classSessionId}`,
      owner: item.classId,
      status: prismaToUiStatus[item.approvalStatus],
      generatedAt: formatDate(item.generatedByAiAt ?? item.createdAt),
      reviewedAt: formatDate(item.reviewedByTutorAt),
      approvedByTutorId: item.approvedByTutorId ?? "pending",
      versionHistory: getVersionHistory(item.versionHistory),
      availableActions: getAvailableActions(prismaToUiStatus[item.approvalStatus]),
      draftPreview: getDraftPreview(item.aiDraft),
    })),
    assignmentQueue: homeworkAssignments.map((item) => ({
      id: item.id,
      entityType: "homework_assignment",
      resourcePath: `/api/homework-assignments/${item.id}`,
      title: `Homework for ${item.studentId}`,
      owner: item.classId,
      status: prismaToUiStatus[item.approvalStatus],
      generatedAt: formatDate(item.generatedByAiAt ?? item.createdAt),
      reviewedAt: formatDate(item.reviewedByTutorAt),
      approvedByTutorId: item.approvedByTutorId ?? "pending",
      versionHistory: getVersionHistory(item.versionHistory),
      availableActions: getAvailableActions(prismaToUiStatus[item.approvalStatus]),
      draftPreview: getDraftPreview(item.assignmentContent),
    })),
    parentReportQueue: parentReports.map((item) => ({
      id: item.id,
      entityType: "parent_report",
      resourcePath: `/api/parent-reports/${item.id}`,
      title: `Progress report for ${item.studentId}`,
      owner: item.classId ?? "Direct parent channel",
      status: prismaToUiStatus[item.approvalStatus],
      generatedAt: formatDate(item.generatedByAiAt ?? item.createdAt),
      reviewedAt: formatDate(item.reviewedByTutorAt),
      approvedByTutorId: item.approvedByTutorId ?? "pending",
      versionHistory: getVersionHistory(item.versionHistory),
      availableActions: getAvailableActions(prismaToUiStatus[item.approvalStatus]),
      draftPreview: getDraftPreview(item.aiSummary),
    })),
    readinessQueue: readinessSubmissions.map((item) => ({
      id: item.id,
      entityType: "readiness_check",
      resourcePath: `/api/readiness-checks/${item.id}`,
      title: `Readiness check from ${item.studentId}`,
      owner: item.classId,
      status: prismaToUiStatus[item.approvalStatus],
      generatedAt: formatDate(item.generatedByAiAt ?? item.submittedAt),
      reviewedAt: formatDate(item.reviewedByTutorAt),
      approvedByTutorId: item.approvedByTutorId ?? "pending",
      versionHistory: getVersionHistory(item.versionHistory),
      availableActions: getAvailableActions(prismaToUiStatus[item.approvalStatus]),
      draftPreview: getDraftPreview(item.aiSummary),
    })),
    submissionReviewQueue: homeworkSubmissions.map((item) => ({
      id: item.id,
      studentId: item.studentId,
      homeworkAssignmentId: item.homeworkAssignmentId,
      title:
        typeof item.homeworkAssignment.assignmentContent === "object" &&
        item.homeworkAssignment.assignmentContent !== null &&
        !Array.isArray(item.homeworkAssignment.assignmentContent) &&
        typeof item.homeworkAssignment.assignmentContent.title === "string"
          ? item.homeworkAssignment.assignmentContent.title
          : `Homework submission ${item.homeworkAssignmentId}`,
      owner: item.homeworkAssignment.classId,
      submittedAt: formatDate(item.submittedAt),
      score: item.score === null ? "Pending" : `${Math.round(item.score)}%`,
      tutorFeedback: item.tutorFeedback ?? "Pending tutor feedback",
      needsReview: item.score === null || item.tutorFeedback === null,
    })),
    todaysClasses,
    liveClassWorkspace,
    afterClassFollowUp,
    weakTopicHeatmap,
    riskAlerts,
    classIntelligence,
    source: "database",
  };
}
