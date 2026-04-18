import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ApiError, toErrorResponse } from "@/lib/server/workflow-api";

function mapSubmission(submission: {
  id: string;
  homeworkAssignmentId: string;
  studentId: string;
  submittedAt: Date | null;
  score: number | null;
  tutorFeedback: string | null;
  createdAt: Date;
  updatedAt: Date;
  homeworkAssignment: {
    tutorId: string;
    classId: string;
    assignmentContent: unknown;
  };
}) {
  return {
    id: submission.id,
    homeworkAssignmentId: submission.homeworkAssignmentId,
    studentId: submission.studentId,
    tutorId: submission.homeworkAssignment.tutorId,
    classId: submission.homeworkAssignment.classId,
    assignmentContent: submission.homeworkAssignment.assignmentContent,
    submittedAt: submission.submittedAt,
    score: submission.score,
    tutorFeedback: submission.tutorFeedback,
    needsReview:
      Boolean(submission.submittedAt) &&
      (submission.score === null || submission.tutorFeedback === null),
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorId = searchParams.get("tutorId");
    const studentId = searchParams.get("studentId");
    const needsReview = searchParams.get("needsReview");

    const submissions = await prisma.homeworkSubmission.findMany({
      where: {
        ...(studentId ? { studentId } : {}),
        ...(tutorId
          ? {
              homeworkAssignment: {
                tutorId,
              },
            }
          : {}),
        ...(needsReview === "true"
          ? {
              submittedAt: {
                not: null,
              },
              OR: [{ score: null }, { tutorFeedback: null }],
            }
          : {}),
      },
      include: {
        homeworkAssignment: {
          select: {
            tutorId: true,
            classId: true,
            assignmentContent: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      data: submissions.map(mapSubmission),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return toErrorResponse(error);
    }

    return toErrorResponse(error);
  }
}
