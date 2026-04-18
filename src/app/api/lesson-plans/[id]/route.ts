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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const lessonPlan = await prisma.lessonPlan.findUnique({ where: { id } });

    if (!lessonPlan) {
      throw new ApiError("Lesson plan not found.", 404);
    }

    return NextResponse.json({ data: mapLessonPlan(lessonPlan) });
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
    const existing = await prisma.lessonPlan.findUnique({ where: { id } });

    if (!existing) {
      throw new ApiError("Lesson plan not found.", 404);
    }

    const data: Prisma.LessonPlanUpdateInput = {};
    const title = optionalString(body, "title");
    const tutorId = optionalString(body, "tutorId");
    const versionNote = optionalString(body, "versionNote");
    const approvalStatus = parseApprovalStatus(body.approvalStatus);
    const objectives = optionalJson(body, "objectives");
    const aiDraft = optionalJson(body, "aiDraft");
    const tutorEditedContent = optionalJson(body, "tutorEditedContent");

    if (title !== undefined) data.title = title;
    if (objectives !== undefined) {
      data.objectives = toPrismaJsonValue(objectives);
    }
    if (aiDraft !== undefined) {
      data.aiDraft = toPrismaNullableJsonValue(aiDraft);
    }
    if (tutorEditedContent !== undefined) {
      data.tutorEditedContent = toPrismaNullableJsonValue(tutorEditedContent);
    }

    if (
      title !== undefined ||
      objectives !== undefined ||
      aiDraft !== undefined ||
      tutorEditedContent !== undefined
    ) {
      data.versionHistory = appendVersionHistory(
        existing.versionHistory,
        versionNote ?? "lesson plan content updated",
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

    if (body.generatedByAiAt !== undefined) {
      data.generatedByAiAt =
        body.generatedByAiAt === null ? null : new Date(requireString(body, "generatedByAiAt"));
    }

    if (Object.keys(data).length === 0) {
      throw new ApiError("No valid lesson plan fields were provided.");
    }

    const lessonPlan = await prisma.lessonPlan.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: mapLessonPlan(lessonPlan) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
