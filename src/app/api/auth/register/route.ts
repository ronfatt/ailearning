import { AccountStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

import {
  createAuthSession,
  getAuthenticatedHomePath,
  sessionCookieName,
} from "@/lib/auth-session";
import { hashPassword } from "@/lib/auth-security";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  toErrorResponse,
} from "@/lib/server/workflow-api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError("Database access is required before creating accounts.");
    }

    const body = assertRecord(await request.json());
    const fullName = optionalString(body, "fullName")?.trim();
    const email = optionalString(body, "email")?.trim().toLowerCase();
    const password = optionalString(body, "password");

    if (!fullName || !email || !password) {
      throw new ApiError("Full name, email, and password are required.");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ApiError("An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(password);
    const createdUser = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash,
        role: UserRole.PARENT,
        accountStatus: AccountStatus.ACTIVE,
        onboardingCompleted: false,
      },
      select: {
        id: true,
      },
    });

    const createdSession = await createAuthSession(createdUser.id);
    const sessionStore = await cookies();
    sessionStore.set(sessionCookieName, createdSession.rawToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({
      data: {
        redirectTo: getAuthenticatedHomePath({
          id: createdUser.id,
          role: "Parent",
          name: fullName,
          email,
          onboardingCompleted: false,
        }),
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
