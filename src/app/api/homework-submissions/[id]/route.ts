import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { upsertParentReportDraftFromSignals } from "@/lib/server/parent-report-drafts";
import {
  ApiError,
  assertRecord,
  optionalString,
  requireString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

function mapSubmission(submission: {
  id: string;
  homeworkAssignmentId: string;
  studentId: string;
  submittedAt: Date | null;
  submissionContent: unknown;
  score: number | null;
  tutorFeedback: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...submission,
    needsReview:
      Boolean(submission.submittedAt) &&
      (submission.score === null || submission.tutorFeedback === null),
  };
}

function optionalNumber(input: Record<string, unknown>, key: string) {
  const value = input[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ApiError(`Field "${key}" must be a valid number.`);
  }

  return value;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const submission = await prisma.homeworkSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new ApiError("Homework submission not found.", 404);
    }

    return NextResponse.json({ data: mapSubmission(submission) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = assertRecord(await request.json());
    const tutorId = requireString(body, "tutorId");
    const score = optionalNumber(body, "score");
    const tutorFeedback = optionalString(body, "tutorFeedback");

    if (score === undefined && !tutorFeedback) {
      throw new ApiError("Provide score, tutorFeedback, or both.");
    }

    const existing = await prisma.homeworkSubmission.findUnique({
      where: { id },
      include: {
        homeworkAssignment: true,
      },
    });

    if (!existing) {
      throw new ApiError("Homework submission not found.", 404);
    }

    if (existing.homeworkAssignment.tutorId !== tutorId) {
      throw new ApiError("Only the linked tutor can review this submission.", 403);
    }

    const updated = await prisma.$transaction(async (transaction) => {
      const submission = await transaction.homeworkSubmission.update({
        where: { id },
        data: {
          ...(score !== undefined ? { score } : {}),
          ...(tutorFeedback ? { tutorFeedback } : {}),
        },
      });

      await transaction.aiActivityLog.create({
        data: {
          userId: tutorId,
          role: UserRole.TUTOR,
          featureUsed: "homework_submission_review",
          inputType: "tutor_review",
          outputType: "student_feedback",
          approvalRequired: false,
          approvedBy: tutorId,
          sourceEntityType: "homework_submission",
          sourceEntityId: id,
          moderationStatus: "reviewed",
        },
      });

      await upsertParentReportDraftFromSignals(transaction, {
        studentId: existing.studentId,
        tutorId,
        classId: existing.homeworkAssignment.classId,
      });

      return submission;
    });

    return NextResponse.json({ data: mapSubmission(updated) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
