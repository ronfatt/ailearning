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
      throw new ApiError("Database access is required before sending enquiries.");
    }

    const session = await getCurrentSession();
    const body = assertRecord(await request.json());

    const fullName = requireString(body, "fullName");
    const email = requireString(body, "email").toLowerCase();
    const phoneNumber = optionalString(body, "phoneNumber") || null;
    const organization = optionalString(body, "organization") || null;
    const enquiryType = requireString(body, "enquiryType");
    const message = requireString(body, "message");

    const inquiry = await prisma.contactInquiry.create({
      data: {
        parentUserId:
          session.isAuthenticated && session.user.role === "Parent"
            ? session.user.id
            : null,
        fullName,
        email,
        phoneNumber,
        organization,
        enquiryType,
        message,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({
      data: {
        inquiryId: inquiry.id,
        status: inquiry.status,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
