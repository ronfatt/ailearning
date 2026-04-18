import { HomeworkLifecycleStatus, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  requireJson,
  requireString,
  toErrorResponse,
  toPrismaJsonValue,
} from "@/lib/server/workflow-api";

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
          submissionContent: toPrismaJsonValue(submissionContent),
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
          moderationStatus: reflection ?? "submitted",
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
