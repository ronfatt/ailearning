import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AccountStatus } from "@prisma/client";

import {
  createAuthSession,
  getAuthenticatedHomePath,
  getCurrentSession,
  revokeAuthSession,
  sessionCookieName,
} from "@/lib/auth-session";
import { verifyPassword } from "@/lib/auth-security";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

export async function GET() {
  try {
    const session = await getCurrentSession();

    return NextResponse.json({
      data: {
        session,
        redirectTo:
          session.isAuthenticated && session.user.role !== "Guest"
            ? getAuthenticatedHomePath(session.user)
            : "/login",
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError(
        "Database access is required before invited accounts can sign in.",
      );
    }

    const body = assertRecord(await request.json());
    const emailInput = optionalString(body, "email");
    const password = optionalString(body, "password");
    const email = emailInput ? normalizeEmail(emailInput) : undefined;

    if (!email) {
      throw new ApiError('Field "email" is required.');
    }

    if (!password) {
      throw new ApiError('Field "password" is required.');
    }

    if (!isValidEmail(email)) {
      throw new ApiError("Please enter a valid email address.");
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        passwordHash: true,
        accountStatus: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      throw new ApiError(
        "We could not find an account for this email yet.",
        404,
      );
    }

    if (user.accountStatus === AccountStatus.DISABLED) {
      throw new ApiError("This account has been disabled. Please contact support.");
    }

    if (!user.passwordHash || user.accountStatus === AccountStatus.INVITED) {
      throw new ApiError(
        "This account still needs activation. Finish setup before signing in.",
        403,
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new ApiError("The email or password is incorrect.", 401);
    }

    const existingSession = (await cookies()).get(sessionCookieName)?.value;
    if (existingSession) {
      await revokeAuthSession(existingSession);
    }

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
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role,
          onboardingCompleted: user.onboardingCompleted,
        },
        redirectTo: getAuthenticatedHomePath({
          id: user.id,
          email: user.email,
          name: user.fullName,
          role,
          onboardingCompleted: user.onboardingCompleted,
        }),
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE() {
  try {
    const sessionStore = await cookies();
    const existingSession = sessionStore.get(sessionCookieName)?.value;

    if (existingSession) {
      await revokeAuthSession(existingSession);
      sessionStore.delete(sessionCookieName);
    }

    return NextResponse.json({
      data: {
        success: true,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
