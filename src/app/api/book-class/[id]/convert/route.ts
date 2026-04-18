import { AccountStatus, IntakeStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth-session";
import { buildPendingStudentEmail } from "@/lib/account-links";
import { prisma } from "@/lib/prisma";
import { ApiError, toErrorResponse, toPrismaJsonValue } from "@/lib/server/workflow-api";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError(
        "Database access is required before converting a booking request.",
      );
    }

    const session = await getCurrentSession();

    if (!session.isAuthenticated || session.user.role !== "Admin") {
      throw new ApiError("Admin access is required to convert booking requests.", 403);
    }

    const { id } = await params;

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.bookingRequest.findUnique({
        where: { id },
      });

      if (!booking) {
        throw new ApiError("Booking request not found.", 404);
      }

      let studentId: string | null = null;

      if (booking.studentEmail) {
        const existingStudent = await tx.user.findUnique({
          where: { email: booking.studentEmail },
          select: { id: true, role: true },
        });

        if (existingStudent && existingStudent.role !== UserRole.STUDENT) {
          throw new ApiError(
            "The booking's student email belongs to another account type.",
            409,
          );
        }

        if (existingStudent) {
          studentId = existingStudent.id;
        }
      }

      if (!studentId && booking.parentUserId) {
        const existingLink = await tx.parentStudentLink.findFirst({
          where: { parentId: booking.parentUserId },
          select: { studentId: true },
          orderBy: { createdAt: "asc" },
        });

        studentId = existingLink?.studentId ?? null;
      }

      if (!studentId) {
        const createdStudent = await tx.user.create({
          data: {
            email:
              booking.studentEmail ??
              buildPendingStudentEmail(
                booking.studentName,
                booking.parentUserId ?? booking.id,
              ),
            fullName: booking.studentName,
            role: UserRole.STUDENT,
            accountStatus: AccountStatus.INVITED,
            onboardingCompleted: false,
            profileData: toPrismaJsonValue({
              source: "booking_conversion",
              studentLevel: booking.studentLevel,
              subjectFocus: booking.subjectFocus,
              pendingInvite: !booking.studentEmail,
            }),
          },
          select: { id: true },
        });

        studentId = createdStudent.id;
      }

      if (booking.parentUserId && studentId) {
        await tx.parentStudentLink.upsert({
          where: {
            parentId_studentId: {
              parentId: booking.parentUserId,
              studentId,
            },
          },
          update: {},
          create: {
            parentId: booking.parentUserId,
            studentId,
            relationship: "Parent",
          },
        });
      }

      const enrollmentDraft = await tx.enrollmentDraft.upsert({
        where: { bookingRequestId: booking.id },
        update: {
          parentUserId: booking.parentUserId,
          studentId,
          studentName: booking.studentName,
          studentLevel: booking.studentLevel,
          subjectFocus: booking.subjectFocus,
          preferredTime: booking.preferredTime,
          notes: booking.notes,
          status: "PENDING_MATCH",
        },
        create: {
          bookingRequestId: booking.id,
          parentUserId: booking.parentUserId,
          studentId,
          studentName: booking.studentName,
          studentLevel: booking.studentLevel,
          subjectFocus: booking.subjectFocus,
          preferredTime: booking.preferredTime,
          notes: booking.notes,
          status: "PENDING_MATCH",
        },
        select: {
          id: true,
          status: true,
          studentId: true,
        },
      });

      await tx.bookingRequest.update({
        where: { id: booking.id },
        data: { status: IntakeStatus.CONVERTED },
      });

      return enrollmentDraft;
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return toErrorResponse(error);
  }
}
