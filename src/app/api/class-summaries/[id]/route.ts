import { ApprovalStatus as PrismaApprovalStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ApiError,
  appendVersionHistory,
  assertRecord,
  buildApprovalMetadataUpdate,
  optionalJson,
  optionalString,
  parseApprovalStatus,
  prismaApprovalStatusToApi,
  toErrorResponse,
  toPrismaNullableJsonValue,
} from "@/lib/server/workflow-api";

function mapClassSummary(summary: {
  id: string;
  classId: string;
  classSessionId: string;
  tutorId: string;
  aiDraft: Prisma.JsonValue | null;
  tutorEditedContent: Prisma.JsonValue | null;
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
    ...summary,
    approvalStatus: prismaApprovalStatusToApi[summary.approvalStatus],
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const summary = await prisma.classSummary.findUnique({ where: { id } });

    if (!summary) {
      throw new ApiError("Class summary not found.", 404);
    }

    return NextResponse.json({ data: mapClassSummary(summary) });
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
    const existing = await prisma.classSummary.findUnique({ where: { id } });

    if (!existing) {
      throw new ApiError("Class summary not found.", 404);
    }

    const data: Prisma.ClassSummaryUpdateInput = {};
    const tutorId = optionalString(body, "tutorId");
    const versionNote = optionalString(body, "versionNote");
    const approvalStatus = parseApprovalStatus(body.approvalStatus);
    const aiDraft = optionalJson(body, "aiDraft");
    const tutorEditedContent = optionalJson(body, "tutorEditedContent");

    if (aiDraft !== undefined) {
      data.aiDraft = toPrismaNullableJsonValue(aiDraft);
    }

    if (tutorEditedContent !== undefined) {
      data.tutorEditedContent = toPrismaNullableJsonValue(tutorEditedContent);
    }

    if (aiDraft !== undefined || tutorEditedContent !== undefined) {
      data.versionHistory = appendVersionHistory(
        existing.versionHistory,
        versionNote ?? "class summary updated",
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

    if (Object.keys(data).length === 0) {
      throw new ApiError("No valid class summary fields were provided.");
    }

    const summary = await prisma.classSummary.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: mapClassSummary(summary) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
