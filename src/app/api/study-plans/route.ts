import {
  ApprovalStatus as PrismaApprovalStatus,
  Prisma,
  StudyPlanStatus,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ApiError,
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

function parseStudyPlanStatus(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiError('Field "status" must be a string.');
  }

  const normalized = value.trim().toUpperCase();

  if (normalized !== StudyPlanStatus.ACTIVE && normalized !== StudyPlanStatus.ARCHIVED) {
    throw new ApiError('Field "status" must be either "ACTIVE" or "ARCHIVED".');
  }

  return normalized as StudyPlanStatus;
}

function mapStudyPlan(studyPlan: {
  id: string;
  classId: string | null;
  tutorId: string;
  studentId: string;
  subjectId: string;
  title: string;
  planType: string;
  status: StudyPlanStatus;
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
    ...studyPlan,
    status: studyPlan.status.toLowerCase(),
    approvalStatus: prismaApprovalStatusToApi[studyPlan.approvalStatus],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const where: Prisma.StudyPlanWhereInput = {};
    const classId = searchParams.get("classId");
    const tutorId = searchParams.get("tutorId");
    const studentId = searchParams.get("studentId");
    const subjectId = searchParams.get("subjectId");
    const approvalStatus = parseApprovalStatus(searchParams.get("approvalStatus"));

    if (classId) where.classId = classId;
    if (tutorId) where.tutorId = tutorId;
    if (studentId) where.studentId = studentId;
    if (subjectId) where.subjectId = subjectId;
    if (approvalStatus) {
      where.approvalStatus = approvalStatusToPrisma[approvalStatus];
    }

    const studyPlans = await prisma.studyPlan.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      data: studyPlans.map(mapStudyPlan),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const generatedByAi = optionalBoolean(body, "generatedByAi") ?? true;

    const studyPlan = await prisma.studyPlan.create({
      data: {
        classId: optionalString(body, "classId") ?? null,
        tutorId: requireString(body, "tutorId"),
        studentId: requireString(body, "studentId"),
        subjectId: requireString(body, "subjectId"),
        title: requireString(body, "title"),
        planType: optionalString(body, "planType") ?? "REVISION",
        status: parseStudyPlanStatus(body.status) ?? StudyPlanStatus.ACTIVE,
        aiDraft: toPrismaNullableJsonValue(optionalJson(body, "aiDraft")),
        tutorEditedContent: toPrismaNullableJsonValue(optionalJson(body, "tutorEditedContent")),
        approvalStatus: PrismaApprovalStatus.DRAFT,
        generatedByAiAt: generatedByAi ? new Date() : null,
        versionHistory: createInitialVersionHistory({
          generatedByAi,
          versionNote: optionalString(body, "versionNote"),
        }),
      },
    });

    return NextResponse.json({ data: mapStudyPlan(studyPlan) }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
