import {
  ApprovalStatus,
  ClassSessionStatus,
  EnrollmentStatus,
  HomeworkLifecycleStatus,
} from "@prisma/client";

import { getLinkedStudentIdForParent } from "@/lib/account-links";
import { prisma } from "@/lib/prisma";
import {
  average,
  formatDateTime,
  getAttendanceRate,
  getJsonObjectArray,
  getJsonString,
} from "@/lib/server/dashboard-helpers";
import { getVersionHistory } from "@/lib/server/workflow-api";

type ParentMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "gold" | "coral";
};

type ParentInsight = {
  label: string;
  value: string;
  note: string;
};

type ParentProgressSnapshot = {
  averageMastery: number | null;
  attendanceRate: number | null;
  homeworkCompletionRate: number | null;
  reviewedHomeworkCount: number;
};

type ParentProgressSeriesItem = {
  label: string;
  value: number;
  note: string;
  tone: "blue" | "mint" | "gold" | "purple";
};

type ParentHistoryItem = {
  id: string;
  title: string;
  detail: string;
  dateLabel: string;
  type: "class" | "homework" | "mastery" | "report";
};

export type ParentDashboardData = {
  metrics: ParentMetric[];
  latestReport: {
    summary: string;
    tutorNotes: string;
    status: "approved";
  } | null;
  recentHomeworkFeedback: Array<{
    id: string;
    title: string;
    score: string;
    tutorFeedback: string;
    submittedAt: string;
    versionCount: number;
    progressNote: string;
  }>;
  insights: ParentInsight[];
  progressSnapshot: ParentProgressSnapshot;
  progressSeries: ParentProgressSeriesItem[];
  learningHistory: ParentHistoryItem[];
  reportTrace: string[];
  reportWindow: string;
  studentName: string;
  latestWelcomeMessage: {
    title: string;
    body: string;
    sentAt: string;
  } | null;
  enrolledClass: {
    classId: string;
    className: string;
    subject: string;
    tutorName: string;
    schedule: string;
  } | null;
  linkedStudent: {
    name: string;
    email: string;
    accountStatus: string;
    onboardingStatus: string;
  } | null;
  latestBookingRequest: {
    subjectFocus: string;
    studentLevel: string;
    preferredTime: string;
    status: string;
    submittedAt: string;
  } | null;
  source: "database" | "unconfigured";
  message?: string;
};

function getPrimarySupportArea(
  masteryRecords: Array<{ topicLabel: string; masteryScore: number }>,
) {
  if (masteryRecords.length === 0) {
    return "Pending tutor review";
  }

  const weakestTopic = [...masteryRecords].sort(
    (left, right) => left.masteryScore - right.masteryScore,
  )[0];

  return weakestTopic.topicLabel;
}

export async function getParentDashboardData(
  parentId?: string,
): Promise<ParentDashboardData> {
  if (!process.env.DATABASE_URL) {
    return {
      metrics: [],
      latestReport: null,
      recentHomeworkFeedback: [],
      insights: [],
      progressSnapshot: {
        averageMastery: null,
        attendanceRate: null,
        homeworkCompletionRate: null,
        reviewedHomeworkCount: 0,
      },
      progressSeries: [],
      learningHistory: [],
      reportTrace: [],
      reportWindow: "Connect database to load live parent reporting",
      studentName: "Linked student pending",
      latestWelcomeMessage: null,
      enrolledClass: null,
      linkedStudent: null,
      latestBookingRequest: null,
      source: "unconfigured",
      message:
        "DATABASE_URL is not configured yet. Connect a database to load live parent dashboard data.",
    };
  }

  const linkedStudentId = await getLinkedStudentIdForParent(parentId);
  const latestBookingRequest = parentId
    ? await prisma.bookingRequest.findFirst({
        where: {
          OR: [{ parentUserId: parentId }],
        },
        orderBy: { createdAt: "desc" },
      })
    : null;

  if (!linkedStudentId) {
    return {
      metrics: [],
      latestReport: null,
      recentHomeworkFeedback: [],
      insights: [],
      progressSnapshot: {
        averageMastery: null,
        attendanceRate: null,
        homeworkCompletionRate: null,
        reviewedHomeworkCount: 0,
      },
      progressSeries: [],
      learningHistory: [],
      reportTrace: [],
      reportWindow: "No linked child found",
      studentName: "Student linkage required",
      latestWelcomeMessage: null,
      enrolledClass: null,
      linkedStudent: null,
      latestBookingRequest: latestBookingRequest
        ? {
            subjectFocus: latestBookingRequest.subjectFocus,
            studentLevel: latestBookingRequest.studentLevel,
            preferredTime:
              latestBookingRequest.preferredTime ?? "To be confirmed",
            status: latestBookingRequest.status,
            submittedAt: formatDateTime(latestBookingRequest.createdAt),
          }
        : null,
      source: "database",
      message:
        "This parent account does not have a linked student record yet.",
    };
  }

  const linkedStudent = await prisma.user.findUnique({
    where: { id: linkedStudentId },
    select: {
      fullName: true,
      email: true,
      accountStatus: true,
      onboardingCompleted: true,
    },
  });

  const enrollment = await prisma.classEnrollment.findFirst({
    where: {
      studentId: linkedStudentId,
      status: EnrollmentStatus.ACTIVE,
    },
    include: {
      student: true,
      class: {
        include: {
          subject: true,
          tutor: true,
          sessions: {
            orderBy: { startsAt: "desc" },
            take: 8,
          },
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  if (!enrollment) {
    const latestWelcomeMessage = parentId
      ? await prisma.parentMessage.findFirst({
          where: {
            parentId,
            studentId: linkedStudentId,
            approvalStatus: ApprovalStatus.APPROVED,
          },
          orderBy: [{ sentAt: "desc" }, { updatedAt: "desc" }],
        })
      : null;

    return {
      metrics: [],
      latestReport: null,
      recentHomeworkFeedback: [],
      insights: [],
      progressSnapshot: {
        averageMastery: null,
        attendanceRate: null,
        homeworkCompletionRate: null,
        reviewedHomeworkCount: 0,
      },
      progressSeries: [],
      learningHistory: [],
      reportTrace: [],
      reportWindow: "Pending class linkage",
      studentName: "Student not enrolled",
      latestWelcomeMessage: latestWelcomeMessage
        ? {
            title:
              getJsonString(latestWelcomeMessage.aiDraft, "title") ??
              "Welcome message",
            body:
              getJsonString(latestWelcomeMessage.tutorEditedContent, "body") ??
              "A welcome message will appear here after enrollment is completed.",
            sentAt: formatDateTime(
              latestWelcomeMessage.sentAt ?? latestWelcomeMessage.updatedAt,
            ),
          }
        : null,
      enrolledClass: null,
      linkedStudent: linkedStudent
        ? {
            name: linkedStudent.fullName,
            email: linkedStudent.email,
            accountStatus: linkedStudent.accountStatus,
            onboardingStatus: linkedStudent.onboardingCompleted
              ? "Completed"
              : "Pending",
          }
        : null,
      latestBookingRequest: latestBookingRequest
        ? {
            subjectFocus: latestBookingRequest.subjectFocus,
            studentLevel: latestBookingRequest.studentLevel,
            preferredTime:
              latestBookingRequest.preferredTime ?? "To be confirmed",
            status: latestBookingRequest.status,
            submittedAt: formatDateTime(latestBookingRequest.createdAt),
          }
        : null,
      source: "database",
      message: "The linked student is not enrolled in an active tutor-led class yet.",
    };
  }

  const nextSession =
    [...enrollment.class.sessions]
      .filter(
        (session) =>
          session.status === ClassSessionStatus.SCHEDULED ||
          session.status === ClassSessionStatus.LIVE,
      )
      .sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime())[0] ??
    null;

  const [
    reports,
    assignments,
    submissions,
    masteryRecords,
    attendanceRecords,
    latestWelcomeMessage,
  ] =
    await Promise.all([
      prisma.parentReport.findMany({
        where: {
          studentId: linkedStudentId,
          tutorId: enrollment.class.tutorId,
          approvalStatus: ApprovalStatus.APPROVED,
        },
        orderBy: [{ approvedAt: "desc" }, { createdAt: "desc" }],
        take: 3,
      }),
      prisma.homeworkAssignment.findMany({
        where: {
          studentId: linkedStudentId,
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
      }),
      prisma.homeworkSubmission.findMany({
        where: {
          studentId: linkedStudentId,
          tutorFeedback: {
            not: null,
          },
        },
        include: {
          homeworkAssignment: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.studentMastery.findMany({
        where: {
          studentId: linkedStudentId,
          subjectId: enrollment.class.subjectId,
        },
      }),
      prisma.attendanceRecord.findMany({
        where: {
          studentId: linkedStudentId,
          classSession: {
            classId: enrollment.classId,
            status: {
              in: [ClassSessionStatus.COMPLETED],
            },
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
        take: 8,
      }),
      parentId
        ? prisma.parentMessage.findFirst({
            where: {
              parentId,
              studentId: linkedStudentId,
              approvalStatus: ApprovalStatus.APPROVED,
            },
            orderBy: [{ sentAt: "desc" }, { updatedAt: "desc" }],
          })
        : Promise.resolve(null),
    ]);

  const latestReport = reports[0] ?? null;
  const attendanceStatuses = attendanceRecords.map((record) => record.status);
  const attendanceRate = getAttendanceRate(attendanceStatuses);
  const completedAssignmentIds = new Set(
    submissions
      .filter((submission) => submission.submittedAt)
      .map((submission) => submission.homeworkAssignmentId),
  );
  const homeworkCompletionRate =
    assignments.length === 0
      ? 0
      : Math.round((completedAssignmentIds.size / assignments.length) * 100);
  const averageMastery = Math.round(
    average(masteryRecords.map((record) => record.masteryScore)),
  );
  const supportArea = getPrimarySupportArea(masteryRecords);
  const recentHomeworkFeedback = submissions.slice(0, 3).map((submission) => {
    const title =
      getJsonString(submission.homeworkAssignment.assignmentContent, "title") ??
      "Tutor-reviewed homework";
    const submissionVersions = getJsonObjectArray(
      submission.submissionContent,
      "submissionVersions",
    );
    const versionCount = submissionVersions.length + 1;

    return {
      id: submission.id,
      title,
      score:
        typeof submission.score === "number"
          ? `${Math.round(submission.score)}%`
          : "Pending",
      tutorFeedback: submission.tutorFeedback ?? "Tutor feedback pending.",
      submittedAt: submission.submittedAt
        ? formatDateTime(submission.submittedAt)
        : "Pending",
      versionCount,
      progressNote:
        versionCount > 1
          ? `This homework was revised ${versionCount - 1} time${versionCount > 2 ? "s" : ""} before the latest tutor review.`
          : "This homework was reviewed after the first student submission.",
    };
  });

  const progressSnapshot: ParentProgressSnapshot = {
    averageMastery: masteryRecords.length > 0 ? averageMastery : null,
    attendanceRate: attendanceRecords.length > 0 ? attendanceRate : null,
    homeworkCompletionRate: assignments.length > 0 ? homeworkCompletionRate : null,
    reviewedHomeworkCount: submissions.length,
  };

  const progressSeries: ParentProgressSeriesItem[] = [
    {
      label: "Attendance",
      value: attendanceRecords.length > 0 ? attendanceRate : 0,
      note:
        attendanceRecords.length > 0
          ? `${attendanceRate}% across completed tutor-led sessions.`
          : "Attendance will appear after the first completed class.",
      tone: "mint",
    },
    {
      label: "Homework",
      value: assignments.length > 0 ? homeworkCompletionRate : 0,
      note:
        assignments.length > 0
          ? `${homeworkCompletionRate}% of tutor-approved homework has been completed.`
          : "Homework completion will appear after the first assignment cycle.",
      tone: "gold",
    },
    {
      label: "Mastery",
      value: masteryRecords.length > 0 ? averageMastery : 0,
      note:
        masteryRecords.length > 0
          ? `${averageMastery}% current tutor-reviewed mastery across tracked topics.`
          : "Mastery will appear after the tutor reviews the first learning cycle.",
      tone: "blue",
    },
    {
      label: "Support Focus",
      value: masteryRecords.length > 0 ? Math.max(100 - averageMastery, 8) : 0,
      note:
        masteryRecords.length > 0
          ? `${supportArea} is the main topic still needing reinforcement.`
          : "A support focus area will appear after the first reviewed cycle.",
      tone: "purple",
    },
  ];

  const learningHistorySeed = [
    ...attendanceRecords.slice(0, 3).map((record) => ({
      id: `class-${record.id}`,
      title: record.classSession.title,
      detail:
        record.status === "PRESENT"
          ? `Attended class with ${Math.round(record.participationScore ?? 0)}% participation.`
          : `Attendance status: ${record.status.toLowerCase().replace("_", " ")}.`,
      sortKey: record.classSession.startsAt.getTime(),
      dateLabel: formatDateTime(record.classSession.startsAt),
      type: "class" as const,
    })),
    ...submissions.slice(0, 3).map((submission) => {
      const title =
        getJsonString(submission.homeworkAssignment.assignmentContent, "title") ??
        "Tutor-reviewed homework";

      return {
        id: `homework-${submission.id}`,
        title,
        detail:
          submission.tutorFeedback ??
          (typeof submission.score === "number"
            ? `Tutor reviewed this homework and gave ${Math.round(submission.score)}%.`
            : "Homework submitted and waiting for tutor review."),
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
        `Mastery updated to ${Math.round(record.masteryScore)}% after tutor review.`,
      sortKey: (record.reviewedByTutorAt ?? record.updatedAt).getTime(),
      dateLabel: formatDateTime(record.reviewedByTutorAt ?? record.updatedAt),
      type: "mastery" as const,
    })),
    ...reports.slice(0, 2).map((report) => ({
      id: `report-${report.id}`,
      title: "Weekly progress report approved",
      detail:
        getJsonString(report.aiSummary, "summary") ??
        report.tutorNotes ??
        "A tutor-approved weekly report was published.",
      sortKey: (report.approvedAt ?? report.updatedAt).getTime(),
      dateLabel: formatDateTime(report.approvedAt ?? report.updatedAt),
      type: "report" as const,
    })),
  ];

  const learningHistory: ParentHistoryItem[] = learningHistorySeed
    .sort((left, right) => right.sortKey - left.sortKey)
    .slice(0, 8);

  const metrics: ParentMetric[] = [
    {
      label: "Attendance Rate",
      value: attendanceRecords.length > 0 ? `${attendanceRate}%` : "Pending",
      detail: "Attendance reflects completed tutor-led sessions only.",
      tone: attendanceRate >= 80 ? "teal" : "coral",
    },
    {
      label: "Homework Completion",
      value: assignments.length > 0 ? `${homeworkCompletionRate}%` : "Pending",
      detail: "Completion is based on tutor-approved assignments and actual submissions.",
      tone: homeworkCompletionRate >= 70 ? "gold" : "coral",
    },
    {
      label: "Latest Tutor Report",
      value: latestReport?.approvedAt ? formatDateTime(latestReport.approvedAt) : "Pending",
      detail: "Parents only see reports after tutor approval.",
      tone: "teal",
    },
    {
      label: "Average Mastery",
      value: masteryRecords.length > 0 ? `${averageMastery}%` : "Pending",
      detail: "Topic mastery is AI-assisted but stays inside the tutor review loop.",
      tone: averageMastery >= 70 ? "teal" : "gold",
    },
  ];

  const insights: ParentInsight[] = [
    {
      label: "Main support area",
      value: supportArea,
      note: "This is the weakest tutor-reviewed topic in the current subject.",
    },
    {
      label: "Next live class",
      value: nextSession ? formatDateTime(nextSession.startsAt) : enrollment.class.schedule,
      note: `Class runs under ${enrollment.class.tutor.fullName}.`,
    },
    {
      label: "Tutor guidance",
      value: latestReport?.tutorNotes ?? "Awaiting tutor note",
      note: "Tutor comments are visible to parents after approval.",
    },
  ];

  const traceability = latestReport
    ? [
        `AI drafted report at ${formatDateTime(latestReport.generatedByAiAt ?? latestReport.createdAt)}.`,
        `Tutor reviewed report at ${formatDateTime(latestReport.reviewedByTutorAt)}.`,
        `Approved by ${latestReport.approvedByTutorId ?? enrollment.class.tutor.fullName}.`,
        ...getVersionHistory(latestReport.versionHistory),
      ]
    : [
        "No tutor-approved report is available yet.",
        "AI cannot message parents directly without tutor approval.",
      ];

  return {
    metrics,
    latestReport: latestReport
      ? {
          summary:
            getJsonString(latestReport.aiSummary, "summary") ??
            "Tutor-approved summary pending.",
          tutorNotes: latestReport.tutorNotes ?? "No additional tutor notes yet.",
          status: "approved",
        }
      : null,
    recentHomeworkFeedback,
    insights,
    progressSnapshot,
    progressSeries,
    learningHistory,
    reportTrace: traceability,
    reportWindow: "Sunday 7:30 PM",
    studentName: enrollment.student.fullName,
    latestWelcomeMessage: latestWelcomeMessage
      ? {
          title:
            getJsonString(latestWelcomeMessage.aiDraft, "title") ??
            "Welcome message",
          body:
            getJsonString(latestWelcomeMessage.tutorEditedContent, "body") ??
            "A welcome message will appear here after enrollment is completed.",
          sentAt: formatDateTime(
            latestWelcomeMessage.sentAt ?? latestWelcomeMessage.updatedAt,
          ),
        }
      : null,
    enrolledClass: {
      classId: enrollment.classId,
      className: enrollment.class.title,
      subject: enrollment.class.subject.name,
      tutorName: enrollment.class.tutor.fullName,
      schedule: enrollment.class.schedule,
    },
    linkedStudent: linkedStudent
      ? {
          name: linkedStudent.fullName,
          email: linkedStudent.email,
          accountStatus: linkedStudent.accountStatus,
          onboardingStatus: linkedStudent.onboardingCompleted
            ? "Completed"
            : "Pending",
        }
      : null,
    latestBookingRequest: latestBookingRequest
      ? {
          subjectFocus: latestBookingRequest.subjectFocus,
          studentLevel: latestBookingRequest.studentLevel,
          preferredTime: latestBookingRequest.preferredTime ?? "To be confirmed",
          status: latestBookingRequest.status,
          submittedAt: formatDateTime(latestBookingRequest.createdAt),
        }
      : null,
    source: "database",
  };
}
