import {
  ApprovalStatus as PrismaApprovalStatus,
  Prisma,
  StudyPlanStatus,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ApiError,
  appendVersionHistory,
  assertRecord,
  buildApprovalMetadataUpdate,
  isJsonValue,
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

type RevisionTopicInput = {
  topicKey: string;
  topicLabel: string;
  accessApproved: boolean;
  sequenceOrder: number;
};

function parseRevisionTopics(value: unknown): RevisionTopicInput[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new ApiError('Field "revisionTopics" must be an array.');
  }

  return value.map((entry, index) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      throw new ApiError('Each "revisionTopics" item must be an object.');
    }

    const record = entry as Record<string, unknown>;
    const topicKey = requireString(record, "topicKey");
    const topicLabel = requireString(record, "topicLabel");

    if (typeof record.accessApproved !== "boolean") {
      throw new ApiError(
        'Each "revisionTopics" item must include a boolean "accessApproved".',
      );
    }

    const sequenceValue = record.sequenceOrder;
    const sequenceOrder =
      typeof sequenceValue === "number" && Number.isFinite(sequenceValue)
        ? Math.max(0, Math.round(sequenceValue))
        : index + 1;

    return {
      topicKey,
      topicLabel,
      accessApproved: record.accessApproved,
      sequenceOrder,
    };
  });
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studyPlan = await prisma.studyPlan.findUnique({ where: { id } });

    if (!studyPlan) {
      throw new ApiError("Study plan not found.", 404);
    }

    return NextResponse.json({ data: mapStudyPlan(studyPlan) });
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
    const existing = await prisma.studyPlan.findUnique({
      where: { id },
      include: {
        revisionTopics: {
          orderBy: { sequenceOrder: "asc" },
        },
      },
    });

    if (!existing) {
      throw new ApiError("Study plan not found.", 404);
    }

    const data: Prisma.StudyPlanUpdateInput = {};
    const title = optionalString(body, "title");
    const tutorId = optionalString(body, "tutorId");
    const versionNote = optionalString(body, "versionNote");
    const approvalStatus = parseApprovalStatus(body.approvalStatus);
    const planType = optionalString(body, "planType");
    const status = parseStudyPlanStatus(body.status);
    const aiDraft = optionalJson(body, "aiDraft");
    const tutorEditedContent = optionalJson(body, "tutorEditedContent");
    const revisionTopics = parseRevisionTopics(body.revisionTopics);

    if (title !== undefined) data.title = title;
    if (planType !== undefined) data.planType = planType;
    if (status !== undefined) data.status = status;
    if (aiDraft !== undefined) {
      data.aiDraft = toPrismaNullableJsonValue(aiDraft);
    }
    if (tutorEditedContent !== undefined) {
      data.tutorEditedContent = toPrismaNullableJsonValue(tutorEditedContent);
    }

    if (
      title !== undefined ||
      planType !== undefined ||
      status !== undefined ||
      aiDraft !== undefined ||
      tutorEditedContent !== undefined ||
      revisionTopics !== undefined
    ) {
      data.versionHistory = appendVersionHistory(
        existing.versionHistory,
        versionNote ?? "study plan content updated",
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
      throw new ApiError("No valid study plan fields were provided.");
    }

    const studyPlan = await prisma.$transaction(async (tx) => {
      if (revisionTopics !== undefined) {
        await tx.studyPlanTopic.deleteMany({
          where: { studyPlanId: id },
        });

        await tx.studyPlanTopic.createMany({
          data: revisionTopics.map((topic, index) => ({
            studyPlanId: id,
            topicKey: topic.topicKey,
            topicLabel: topic.topicLabel,
            accessApproved: topic.accessApproved,
            sequenceOrder: topic.sequenceOrder || index + 1,
          })),
        });

        await Promise.all(
          revisionTopics.map((topic) =>
            tx.studentMastery.updateMany({
              where: {
                studentId: existing.studentId,
                subjectId: existing.subjectId,
                topicId: topic.topicKey,
              },
              data: {
                topicLabel: topic.topicLabel,
              },
            }),
          ),
        );

        const existingTutorEdited =
          tutorEditedContent !== undefined
            ? tutorEditedContent
            : isJsonValue(existing.tutorEditedContent)
              ? existing.tutorEditedContent
              : undefined;

        data.tutorEditedContent = toPrismaNullableJsonValue({
          ...(typeof existingTutorEdited === "object" &&
          existingTutorEdited !== null &&
          !Array.isArray(existingTutorEdited)
            ? existingTutorEdited
            : {}),
          revisionTopics,
        });
      }

      return tx.studyPlan.update({
        where: { id },
        data,
      });
    });

    return NextResponse.json({ data: mapStudyPlan(studyPlan) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
