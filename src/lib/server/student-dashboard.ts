import {
  ApprovalStatus,
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
  getJsonNumber,
  getJsonString,
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
  dueDate: string;
  status: string;
  canSubmit: boolean;
  submittedAt: string | null;
  score: string | null;
  tutorFeedback: string | null;
};

type StudentProgressItem = {
  id: string;
  title: string;
  note: string;
  mastery: number;
  status: "strong" | "watch" | "support";
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
  subjectProgress: StudentProgressItem[];
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
      subjectProgress: [],
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
      subjectProgress: [],
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
      subjectProgress: [],
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
    submissions,
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
      prisma.homeworkSubmission.findMany({
        where: {
          studentId,
        },
      }),
    ]);

  const submissionsByAssignmentId = new Map(
    submissions.map((submission) => [submission.homeworkAssignmentId, submission]),
  );

  const avgMastery = Math.round(
    average(masteryRecords.map((record) => record.masteryScore)),
  );

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
    const title =
      getJsonString(item.assignmentContent, "title") ?? "Tutor-approved homework";
    const focus =
      getJsonString(item.assignmentContent, "focus") ?? "Targeted revision";
    const questionCount = getJsonNumber(item.assignmentContent, "questions");
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
      dueDate: `Due ${formatDate(item.dueDate)}`,
      status,
      canSubmit: !submission?.submittedAt,
      submittedAt: submission?.submittedAt
        ? formatDateTime(submission.submittedAt)
        : null,
      score:
        typeof submission?.score === "number"
          ? `${Math.round(submission.score)}%`
          : null,
      tutorFeedback: submission?.tutorFeedback ?? null,
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
    subjectProgress,
    revisionTasks,
    approvedAssistantScope,
    source: "database",
  };
}
