import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  requireString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError("Database access is required before booking a class.");
    }

    const session = await getCurrentSession();
    const body = assertRecord(await request.json());

    const parentName = requireString(body, "parentName");
    const parentEmail = requireString(body, "parentEmail").toLowerCase();
    const parentPhone = optionalString(body, "parentPhone") || null;
    const studentName = requireString(body, "studentName");
    const studentEmail =
      optionalString(body, "studentEmail")?.toLowerCase() || null;
    const studentLevel = requireString(body, "studentLevel");
    const subjectFocus = requireString(body, "subjectFocus");
    const preferredTime = optionalString(body, "preferredTime") || null;
    const notes = optionalString(body, "notes") || null;

    const booking = await prisma.bookingRequest.create({
      data: {
        parentUserId:
          session.isAuthenticated && session.user.role === "Parent"
            ? session.user.id
            : null,
        parentName,
        parentEmail,
        parentPhone,
        studentName,
        studentEmail,
        studentLevel,
        subjectFocus,
        preferredTime,
        notes,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({
      data: {
        bookingId: booking.id,
        status: booking.status,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
