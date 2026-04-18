import { IntakeStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

function parseIntakeStatus(value: string) {
  const normalized = value.trim().toUpperCase();

  if (
    normalized !== IntakeStatus.NEW &&
    normalized !== IntakeStatus.REVIEWING &&
    normalized !== IntakeStatus.CONTACTED &&
    normalized !== IntakeStatus.CONVERTED &&
    normalized !== IntakeStatus.ARCHIVED
  ) {
    throw new ApiError(
      "Status must be one of: NEW, REVIEWING, CONTACTED, CONVERTED, ARCHIVED.",
    );
  }

  return normalized;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError("Database access is required before updating bookings.");
    }

    const session = await getCurrentSession();

    if (!session.isAuthenticated || session.user.role !== "Admin") {
      throw new ApiError("Admin access is required to update booking requests.", 403);
    }

    const { id } = await params;
    const body = assertRecord(await request.json());
    const statusInput = optionalString(body, "status");

    if (!statusInput) {
      throw new ApiError('Field "status" is required.');
    }

    const updated = await prisma.bookingRequest.update({
      where: { id },
      data: {
        status: parseIntakeStatus(statusInput) as IntakeStatus,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return toErrorResponse(error);
  }
}
