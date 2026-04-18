import {
  ApprovalStatus as PrismaApprovalStatus,
  Prisma,
} from "@prisma/client";
import { NextResponse } from "next/server";

import type { ApprovalStatus } from "@/lib/approval-workflow";
import { canTransitionApprovalStatus } from "@/lib/approval-workflow";

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);

  return NextResponse.json(
    { error: "An unexpected server error occurred." },
    { status: 500 },
  );
}

export function assertRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ApiError("Request body must be a JSON object.");
  }

  return value as Record<string, unknown>;
}

export function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isJsonValue(item));
  }

  if (typeof value === "object") {
    return Object.values(value).every((item) => isJsonValue(item));
  }

  return false;
}

export function requireString(
  input: Record<string, unknown>,
  key: string,
): string {
  const value = input[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(`Field "${key}" must be a non-empty string.`);
  }

  return value.trim();
}

export function optionalString(
  input: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = input[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiError(`Field "${key}" must be a string.`);
  }

  return value.trim();
}

export function optionalBoolean(
  input: Record<string, unknown>,
  key: string,
): boolean | undefined {
  const value = input[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new ApiError(`Field "${key}" must be a boolean.`);
  }

  return value;
}

export function requireDate(
  input: Record<string, unknown>,
  key: string,
): Date {
  const value = requireString(input, key);
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(`Field "${key}" must be a valid ISO date string.`);
  }

  return date;
}

export function optionalDate(
  input: Record<string, unknown>,
  key: string,
): Date | undefined {
  const value = optionalString(input, key);

  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(`Field "${key}" must be a valid ISO date string.`);
  }

  return date;
}

export function requireJson(
  input: Record<string, unknown>,
  key: string,
): JsonValue {
  const value = input[key];

  if (!isJsonValue(value)) {
    throw new ApiError(`Field "${key}" must be valid JSON-compatible data.`);
  }

  return value;
}

export function optionalJson(
  input: Record<string, unknown>,
  key: string,
): JsonValue | undefined {
  const value = input[key];

  if (value === undefined) {
    return undefined;
  }

  if (!isJsonValue(value)) {
    throw new ApiError(`Field "${key}" must be valid JSON-compatible data.`);
  }

  return value;
}

export function toPrismaJsonValue(value: JsonValue): Prisma.InputJsonValue {
  if (value === null) {
    throw new ApiError("Top-level null is not allowed for this JSON field.");
  }

  return value as Prisma.InputJsonValue;
}

export function toPrismaNullableJsonValue(
  value: JsonValue | undefined,
): Prisma.InputJsonValue | Prisma.NullTypes.JsonNull | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

export function getVersionHistory(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

export function appendVersionHistory(
  currentValue: unknown,
  note?: string,
): string[] {
  const history = getVersionHistory(currentValue);

  if (!note || note.trim().length === 0) {
    return history;
  }

  return [...history, note.trim()];
}

export const approvalStatusToPrisma: Record<
  ApprovalStatus,
  PrismaApprovalStatus
> = {
  draft: PrismaApprovalStatus.DRAFT,
  tutor_reviewed: PrismaApprovalStatus.TUTOR_REVIEWED,
  approved: PrismaApprovalStatus.APPROVED,
  assigned: PrismaApprovalStatus.ASSIGNED,
  archived: PrismaApprovalStatus.ARCHIVED,
};

export const prismaApprovalStatusToApi: Record<
  PrismaApprovalStatus,
  ApprovalStatus
> = {
  DRAFT: "draft",
  TUTOR_REVIEWED: "tutor_reviewed",
  APPROVED: "approved",
  ASSIGNED: "assigned",
  ARCHIVED: "archived",
};

export function parseApprovalStatus(value: unknown): ApprovalStatus | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiError('Field "approvalStatus" must be a string.');
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized !== "draft" &&
    normalized !== "tutor_reviewed" &&
    normalized !== "approved" &&
    normalized !== "assigned" &&
    normalized !== "archived"
  ) {
    throw new ApiError(
      'Field "approvalStatus" must be one of: draft, tutor_reviewed, approved, assigned, archived.',
    );
  }

  return normalized;
}

export function createInitialVersionHistory({
  generatedByAi = true,
  versionNote,
}: {
  generatedByAi?: boolean;
  versionNote?: string;
}) {
  if (versionNote && versionNote.trim().length > 0) {
    return [versionNote.trim()];
  }

  return [generatedByAi ? "v1 AI draft" : "v1 tutor draft"];
}

export function buildApprovalMetadataUpdate({
  currentStatus,
  nextStatus,
  tutorId,
  currentVersionHistory,
  versionNote,
}: {
  currentStatus: PrismaApprovalStatus;
  nextStatus?: ApprovalStatus;
  tutorId?: string;
  currentVersionHistory: unknown;
  versionNote?: string;
}) {
  const update: Record<string, unknown> = {};
  let nextHistory = getVersionHistory(currentVersionHistory);

  if (nextStatus) {
    const currentApiStatus = prismaApprovalStatusToApi[currentStatus];

    if (!canTransitionApprovalStatus(currentApiStatus, nextStatus)) {
      throw new ApiError(
        `Invalid approval transition from "${currentApiStatus}" to "${nextStatus}".`,
      );
    }

    update.approvalStatus = approvalStatusToPrisma[nextStatus];

    const timestamp = new Date();

    if (nextStatus === "tutor_reviewed") {
      update.reviewedByTutorAt = timestamp;
    }

    if (nextStatus === "approved") {
      if (!tutorId) {
        throw new ApiError(
          'Field "tutorId" is required when approvalStatus is "approved".',
        );
      }

      update.reviewedByTutorAt = timestamp;
      update.approvedByTutorId = tutorId;
      update.approvedAt = timestamp;
    }

    if (nextStatus === "assigned") {
      if (!tutorId) {
        throw new ApiError(
          'Field "tutorId" is required when approvalStatus is "assigned".',
        );
      }

      update.reviewedByTutorAt = timestamp;
      update.approvedByTutorId = tutorId;
      update.approvedAt = timestamp;
    }

    nextHistory = appendVersionHistory(
      currentVersionHistory,
      versionNote ?? `status changed to ${nextStatus}`,
    );
  } else if (versionNote) {
    nextHistory = appendVersionHistory(currentVersionHistory, versionNote);
  }

  if (nextHistory.length > 0) {
    update.versionHistory = nextHistory;
  }

  return update;
}
