import { AccountStatus } from "@prisma/client";
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
      throw new ApiError("Database access is required before activating accounts.");
    }

    const body = assertRecord(await request.json());
    const email = optionalString(body, "email")?.trim().toLowerCase();
    const password = optionalString(body, "password");

    if (!email || !password) {
      throw new ApiError("Email and password are required.");
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        accountStatus: true,
      },
    });

    if (!user) {
      throw new ApiError("No invited account was found for this email.", 404);
    }

    if (user.accountStatus === AccountStatus.DISABLED) {
      throw new ApiError("This account has been disabled. Please contact support.");
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        accountStatus: AccountStatus.ACTIVE,
      },
    });

    const createdSession = await createAuthSession(user.id);
    const sessionStore = await cookies();
    sessionStore.set(sessionCookieName, createdSession.rawToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    });

    const role =
      user.role === "TUTOR"
        ? "Tutor"
        : user.role === "STUDENT"
          ? "Student"
          : user.role === "PARENT"
            ? "Parent"
            : "Admin";

    return NextResponse.json({
      data: {
        redirectTo: getAuthenticatedHomePath({
          id: user.id,
          role,
          name: "",
          onboardingCompleted: false,
        }),
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
