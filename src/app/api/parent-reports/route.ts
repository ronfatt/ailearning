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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const where: Prisma.ParentReportWhereInput = {};
    const classId = searchParams.get("classId");
    const tutorId = searchParams.get("tutorId");
    const studentId = searchParams.get("studentId");
    const approvalStatus = parseApprovalStatus(searchParams.get("approvalStatus"));

    if (classId) where.classId = classId;
    if (tutorId) where.tutorId = tutorId;
    if (studentId) where.studentId = studentId;
    if (approvalStatus) {
      where.approvalStatus = approvalStatusToPrisma[approvalStatus];
    }

    const reports = await prisma.parentReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: reports.map(mapParentReport) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const generatedByAi = optionalBoolean(body, "generatedByAi") ?? true;
    const report = await prisma.parentReport.create({
      data: {
        classId: optionalString(body, "classId"),
        studentId: requireString(body, "studentId"),
        tutorId: requireString(body, "tutorId"),
        aiSummary: toPrismaNullableJsonValue(optionalJson(body, "aiSummary")),
        tutorNotes: optionalString(body, "tutorNotes"),
        approvalStatus: PrismaApprovalStatus.DRAFT,
        generatedByAiAt: generatedByAi ? new Date() : null,
        versionHistory: createInitialVersionHistory({
          generatedByAi,
          versionNote: optionalString(body, "versionNote"),
        }),
      },
    });

    return NextResponse.json({ data: mapParentReport(report) }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
