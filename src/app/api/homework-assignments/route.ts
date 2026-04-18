import {
  ApprovalStatus as PrismaApprovalStatus,
  HomeworkLifecycleStatus,
  Prisma,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  approvalStatusToPrisma,
  assertRecord,
  createInitialVersionHistory,
  optionalBoolean,
  optionalString,
  parseApprovalStatus,
  prismaApprovalStatusToApi,
  requireDate,
  requireJson,
  requireString,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const where: Prisma.HomeworkAssignmentWhereInput = {};
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

    const homeworkAssignments = await prisma.homeworkAssignment.findMany({
      where,
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json({
      data: homeworkAssignments.map(mapHomeworkAssignment),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const generatedByAi = optionalBoolean(body, "generatedByAi") ?? true;
    const homework = await prisma.homeworkAssignment.create({
      data: {
        classId: requireString(body, "classId"),
        lessonPlanId: optionalString(body, "lessonPlanId"),
        studyPlanId: optionalString(body, "studyPlanId"),
        studentId: requireString(body, "studentId"),
        tutorId: requireString(body, "tutorId"),
        generatedByAi,
        approvedByTutor: false,
        assignmentContent: toPrismaJsonValue(requireJson(body, "assignmentContent")),
        dueDate: requireDate(body, "dueDate"),
        status: HomeworkLifecycleStatus.DRAFT,
        approvalStatus: PrismaApprovalStatus.DRAFT,
        generatedByAiAt: generatedByAi ? new Date() : null,
        versionHistory: createInitialVersionHistory({
          generatedByAi,
          versionNote: optionalString(body, "versionNote"),
        }),
      },
    });

    return NextResponse.json(
      { data: mapHomeworkAssignment(homework) },
      { status: 201 },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
