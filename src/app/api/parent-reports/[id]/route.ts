import { ApprovalStatus as PrismaApprovalStatus, Prisma } from "@prisma/client";
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
  toPrismaNullableJsonValue,
} from "@/lib/server/workflow-api";

function mapParentReport(report: {
  id: string;
  classId: string | null;
  studentId: string;
  tutorId: string;
  aiSummary: Prisma.JsonValue | null;
  tutorNotes: string | null;
  approvalStatus: PrismaApprovalStatus;
  generatedByAiAt: Date | null;
  reviewedByTutorAt: Date | null;
  approvedByTutorId: string | null;
  approvedAt: Date | null;
  versionHistory: Prisma.JsonValue | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...report,
    approvalStatus: prismaApprovalStatusToApi[report.approvalStatus],
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const report = await prisma.parentReport.findUnique({ where: { id } });

    if (!report) {
      throw new ApiError("Parent report not found.", 404);
    }

    return NextResponse.json({ data: mapParentReport(report) });
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
    const existing = await prisma.parentReport.findUnique({ where: { id } });

    if (!existing) {
      throw new ApiError("Parent report not found.", 404);
    }

    const data: Prisma.ParentReportUpdateInput = {};
    const tutorId = optionalString(body, "tutorId");
    const versionNote = optionalString(body, "versionNote");
    const approvalStatus = parseApprovalStatus(body.approvalStatus);
    const aiSummary = optionalJson(body, "aiSummary");
    const tutorNotes = optionalString(body, "tutorNotes");
    const sentAt = optionalDate(body, "sentAt");

    if (aiSummary !== undefined) {
      data.aiSummary = toPrismaNullableJsonValue(aiSummary);
    }

    if (tutorNotes !== undefined) {
      data.tutorNotes = tutorNotes;
    }

    if (sentAt !== undefined) {
      data.sentAt = sentAt;
    }

    if (aiSummary !== undefined || tutorNotes !== undefined || sentAt !== undefined) {
      data.versionHistory = appendVersionHistory(
        existing.versionHistory,
        versionNote ?? "parent report updated",
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

    if (nextPrismaStatus === PrismaApprovalStatus.ASSIGNED && !data.sentAt) {
      data.sentAt = new Date();
    }

    if (Object.keys(data).length === 0) {
      throw new ApiError("No valid parent report fields were provided.");
    }

    const report = await prisma.parentReport.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: mapParentReport(report) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
