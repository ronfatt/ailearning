import { AccountStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import {
  getPasswordResetUrl,
  sendPasswordResetEmail,
} from "@/lib/auth-email";
import {
  createPasswordResetToken,
  hashPasswordResetToken,
} from "@/lib/auth-security";
import { normalizeEmail, isValidEmail } from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

const resetWindowMs = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError("Database access is required before resetting passwords.");
    }

    const body = assertRecord(await request.json());
    const emailInput = optionalString(body, "email");
    const email = emailInput ? normalizeEmail(emailInput) : undefined;

    if (!email) {
      throw new ApiError("Email is required.");
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
        accountStatus: true,
        passwordHash: true,
      },
    });

    const genericMessage =
      "If an account exists for this email, we will send password reset instructions shortly.";

    if (
      !user ||
      user.accountStatus !== AccountStatus.ACTIVE ||
      !user.passwordHash
    ) {
      return NextResponse.json({
        data: {
          message: genericMessage,
        },
      });
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const rawToken = createPasswordResetToken();
    const expiresAt = new Date(Date.now() + resetWindowMs);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashPasswordResetToken(rawToken),
        expiresAt,
      },
    });

    const resetUrl = getPasswordResetUrl(rawToken);
    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      name: user.fullName,
      resetUrl,
    });

    return NextResponse.json({
      data: {
        message: genericMessage,
        debugResetUrl:
          process.env.NODE_ENV !== "production" && !emailResult.sent
            ? resetUrl
            : undefined,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
