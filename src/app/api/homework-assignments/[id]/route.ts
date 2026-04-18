import {
  ApprovalStatus as PrismaApprovalStatus,
  HomeworkLifecycleStatus,
  Prisma,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ApiError,
  appendVersionHistory,
  assertRecord,
  buildApprovalMetadataUpdate,
  optionalDate,
  optionalJson,
  optionalString,
  parseApprovalStatus,
  prismaApprovalStatusToApi,
  toErrorResponse,
  toPrismaJsonValue,
} from "@/lib/server/workflow-api";

function mapHomeworkAssignment(homework: {
  id: string;
  classId: string;
  lessonPlanId: string | null;
  studyPlanId: string | null;
  studentId: string;
  tutorId: string;
  generatedByAi: boolean;
  approvedByTutor: boolean;
  assignmentContent: Prisma.JsonValue;
  dueDate: Date;
  status: HomeworkLifecycleStatus;
  approvalStatus: PrismaApprovalStatus;
  generatedByAiAt: Date | null;
  reviewedByTutorAt: Date | null;
  approvedByTutorId: string | null;
  approvedAt: Date | null;
  versionHistory: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...homework,
    approvalStatus: prismaApprovalStatusToApi[homework.approvalStatus],
    lifecycleStatus: homework.status.toLowerCase(),
  };
}

function deriveHomeworkLifecycleStatus(status: PrismaApprovalStatus) {
  if (status === PrismaApprovalStatus.APPROVED) {
    return HomeworkLifecycleStatus.APPROVED;
  }

  if (status === PrismaApprovalStatus.ASSIGNED) {
    return HomeworkLifecycleStatus.ASSIGNED;
  }

  if (status === PrismaApprovalStatus.ARCHIVED) {
    return HomeworkLifecycleStatus.ARCHIVED;
  }

  return HomeworkLifecycleStatus.DRAFT;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const homework = await prisma.homeworkAssignment.findUnique({ where: { id } });

    if (!homework) {
      throw new ApiError("Homework assignment not found.", 404);
    }

    return NextResponse.json({ data: mapHomeworkAssignment(homework) });
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
    const existing = await prisma.homeworkAssignment.findUnique({ where: { id } });

    if (!existing) {
      throw new ApiError("Homework assignment not found.", 404);
    }

    const data: Prisma.HomeworkAssignmentUpdateInput = {};
    const tutorId = optionalString(body, "tutorId");
    const versionNote = optionalString(body, "versionNote");
    const approvalStatus = parseApprovalStatus(body.approvalStatus);
    const assignmentContent = optionalJson(body, "assignmentContent");
    const dueDate = optionalDate(body, "dueDate");

    if (assignmentContent !== undefined) {
      data.assignmentContent = toPrismaJsonValue(assignmentContent);
    }

    if (dueDate !== undefined) {
      data.dueDate = dueDate;
    }

    if (assignmentContent !== undefined || dueDate !== undefined) {
      data.versionHistory = appendVersionHistory(
        existing.versionHistory,
        versionNote ?? "homework assignment updated",
      );
    }

    Object.assign(
      data,
      buildApprovalMetadataUpdate({
        currentStatus: existing.approvalStatus,
        nextStatus: approvalStatus,
        tutorId,
        currentVersionHistory: data.versionHistory ?? existing.versionHistory,
        versionNote:
          approvalStatus && !versionNote ? `status changed to ${approvalStatus}` : undefined,
      }),
    );

    const nextPrismaStatus =
      (data.approvalStatus as PrismaApprovalStatus | undefined) ??
      existing.approvalStatus;

    data.status = deriveHomeworkLifecycleStatus(nextPrismaStatus);

    if (
      nextPrismaStatus === PrismaApprovalStatus.APPROVED ||
      nextPrismaStatus === PrismaApprovalStatus.ASSIGNED
    ) {
      data.approvedByTutor = true;
    }

    if (Object.keys(data).length === 0) {
      throw new ApiError("No valid homework fields were provided.");
    }

    const homework = await prisma.homeworkAssignment.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: mapHomeworkAssignment(homework) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
