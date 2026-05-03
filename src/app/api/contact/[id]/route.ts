import { NextResponse } from "next/server";
import { IntakeStatus } from "@prisma/client";

import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  requireString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

const allowedStatuses = new Set<string>(Object.values(IntakeStatus));

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError("Database access is required before updating enquiries.");
    }

    const session = await getCurrentSession();

    if (
      !canAccessRole({
        currentRole: session.user.role,
        allowedRoles: ["Admin"],
      })
    ) {
      throw new ApiError("Only admins can update contact enquiries.");
    }

    const { id } = await params;
    const body = assertRecord(await request.json());
    const rawStatus = requireString(body, "status").toUpperCase();

    if (!allowedStatuses.has(rawStatus)) {
      throw new ApiError("Invalid intake status provided.");
    }

    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data: { status: rawStatus as IntakeStatus },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({
      data: inquiry,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
