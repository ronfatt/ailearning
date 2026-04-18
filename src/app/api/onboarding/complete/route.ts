import { AccountStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";
import { buildPendingStudentEmail } from "@/lib/account-links";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  toPrismaJsonValue,
  toErrorResponse,
} from "@/lib/server/workflow-api";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError("Database access is required before completing onboarding.");
    }

    const session = await getCurrentSession();

    if (!session.isAuthenticated || !session.user.id || session.user.role === "Guest") {
      throw new ApiError("Please sign in before continuing onboarding.", 401);
    }

    const body = assertRecord(await request.json());
    const phoneNumber = optionalString(body, "phoneNumber")?.trim() || null;
    const studentName = optionalString(body, "studentName")?.trim();
    const studentEmail =
      optionalString(body, "studentEmail")?.trim().toLowerCase() || null;
    const studentLevel = optionalString(body, "studentLevel")?.trim();
    const subjectInterest = optionalString(body, "subjectInterest")?.trim();
    const primarySubject = optionalString(body, "primarySubject")?.trim();
    const levelsTaught = optionalString(body, "levelsTaught")?.trim();
    const learningGoal = optionalString(body, "learningGoal")?.trim();
    const adminFocus = optionalString(body, "adminFocus")?.trim();

    const profileData = {
      studentName: studentName ?? null,
      studentEmail,
      studentLevel: studentLevel ?? null,
      subjectInterest: subjectInterest ?? null,
      primarySubject: primarySubject ?? null,
      levelsTaught: levelsTaught ?? null,
      learningGoal: learningGoal ?? null,
      adminFocus: adminFocus ?? null,
      completedAt: new Date().toISOString(),
    };

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id! },
        data: {
          phoneNumber,
          onboardingCompleted: true,
          profileData: toPrismaJsonValue(profileData),
        },
      });

      if (
        session.user.role !== "Parent" ||
        !studentName ||
        !studentLevel
      ) {
        return;
      }

      const existingLink = await tx.parentStudentLink.findFirst({
        where: { parentId: session.user.id! },
        select: { studentId: true },
        orderBy: { createdAt: "asc" },
      });

      if (existingLink) {
        return;
      }

      let linkedStudentId: string;

      if (studentEmail) {
        const existingStudent = await tx.user.findUnique({
          where: { email: studentEmail },
          select: { id: true, role: true },
        });

        if (existingStudent && existingStudent.role !== UserRole.STUDENT) {
          throw new ApiError(
            "The student email you entered is already used by another account type.",
            409,
          );
        }

        if (existingStudent) {
          linkedStudentId = existingStudent.id;
        } else {
          const createdStudent = await tx.user.create({
            data: {
              email: studentEmail,
              fullName: studentName,
              role: UserRole.STUDENT,
              accountStatus: AccountStatus.INVITED,
              onboardingCompleted: false,
              profileData: toPrismaJsonValue({
                source: "parent_onboarding",
                studentLevel,
                subjectInterest: subjectInterest ?? null,
              }),
            },
            select: { id: true },
          });

          linkedStudentId = createdStudent.id;
        }
      } else {
        const createdStudent = await tx.user.create({
          data: {
            email: buildPendingStudentEmail(studentName, session.user.id!),
            fullName: studentName,
            role: UserRole.STUDENT,
            accountStatus: AccountStatus.INVITED,
            onboardingCompleted: false,
            profileData: toPrismaJsonValue({
              source: "parent_onboarding",
              studentLevel,
              subjectInterest: subjectInterest ?? null,
              pendingInvite: true,
            }),
          },
          select: { id: true },
        });

        linkedStudentId = createdStudent.id;
      }

      await tx.parentStudentLink.create({
        data: {
          parentId: session.user.id!,
          studentId: linkedStudentId,
          relationship: "Parent",
        },
      });
    });

    return NextResponse.json({
      data: {
        redirectTo: getAuthenticatedHomePath({
          ...session.user,
          onboardingCompleted: true,
        }),
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
