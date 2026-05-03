import {
  ApprovalStatus,
  AttendanceStatus,
  ClassSessionStatus,
  EnrollmentStatus,
  HomeworkLifecycleStatus,
  StudyPlanStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  average,
  formatDate,
  formatDateTime,
  getAttendanceRate,
  getJsonNumber,
  getJsonObjectArray,
  getJsonString,
  getJsonStringArray,
} from "@/lib/server/dashboard-helpers";

type StudentMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "gold" | "coral";
};

type StudentHomeworkItem = {
  id: string;
  submissionId: string | null;
  title: string;
  scope: string;
  prompt: string;
  questionCount: number | null;
  checkpoints: string[];
  questions: Array<{
    id: string;
    prompt: string;
    hint: string | null;
  }>;
  dueDate: string;
  status: string;
  canSubmit: boolean;
  canResubmit: boolean;
  submittedAt: string | null;
  score: string | null;
  tutorFeedback: string | null;
  submissionDetails: {
    completedQuestions: string | null;
    answerSummary: string | null;
    answers: Array<{
      questionId: string;
      prompt: string;
      answer: string;
    }>;
    workingNotes: string | null;
    reflection: string | null;
    confidenceLabel: string | null;
    confidenceValue: number | null;
    tutorReview: Array<{
      questionId: string;
      prompt: string;
      answer: string;
      feedback: string;
    }>;
    versionCount: number;
  } | null;
};

type StudentProgressItem = {
  id: string;
  title: string;
  note: string;
  mastery: number;
  status: "strong" | "watch" | "support";
};

type StudentProgressSnapshot = {
  averageMastery: number | null;
  attendanceRate: number | null;
  homeworkCompletionRate: number | null;
  reviewedTopics: number;
  submissionCount: number;
};

type StudentProgressSeriesItem = {
  label: string;
  value: number;
  note: string;
  tone: "blue" | "mint" | "gold" | "purple";
};

type StudentHistoryItem = {
  id: string;
  title: string;
  detail: string;
  dateLabel: string;
  type: "class" | "homework" | "mastery" | "report";
};

export type StudentDashboardData = {
  metrics: StudentMetric[];
  welcomeMessage: {
    title: string;
    body: string;
  } | null;
  assistantUnlockNotice: {
    title: string;
    body: string;
    topics: string[];
  } | null;
  enrollmentStatus: {
    className: string;
    subject: string;
    tutorName: string;
    schedule: string;
    statusLabel: string;
  } | null;
  upcomingClass: {
    className: string;
    subject: string;
    nextClassLabel: string;
    tutorName: string;
  };
  assignedHomework: StudentHomeworkItem[];
  teacherNotes: string[];
  progressSnapshot: StudentProgressSnapshot;
  progressSeries: StudentProgressSeriesItem[];
  subjectProgress: StudentProgressItem[];
  learningHistory: StudentHistoryItem[];
  revisionTasks: string[];
  approvedAssistantScope: string[];
  source: "database" | "unconfigured";
  message?: string;
};

function getProgressStatus(masteryScore: number): StudentProgressItem["status"] {
  if (masteryScore >= 75) {
    return "strong";
  }

  if (masteryScore >= 50) {
    return "watch";
  }

  return "support";
}

function getConfidenceLabel(value: number | null) {
  if (value === null) {
    return null;
  }

  if (value >= 5) {
    return "Very confident";
  }

  if (value === 4) {
    return "Confident";
  }

  if (value === 3) {
    return "Getting there";
  }

  if (value === 2) {
    return "Still unsure";
  }

  return "Need tutor help";
}

function buildHomeworkQuestions(
  assignmentContent: unknown,
  focus: string,
  questionCount: number | null,
) {
  const explicitQuestions = getJsonObjectArray(
    assignmentContent as never,
    "questionItems",
  )
    .map((item, index) => {
      const prompt =
        typeof item.prompt === "string"
          ? item.prompt
          : typeof item.title === "string"
            ? item.title
            : null;

      if (!prompt) {
        return null;
      }

      return {
        id:
          typeof item.id === "string"
            ? item.id
            : `question-${index + 1}`,
        prompt,
        hint: typeof item.hint === "string" ? item.hint : null,
      };
    })
    .filter(
      (
        item,
      ): item is { id: string; prompt: string; hint: string | null } =>
        item !== null,
    );

  if (explicitQuestions.length > 0) {
    return explicitQuestions;
  }

  const promptList = getJsonStringArray(
    assignmentContent as never,
    "questionPrompts",
  );

  if (promptList.length > 0) {
    return promptList.map((prompt, index) => ({
      id: `question-${index + 1}`,
      prompt,
      hint: null,
    }));
  }

  const derivedCount = questionCount && questionCount > 0 ? questionCount : 3;

  return Array.from({ length: derivedCount }, (_, index) => ({
    id: `question-${index + 1}`,
    prompt: `Question ${index + 1}: Show how you would solve a ${focus.toLowerCase()} task from this lesson.`,
    hint:
      index === derivedCount - 1
        ? "Leave one step that still feels difficult so your tutor can follow up."
        : null,
  }));
}

export async function getStudentDashboardData(
  studentId?: string,
): Promise<StudentDashboardData> {
  if (!process.env.DATABASE_URL) {
    return {
      metrics: [],
      welcomeMessage: null,
      assistantUnlockNotice: null,
      enrollmentStatus: null,
      upcomingClass: {
        className: "Tutor-linked class pending database setup",
        subject: "SPM Mathematics",
        nextClassLabel: "Connect database to load live schedule",
        tutorName: "Teacher context unavailable",
      },
      assignedHomework: [],
      teacherNotes: [],
      progressSnapshot: {
        averageMastery: null,
        attendanceRate: null,
        homeworkCompletionRate: null,
        reviewedTopics: 0,
        submissionCount: 0,
      },
      progressSeries: [],
      subjectProgress: [],
      learningHistory: [],
      revisionTasks: [],
      approvedAssistantScope: [],
      source: "unconfigured",
      message:
        "DATABASE_URL is not configured yet. Connect a database to load live student dashboard data.",
    };
  }

  if (!studentId) {
    return {
      metrics: [],
      welcomeMessage: null,
      assistantUnlockNotice: null,
      enrollmentStatus: null,
      upcomingClass: {
        className: "No linked student",
        subject: "Tutor-linked subject required",
        nextClassLabel: "Pending",
        tutorName: "Pending",
      },
      assignedHomework: [],
      teacherNotes: [],
      progressSnapshot: {
        averageMastery: null,
        attendanceRate: null,
        homeworkCompletionRate: null,
        reviewedTopics: 0,
        submissionCount: 0,
      },
      progressSeries: [],
      subjectProgress: [],
      learningHistory: [],
      revisionTasks: [],
      approvedAssistantScope: [],
      source: "database",
      message: "Student dashboard needs a linked student profile.",
    };
  }

  const enrollment = await prisma.classEnrollment.findFirst({
    where: {
      studentId,
      status: EnrollmentStatus.ACTIVE,
    },
    include: {
      class: {
        include: {
          subject: true,
          tutor: true,
          sessions: {
            orderBy: { startsAt: "asc" },
            take: 6,
          },
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  if (!enrollment) {
    return {
      metrics: [],
      welcomeMessage: null,
      assistantUnlockNotice: null,
      enrollmentStatus: null,
      upcomingClass: {
        className: "No active tutor-linked class",
        subject: "Assignment required",
        nextClassLabel: "Pending class enrollment",
        tutorName: "Pending tutor assignment",
      },
      assignedHomework: [],
      teacherNotes: [],
      progressSnapshot: {
        averageMastery: null,
        attendanceRate: null,
        homeworkCompletionRate: null,
        reviewedTopics: 0,
        submissionCount: 0,
      },
      progressSeries: [],
      subjectProgress: [],
      learningHistory: [],
      revisionTasks: [],
      approvedAssistantScope: [],
      source: "database",
      message: "This student is not enrolled in an active tutor-led class yet.",
    };
  }

  const upcomingSession =
    enrollment.class.sessions.find(
      (session) =>
        session.status === ClassSessionStatus.SCHEDULED ||
        session.status === ClassSessionStatus.LIVE,
    ) ?? null;

  const [
    homeworkAssignments,
    studyPlan,
    latestAnyStudyPlan,
    masteryRecords,
    latestReport,
    latestReadiness,
    submissions,
    attendanceRecords,
  ] =
    await Promise.all([
      prisma.homeworkAssignment.findMany({
        where: {
          studentId,
          approvalStatus: {
            in: [ApprovalStatus.APPROVED, ApprovalStatus.ASSIGNED],
          },
          status: {
            in: [
              HomeworkLifecycleStatus.APPROVED,
              HomeworkLifecycleStatus.ASSIGNED,
              HomeworkLifecycleStatus.SUBMITTED,
              HomeworkLifecycleStatus.OVERDUE,
            ],
          },
        },
        orderBy: { dueDate: "asc" },
        take: 4,
      }),
      prisma.studyPlan.findFirst({
        where: {
          studentId,
          subjectId: enrollment.class.subjectId,
          status: StudyPlanStatus.ACTIVE,
          approvalStatus: {
            in: [ApprovalStatus.APPROVED, ApprovalStatus.ASSIGNED],
          },
        },
        include: {
          revisionTopics: {
            where: { accessApproved: true },
            orderBy: { sequenceOrder: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.studyPlan.findFirst({
        where: {
          studentId,
          subjectId: enrollment.class.subjectId,
          classId: enrollment.class.id,
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.studentMastery.findMany({
        where: {
          studentId,
          subjectId: enrollment.class.subjectId,
        },
        orderBy: { masteryScore: "asc" },
        take: 6,
      }),
      prisma.parentReport.findFirst({
        where: {
          studentId,
          tutorId: enrollment.class.tutorId,
          approvalStatus: ApprovalStatus.APPROVED,
        },
        orderBy: [{ approvedAt: "desc" }, { createdAt: "desc" }],
      }),
      prisma.readinessCheckSubmission.findFirst({
        where: {
          studentId,
          classId: enrollment.class.id,
          approvalStatus: {
            in: [ApprovalStatus.APPROVED, ApprovalStatus.ASSIGNED, ApprovalStatus.TUTOR_REVIEWED],
          },
        },
        orderBy: [{ approvedAt: "desc" }, { submittedAt: "desc" }],
      }),
      prisma.homeworkSubmission.findMany({
        where: {
          studentId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.attendanceRecord.findMany({
        where: {
          studentId,
          classSession: {
            classId: enrollment.class.id,
          },
        },
        include: {
          classSession: true,
        },
        orderBy: {
          classSession: {
            startsAt: "desc",
          },
        },
      }),
    ]);

  const submissionsByAssignmentId = new Map(
    submissions.map((submission) => [submission.homeworkAssignmentId, submission]),
  );

  const avgMastery = Math.round(
    average(masteryRecords.map((record) => record.masteryScore)),
  );
  const attendanceRate =
    attendanceRecords.length > 0
      ? getAttendanceRate(attendanceRecords.map((record) => record.status))
      : null;
  const submittedHomeworkCount = submissions.filter((submission) =>
    Boolean(submission.submittedAt),
  ).length;
  const homeworkCompletionRate =
    homeworkAssignments.length > 0
      ? Math.round((submittedHomeworkCount / homeworkAssignments.length) * 100)
      : null;

  const approvedTopics = studyPlan?.revisionTopics ?? [];
  const assistantUnlockNotice =
    studyPlan && approvedTopics.length > 0
      ? {
          title: "New revision topics unlocked",
          body: `${enrollment.class.tutor.fullName} has approved ${approvedTopics.length} topic${
            approvedTopics.length > 1 ? "s" : ""
          } for your AI Study Assistant.`,
          topics: approvedTopics.map((topic) => topic.topicLabel),
        }
      : null;
  const reportSummary =
    getJsonString(latestReport?.aiSummary, "summary") ??
    "Tutor-approved progress updates will appear here after class review.";

  const metrics: StudentMetric[] = [
    {
      label: "Next Tutor-Led Class",
      value: upcomingSession ? formatDateTime(upcomingSession.startsAt) : enrollment.class.schedule,
      detail: `Live teaching stays anchored to ${enrollment.class.tutor.fullName}.`,
      tone: "teal",
    },
    {
      label: "Assigned Homework",
      value: `${homeworkAssignments.length} active`,
      detail: "Only tutor-approved work appears in the student workspace.",
      tone: homeworkAssignments.length > 0 ? "gold" : "teal",
    },
    {
      label: "Approved Revision Topics",
      value: `${approvedTopics.length} topics`,
      detail: "The AI Study Assistant is limited to these tutor-approved areas.",
      tone: "teal",
    },
    {
      label: "Average Mastery",
      value: masteryRecords.length > 0 ? `${avgMastery}%` : "Pending",
      detail: "Mastery is updated by AI and reviewed through the tutor workflow.",
      tone: avgMastery >= 70 ? "teal" : "coral",
    },
  ];

  const assignedHomework: StudentHomeworkItem[] = homeworkAssignments.map((item) => {
    const submission = submissionsByAssignmentId.get(item.id) ?? null;
    const completedQuestions = getJsonNumber(
      submission?.submissionContent ?? null,
      "completedQuestions",
    );
    const answerSummary =
      getJsonString(submission?.submissionContent ?? null, "answerSummary") ??
      getJsonString(submission?.submissionContent ?? null, "note");
    const workingNotes = getJsonString(
      submission?.submissionContent ?? null,
      "workingNotes",
    );
    const reflection = getJsonString(submission?.submissionContent ?? null, "reflection");
    const confidence = getJsonNumber(submission?.submissionContent ?? null, "confidence");
    const tutorReview = getJsonObjectArray(
      submission?.submissionContent ?? null,
      "tutorReviewItems",
    )
      .map((entry, index) => {
        const feedback =
          typeof entry.feedback === "string" ? entry.feedback : null;

        if (!feedback) {
          return null;
        }

        return {
          questionId:
            typeof entry.questionId === "string"
              ? entry.questionId
              : `question-${index + 1}`,
          prompt:
            typeof entry.prompt === "string"
              ? entry.prompt
              : `Question ${index + 1}`,
          answer:
            typeof entry.answer === "string" ? entry.answer : "Answer not provided",
          feedback,
        };
      })
      .filter(
        (
          entry,
        ): entry is {
          questionId: string;
          prompt: string;
          answer: string;
          feedback: string;
        } => entry !== null,
      );
    const submissionVersions = getJsonObjectArray(
      submission?.submissionContent ?? null,
      "submissionVersions",
    );
    const answers = getJsonObjectArray(submission?.submissionContent ?? null, "answers")
      .map((entry, index) => {
        const answer =
          typeof entry.answer === "string" ? entry.answer : null;

        if (!answer) {
          return null;
        }

        return {
          questionId:
            typeof entry.questionId === "string"
              ? entry.questionId
              : `question-${index + 1}`,
          prompt:
            typeof entry.prompt === "string"
              ? entry.prompt
              : `Question ${index + 1}`,
          answer,
        };
      })
      .filter(
        (
          entry,
        ): entry is { questionId: string; prompt: string; answer: string } =>
          entry !== null,
      );
    const title =
      getJsonString(item.assignmentContent, "title") ?? "Tutor-approved homework";
    const focus =
      getJsonString(item.assignmentContent, "focus") ?? "Targeted revision";
    const questionCount = getJsonNumber(item.assignmentContent, "questions");
    const prompt =
      getJsonString(item.assignmentContent, "prompt") ??
      `Work through ${focus.toLowerCase()}, show your method clearly, and leave one short note about what still feels difficult.`;
    const checkpoints = [
      questionCount
        ? `Complete all ${questionCount} questions before the next tutor check-in.`
        : "Complete the assigned questions before the next tutor check-in.",
      "Show your working or explain how you reached your answers.",
      "Leave one short reflection so your tutor knows where to follow up.",
    ];
    const questions = buildHomeworkQuestions(item.assignmentContent, focus, questionCount);
    const status = submission?.tutorFeedback || typeof submission?.score === "number"
      ? "reviewed"
      : submission?.submittedAt
        ? "submitted"
        : item.status.toLowerCase();

    return {
      id: item.id,
      submissionId: submission?.id ?? null,
      title,
      scope: questionCount
        ? `${focus} · ${questionCount} questions`
        : focus,
      prompt,
      questionCount,
      checkpoints,
      questions,
      dueDate: `Due ${formatDate(item.dueDate)}`,
      status,
      canSubmit: !submission?.submittedAt,
      canResubmit:
        Boolean(submission?.submittedAt) &&
        (Boolean(submission?.tutorFeedback) || typeof submission?.score === "number"),
      submittedAt: submission?.submittedAt
        ? formatDateTime(submission.submittedAt)
        : null,
      score:
        typeof submission?.score === "number"
          ? `${Math.round(submission.score)}%`
          : null,
      tutorFeedback: submission?.tutorFeedback ?? null,
      submissionDetails: submission
        ? {
            completedQuestions:
              typeof completedQuestions === "number"
                ? questionCount
                  ? `${completedQuestions}/${questionCount} questions completed`
                  : `${completedQuestions} questions completed`
                : null,
            answerSummary,
            answers,
            workingNotes,
            reflection,
            confidenceLabel: getConfidenceLabel(confidence),
            confidenceValue: confidence,
            tutorReview,
            versionCount: submissionVersions.length + 1,
          }
        : null,
    };
  });

  const teacherNotes = [
    reportSummary,
    latestReport?.tutorNotes ??
      `Teacher note: stay within ${enrollment.class.subject.name} and the current class plan.`,
    studyPlan
      ? `${studyPlan.title} is the active tutor-approved revision plan.`
      : "A tutor-approved study plan will appear here once it is published.",
  ];

  const subjectProgress: StudentProgressItem[] = masteryRecords.map((record) => ({
    id: record.id,
    title: record.topicLabel,
    note:
      record.tutorReviewNotes ??
      `Tutor-reviewed mastery updated ${formatDate(record.reviewedByTutorAt ?? record.updatedAt)}.`,
    mastery: Math.round(record.masteryScore),
    status: getProgressStatus(record.masteryScore),
  }));

  const progressSnapshot: StudentProgressSnapshot = {
    averageMastery: masteryRecords.length > 0 ? avgMastery : null,
    attendanceRate,
    homeworkCompletionRate,
    reviewedTopics: masteryRecords.length,
    submissionCount: submittedHomeworkCount,
  };

  const progressSeries: StudentProgressSeriesItem[] = [
    {
      label: "Readiness",
      value:
        typeof latestReadiness?.score === "number"
          ? Math.max(0, Math.min(100, Math.round(latestReadiness.score)))
          : 0,
      note:
        typeof latestReadiness?.score === "number"
          ? `${Math.round(latestReadiness.score)}% from your latest pre-class check.`
          : "Complete the readiness check to unlock your first baseline.",
      tone: "blue",
    },
    {
      label: "Attendance",
      value: attendanceRate ?? 0,
      note:
        attendanceRate !== null
          ? `${attendanceRate}% class attendance across recent tutor-led sessions.`
          : "Attendance will appear after your first recorded class.",
      tone: "mint",
    },
    {
      label: "Homework",
      value: homeworkCompletionRate ?? 0,
      note:
        homeworkCompletionRate !== null
          ? `${homeworkCompletionRate}% of current homework has been submitted.`
          : "Homework completion will appear after the first assignment cycle.",
      tone: "gold",
    },
    {
      label: "Mastery",
      value: avgMastery > 0 ? avgMastery : 0,
      note:
        masteryRecords.length > 0
          ? `${avgMastery}% current tutor-reviewed mastery across tracked topics.`
          : "Mastery updates appear after tutor review.",
      tone: "purple",
    },
  ];

  const learningHistorySeed = [
    ...attendanceRecords.slice(0, 3).map((record) => ({
      id: `class-${record.id}`,
      title: record.classSession.title,
      detail:
        record.status === AttendanceStatus.PRESENT
          ? `You attended this class and scored ${Math.round(record.participationScore ?? 0)}% participation.`
          : `Attendance status: ${record.status.toLowerCase().replace("_", " ")}.`,
      sortKey: record.classSession.startsAt.getTime(),
      dateLabel: formatDateTime(record.classSession.startsAt),
      type: "class" as const,
    })),
    ...submissions.slice(0, 3).map((submission) => {
      const assignment = homeworkAssignments.find(
        (item) => item.id === submission.homeworkAssignmentId,
      );

      return {
        id: `homework-${submission.id}`,
        title:
          getJsonString(assignment?.assignmentContent, "title") ??
          "Homework submission",
        detail:
          submission.tutorFeedback ??
          (typeof submission.score === "number"
            ? `Tutor reviewed this homework and gave ${Math.round(submission.score)}%.`
            : "Submitted to tutor and waiting for review."),
        sortKey: submission.updatedAt.getTime(),
        dateLabel: formatDateTime(submission.updatedAt),
        type: "homework" as const,
      };
    }),
    ...masteryRecords.slice(0, 3).map((record) => ({
      id: `mastery-${record.id}`,
      title: `${record.topicLabel} mastery updated`,
      detail:
        record.tutorReviewNotes ??
        `Mastery moved to ${Math.round(record.masteryScore)}% after tutor review.`,
      sortKey: (record.reviewedByTutorAt ?? record.updatedAt).getTime(),
      dateLabel: formatDate(record.reviewedByTutorAt ?? record.updatedAt),
      type: "mastery" as const,
    })),
    ...(latestReport
      ? [
          {
            id: `report-${latestReport.id}`,
            title: "Weekly tutor report approved",
            detail:
              getJsonString(latestReport.aiSummary, "summary") ??
              latestReport.tutorNotes ??
              "Your latest tutor-approved summary is ready.",
            sortKey: (latestReport.approvedAt ?? latestReport.updatedAt).getTime(),
            dateLabel: formatDate(latestReport.approvedAt ?? latestReport.updatedAt),
            type: "report" as const,
          },
        ]
      : []),
  ];

  const learningHistory: StudentHistoryItem[] = learningHistorySeed
    .sort((left, right) => right.sortKey - left.sortKey)
    .slice(0, 8);

  const revisionTasks = [
    ...approvedTopics.map(
      (topic, index) =>
        `Revision ${index + 1}: ${topic.topicLabel} within the approved ${studyPlan?.title ?? "study plan"}.`,
    ),
    ...assignedHomework
      .filter((item) => item.status !== "submitted")
      .map((item) => `${item.title} before ${item.dueDate.replace("Due ", "")}.`),
  ].slice(0, 6);

  const approvedAssistantScope = [
    `Approved class: ${enrollment.class.title} with ${enrollment.class.tutor.fullName}.`,
    `Approved subject: ${enrollment.class.subject.name}.`,
    approvedTopics.length > 0
      ? `Approved topics: ${approvedTopics.map((topic) => topic.topicLabel).join(", ")}.`
      : "Approved topics will appear after the tutor publishes the study plan.",
    "The AI Study Assistant cannot unlock new subjects or independent learning paths.",
  ];

  return {
    metrics,
    welcomeMessage: {
      title: "You are ready to start",
      body: studyPlan
        ? `${enrollment.class.tutor.fullName} has prepared ${studyPlan.title}. ${
            upcomingSession
              ? `Your next class is ${formatDateTime(upcomingSession.startsAt)}.`
              : `Class schedule: ${enrollment.class.schedule}.`
          }`
        : latestAnyStudyPlan
          ? `${enrollment.class.tutor.fullName} has scheduled your class and is reviewing your first study plan now. ${
              upcomingSession
                ? `Your next class is ${formatDateTime(upcomingSession.startsAt)}.`
                : `Class schedule: ${enrollment.class.schedule}.`
            }`
          : `${enrollment.class.tutor.fullName} has scheduled your class. ${
              upcomingSession
                ? `Your next class is ${formatDateTime(upcomingSession.startsAt)}.`
                : `Class schedule: ${enrollment.class.schedule}.`
            }`,
    },
    assistantUnlockNotice,
    enrollmentStatus: {
      className: enrollment.class.title,
      subject: enrollment.class.subject.name,
      tutorName: enrollment.class.tutor.fullName,
      schedule: enrollment.class.schedule,
      statusLabel: "Enrolled and ready",
    },
    upcomingClass: {
      className: enrollment.class.title,
      subject: enrollment.class.subject.name,
      nextClassLabel: upcomingSession
        ? formatDateTime(upcomingSession.startsAt)
        : enrollment.class.schedule,
      tutorName: enrollment.class.tutor.fullName,
    },
    assignedHomework,
    teacherNotes,
    progressSnapshot,
    progressSeries,
    subjectProgress,
    learningHistory,
    revisionTasks,
    approvedAssistantScope,
    source: "database",
  };
}
