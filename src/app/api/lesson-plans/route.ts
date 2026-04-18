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
  requireJson,
  requireString,
  toErrorResponse,
  toPrismaJsonValue,
  toPrismaNullableJsonValue,
} from "@/lib/server/workflow-api";

function mapLessonPlan(lessonPlan: {
  id: string;
  classId: string;
  tutorId: string;
  subjectId: string;
  title: string;
  objectives: Prisma.JsonValue;
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
    ...lessonPlan,
    approvalStatus: prismaApprovalStatusToApi[lessonPlan.approvalStatus],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const where: Prisma.LessonPlanWhereInput = {};
    const classId = searchParams.get("classId");
    const tutorId = searchParams.get("tutorId");
    const subjectId = searchParams.get("subjectId");
    const approvalStatus = parseApprovalStatus(searchParams.get("approvalStatus"));

    if (classId) where.classId = classId;
    if (tutorId) where.tutorId = tutorId;
    if (subjectId) where.subjectId = subjectId;
    if (approvalStatus) {
      where.approvalStatus = approvalStatusToPrisma[approvalStatus];
    }

    const lessonPlans = await prisma.lessonPlan.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: lessonPlans.map(mapLessonPlan),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const generatedByAi = optionalBoolean(body, "generatedByAi") ?? true;
    const lessonPlan = await prisma.lessonPlan.create({
      data: {
        classId: requireString(body, "classId"),
        tutorId: requireString(body, "tutorId"),
        subjectId: requireString(body, "subjectId"),
        title: requireString(body, "title"),
        objectives: toPrismaJsonValue(requireJson(body, "objectives")),
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

    return NextResponse.json({ data: mapLessonPlan(lessonPlan) }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
