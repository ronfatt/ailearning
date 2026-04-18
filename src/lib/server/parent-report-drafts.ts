import {
  ApprovalStatus,
  AttendanceStatus,
  ClassSessionStatus,
  Prisma,
  PrismaClient,
} from "@prisma/client";

import { average } from "@/lib/server/dashboard-helpers";
import {
  appendVersionHistory,
  createInitialVersionHistory,
} from "@/lib/server/workflow-api";

type PrismaDraftClient = PrismaClient | Prisma.TransactionClient;

function buildAttendanceRate(statuses: AttendanceStatus[]) {
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

export async function upsertParentReportDraftFromSignals(
  client: PrismaDraftClient,
  {
    studentId,
    tutorId,
    classId,
  }: {
    studentId: string;
    tutorId: string;
    classId: string;
  },
) {
  const [student, reviewedSubmissions, masteryRecords, attendanceRecords, existingDraft] =
    await Promise.all([
      client.user.findUnique({
        where: { id: studentId },
        select: {
          fullName: true,
        },
      }),
      client.homeworkSubmission.findMany({
        where: {
          studentId,
          tutorFeedback: {
            not: null,
          },
          homeworkAssignment: {
            tutorId,
            classId,
          },
        },
        include: {
          homeworkAssignment: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 3,
      }),
      client.studentMastery.findMany({
        where: {
          studentId,
          subject: {
            classes: {
              some: {
                id: classId,
              },
            },
          },
        },
        orderBy: {
          masteryScore: "asc",
        },
        take: 3,
      }),
      client.attendanceRecord.findMany({
        where: {
          studentId,
          classSession: {
            classId,
            status: ClassSessionStatus.COMPLETED,
          },
        },
        take: 8,
      }),
      client.parentReport.findFirst({
        where: {
          classId,
          studentId,
          tutorId,
          approvalStatus: ApprovalStatus.DRAFT,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

  if (!student) {
    throw new Error("Cannot generate parent report draft without a linked student.");
  }

  const latestReviewedSubmission = reviewedSubmissions[0] ?? null;
  const attendanceRate = buildAttendanceRate(
    attendanceRecords.map((record) => record.status),
  );
  const averageMastery = masteryRecords.length
    ? Math.round(average(masteryRecords.map((record) => record.masteryScore)))
    : null;
  const weakestTopic = masteryRecords[0]?.topicLabel ?? null;

  const feedbackHighlights = reviewedSubmissions.map((submission) => {
    const assignmentContent = submission.homeworkAssignment.assignmentContent;
    const title =
      typeof assignmentContent === "object" &&
      assignmentContent !== null &&
      !Array.isArray(assignmentContent) &&
      typeof assignmentContent.title === "string"
        ? assignmentContent.title
        : "Tutor-reviewed homework";
    const scoreText =
      typeof submission.score === "number"
        ? `scored ${Math.round(submission.score)}%`
        : "was reviewed";

    return `${title} ${scoreText}. ${submission.tutorFeedback ?? "Tutor feedback pending."}`;
  });

  const summaryParts = [
    `${student.fullName} continues learning inside the tutor-led class workflow.`,
    latestReviewedSubmission
      ? `The latest tutor-reviewed homework shows that ${student.fullName} ${
          typeof latestReviewedSubmission.score === "number" &&
          latestReviewedSubmission.score >= 75
            ? "is making good progress"
            : "still needs close support"
        } after recent practice.`
      : "There is not enough tutor-reviewed homework yet to produce a detailed weekly summary.",
    weakestTopic
      ? `The main topic to watch remains ${weakestTopic}.`
      : "A tutor-reviewed mastery focus will appear once more topic data is available.",
    attendanceRate !== null
      ? `Attendance in completed sessions is currently ${attendanceRate}%.`
      : "Attendance trend is still being established.",
  ];

  const summary = summaryParts.join(" ");
  const tutorNotes = latestReviewedSubmission?.tutorFeedback
    ? `Latest tutor feedback: ${latestReviewedSubmission.tutorFeedback}`
    : "Tutor note pending after the next reviewed homework cycle.";

  const aiSummary: Prisma.InputJsonValue = {
    summary,
    homeworkHighlights: feedbackHighlights,
    weakestTopic,
    attendanceRate,
    averageMastery,
  };

  if (existingDraft) {
    return client.parentReport.update({
      where: { id: existingDraft.id },
      data: {
        aiSummary,
        tutorNotes,
        generatedByAiAt: new Date(),
        versionHistory: appendVersionHistory(
          existingDraft.versionHistory,
          "AI regenerated draft from latest tutor-reviewed homework and class signals",
        ),
      },
    });
  }

  return client.parentReport.create({
    data: {
      classId,
      studentId,
      tutorId,
      aiSummary,
      tutorNotes,
      approvalStatus: ApprovalStatus.DRAFT,
      generatedByAiAt: new Date(),
      versionHistory: createInitialVersionHistory({
        generatedByAi: true,
        versionNote:
          "AI generated draft from latest tutor-reviewed homework and class signals",
      }),
    },
  });
}
