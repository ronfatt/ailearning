import { AttendanceStatus, Prisma } from "@prisma/client";

export function formatDateTime(value: Date | null | undefined) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

export function getJsonRecord(
  value: Prisma.JsonValue | null | undefined,
): Record<string, Prisma.JsonValue> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, Prisma.JsonValue>;
}

export function getJsonString(
  value: Prisma.JsonValue | null | undefined,
  key: string,
) {
  const record = getJsonRecord(value);
  const candidate = record?.[key];

  return typeof candidate === "string" ? candidate : null;
}

export function getJsonNumber(
  value: Prisma.JsonValue | null | undefined,
  key: string,
) {
  const record = getJsonRecord(value);
  const candidate = record?.[key];

  return typeof candidate === "number" ? candidate : null;
}

export function getJsonStringArray(
  value: Prisma.JsonValue | null | undefined,
  key: string,
) {
  const record = getJsonRecord(value);
  const candidate = record?.[key];

  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate.filter((item): item is string => typeof item === "string");
}

export function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getAttendanceRate(statuses: AttendanceStatus[]) {
  if (statuses.length === 0) {
    return 0;
  }

  const attendedStatuses = new Set<AttendanceStatus>([
    AttendanceStatus.PRESENT,
    AttendanceStatus.LATE,
    AttendanceStatus.EXCUSED,
  ]);

  const attendedCount = statuses.filter((status) => attendedStatuses.has(status)).length;

  return Math.round((attendedCount / statuses.length) * 100);
}
