import { ApprovalStatus as PrismaApprovalStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  approvalStatusToPrisma,
  assertRecord,
  createInitialVersionHistory,
  optionalBoolean,
  optionalJson,
  optionalString,
  parseApprovalStatus,
  prismaApprovalStatusToApi,
  requireString,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const where: Prisma.ClassSummaryWhereInput = {};
    const classId = searchParams.get("classId");
    const tutorId = searchParams.get("tutorId");
    const classSessionId = searchParams.get("classSessionId");
    const approvalStatus = parseApprovalStatus(searchParams.get("approvalStatus"));

    if (classId) where.classId = classId;
    if (tutorId) where.tutorId = tutorId;
    if (classSessionId) where.classSessionId = classSessionId;
    if (approvalStatus) {
      where.approvalStatus = approvalStatusToPrisma[approvalStatus];
    }

    const summaries = await prisma.classSummary.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: summaries.map(mapClassSummary) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const generatedByAi = optionalBoolean(body, "generatedByAi") ?? true;
    const summary = await prisma.classSummary.create({
      data: {
        classId: requireString(body, "classId"),
        classSessionId: requireString(body, "classSessionId"),
        tutorId: requireString(body, "tutorId"),
        aiDraft: toPrismaNullableJsonValue(optionalJson(body, "aiDraft")),
        tutorEditedContent: toPrismaNullableJsonValue(
          optionalJson(body, "tutorEditedContent"),
        ),
        approvalStatus: PrismaApprovalStatus.DRAFT,
        generatedByAiAt: generatedByAi ? new Date() : null,
        versionHistory: createInitialVersionHistory({
          generatedByAi,
          versionNote: optionalString(body, "versionNote"),
        }),
      },
    });

    return NextResponse.json({ data: mapClassSummary(summary) }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
