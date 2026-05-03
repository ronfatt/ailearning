import { HomeworkLifecycleStatus, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  JsonValue,
  optionalString,
  requireJson,
  requireString,
  toErrorResponse,
  toPrismaJsonValue,
} from "@/lib/server/workflow-api";

function isRecord(value: JsonValue): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = assertRecord(await request.json());
    const studentId = requireString(body, "studentId");
    const existingHomework = await prisma.homeworkAssignment.findUnique({
      where: { id },
    });

    if (!existingHomework) {
      throw new ApiError("Homework assignment not found.", 404);
    }

    if (existingHomework.studentId !== studentId) {
      throw new ApiError("This homework is not assigned to the current student.", 403);
    }

    const submissionContent = requireJson(body, "submissionContent");
    const reflection = optionalString(body, "reflection");
    const submittedAt = new Date();
    const existingSubmission = await prisma.homeworkSubmission.findUnique({
      where: {
        homeworkAssignmentId_studentId: {
          homeworkAssignmentId: id,
          studentId,
        },
      },
    });
    const nextSubmissionContent: JsonValue =
      existingSubmission?.submissionContent &&
      isRecord(submissionContent) &&
      typeof existingSubmission.submissionContent === "object" &&
      existingSubmission.submissionContent !== null &&
      !Array.isArray(existingSubmission.submissionContent)
        ? ({
            ...submissionContent,
            submissionVersions: [
              ...(Array.isArray(existingSubmission.submissionContent.submissionVersions)
                ? (existingSubmission.submissionContent.submissionVersions as JsonValue[])
                : []),
              {
                submittedAt: existingSubmission.submittedAt?.toISOString() ?? null,
                score: existingSubmission.score,
                tutorFeedback: existingSubmission.tutorFeedback,
                ...(existingSubmission.submissionContent as Record<string, JsonValue>),
              },
            ],
          } as JsonValue)
        : submissionContent;

    const [submission] = await prisma.$transaction([
      prisma.homeworkSubmission.upsert({
        where: {
          homeworkAssignmentId_studentId: {
            homeworkAssignmentId: id,
            studentId,
          },
        },
        update: {
          submittedAt,
          submissionContent: toPrismaJsonValue(nextSubmissionContent),
          score: null,
          tutorFeedback: null,
        },
        create: {
          homeworkAssignmentId: id,
          studentId,
          submittedAt,
          submissionContent: toPrismaJsonValue(submissionContent),
        },
      }),
      prisma.homeworkAssignment.update({
        where: { id },
        data: {
          status: HomeworkLifecycleStatus.SUBMITTED,
        },
      }),
      prisma.aiActivityLog.create({
        data: {
          userId: studentId,
          role: UserRole.STUDENT,
          featureUsed: "homework_submission",
          inputType: "student_submission",
          outputType: "workflow_update",
          approvalRequired: false,
          approvedBy: existingHomework.tutorId,
          sourceEntityType: "homework_assignment",
          sourceEntityId: id,
          moderationStatus:
            reflection ??
            (existingSubmission?.submittedAt ? "resubmitted" : "submitted"),
        },
      }),
    ]);

    return NextResponse.json({
      data: {
        id: submission.id,
        homeworkAssignmentId: id,
        studentId,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
