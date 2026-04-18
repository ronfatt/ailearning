import { AccountStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  createAuthSession,
  getAuthenticatedHomePath,
  revokeAllAuthSessionsForUser,
  sessionCookieName,
} from "@/lib/auth-session";
import {
  hashPassword,
  hashPasswordResetToken,
} from "@/lib/auth-security";
import { validatePassword } from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError("Database access is required before resetting passwords.");
    }

    const body = assertRecord(await request.json());
    const token = optionalString(body, "token");
    const password = optionalString(body, "password");

    if (!token || !password) {
      throw new ApiError("Token and password are required.");
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      throw new ApiError(passwordError);
    }

    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash: hashPasswordResetToken(token),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            onboardingCompleted: true,
            accountStatus: true,
          },
        },
      },
    });

    if (!tokenRecord || tokenRecord.usedAt || tokenRecord.expiresAt <= new Date()) {
      throw new ApiError("This reset link is invalid or has expired.", 400);
    }

    if (tokenRecord.user.accountStatus !== AccountStatus.ACTIVE) {
      throw new ApiError("This account is not active yet. Please activate it first.", 403);
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.user.id },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: tokenRecord.user.id,
          id: {
            not: tokenRecord.id,
          },
        },
      }),
    ]);

    await revokeAllAuthSessionsForUser(tokenRecord.user.id);

    const createdSession = await createAuthSession(tokenRecord.user.id);
    const sessionStore = await cookies();
    sessionStore.set(sessionCookieName, createdSession.rawToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    });

    const role =
      tokenRecord.user.role === "TUTOR"
        ? "Tutor"
        : tokenRecord.user.role === "STUDENT"
          ? "Student"
          : tokenRecord.user.role === "PARENT"
            ? "Parent"
            : "Admin";

    return NextResponse.json({
      data: {
        redirectTo: getAuthenticatedHomePath({
          id: tokenRecord.user.id,
          email: tokenRecord.user.email,
          name: tokenRecord.user.fullName,
          role,
          onboardingCompleted: tokenRecord.user.onboardingCompleted,
        }),
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
