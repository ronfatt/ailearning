import { NextResponse } from "next/server";

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
      throw new ApiError("Database access is required before applying as a tutor.");
    }

    const body = assertRecord(await request.json());

    const fullName = requireString(body, "fullName");
    const email = requireString(body, "email").toLowerCase();
    const phoneNumber = optionalString(body, "phoneNumber") || null;
    const primarySubject = requireString(body, "primarySubject");
    const levelsTaught = optionalString(body, "levelsTaught") || null;
    const availability = optionalString(body, "availability") || null;
    const teachingExperience =
      optionalString(body, "teachingExperience") || null;
    const notes = optionalString(body, "notes") || null;

    const application = await prisma.tutorApplication.create({
      data: {
        fullName,
        email,
        phoneNumber,
        primarySubject,
        levelsTaught,
        availability,
        teachingExperience,
        notes,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({
      data: {
        applicationId: application.id,
        status: application.status,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
