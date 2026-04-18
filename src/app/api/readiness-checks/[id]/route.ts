import {
  ApprovalStatus as PrismaApprovalStatus,
  Prisma,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ApiError,
  appendVersionHistory,
  assertRecord,
  buildApprovalMetadataUpdate,
  optionalString,
  parseApprovalStatus,
  prismaApprovalStatusToApi,
  toErrorResponse,
} from "@/lib/server/workflow-api";

function mapReadinessSubmission(submission: {
  id: string;
  classId: string;
  subjectId: string;
  studentId: string;
  tutorId: string;
  responses: Prisma.JsonValue;
  score: number;
  readinessLevel: string;
  weakTopics: Prisma.JsonValue | null;
  aiSummary: Prisma.JsonValue | null;
  approvalStatus: PrismaApprovalStatus;
  generatedByAiAt: Date | null;
  reviewedByTutorAt: Date | null;
  approvedByTutorId: string | null;
  approvedAt: Date | null;
  versionHistory: Prisma.JsonValue | null;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...submission,
    approvalStatus: prismaApprovalStatusToApi[submission.approvalStatus],
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const submission = await prisma.readinessCheckSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new ApiError("Readiness check submission not found.", 404);
    }

    return NextResponse.json({ data: mapReadinessSubmission(submission) });
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
    const existing = await prisma.readinessCheckSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new ApiError("Readiness check submission not found.", 404);
    }

    const tutorId = optionalString(body, "tutorId");
    const versionNote = optionalString(body, "versionNote");
    const approvalStatus = parseApprovalStatus(body.approvalStatus);
    const data: Prisma.ReadinessCheckSubmissionUpdateInput = {};

    Object.assign(
      data,
      buildApprovalMetadataUpdate({
        currentStatus: existing.approvalStatus,
        nextStatus: approvalStatus,
        tutorId,
        currentVersionHistory: existing.versionHistory,
        versionNote:
          approvalStatus && !versionNote ? `status changed to ${approvalStatus}` : undefined,
      }),
    );

    if (!data.versionHistory && versionNote) {
      data.versionHistory = appendVersionHistory(existing.versionHistory, versionNote);
    }

    if (Object.keys(data).length === 0) {
      throw new ApiError("No valid readiness fields were provided.");
    }

    const submission = await prisma.readinessCheckSubmission.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: mapReadinessSubmission(submission) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
