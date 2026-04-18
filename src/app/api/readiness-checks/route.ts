import { ApprovalStatus as PrismaApprovalStatus, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { evaluateReadinessResponses } from "@/lib/readiness-check";
import {
  ApiError,
  appendVersionHistory,
  assertRecord,
  createInitialVersionHistory,
  optionalString,
  requireString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

function mapReadinessSubmission(submission: {
  id: string;
  classId: string;
  subjectId: string;
  studentId: string;
  tutorId: string;
  score: number;
  readinessLevel: string;
  weakTopics: unknown;
  submittedAt: Date;
  approvalStatus: PrismaApprovalStatus;
}) {
  return {
    ...submission,
    approvalStatus: submission.approvalStatus.toLowerCase(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const classId = searchParams.get("classId");

    if (!studentId || !classId) {
      return NextResponse.json({ data: null });
    }

    const readiness = await prisma.readinessCheckSubmission.findUnique({
      where: {
        classId_studentId: {
          classId,
          studentId,
        },
      },
    });

    return NextResponse.json({
      data: readiness ? mapReadinessSubmission(readiness) : null,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const classId = requireString(body, "classId");
    const studentId = requireString(body, "studentId");
    const tutorId = requireString(body, "tutorId");
    const subjectId = requireString(body, "subjectId");
    const responsesInput = body.responses;

    if (
      typeof responsesInput !== "object" ||
      responsesInput === null ||
      Array.isArray(responsesInput)
    ) {
      throw new ApiError('Field "responses" must be an object keyed by question id.');
    }

    const responses = Object.entries(responsesInput).reduce<Record<string, string>>(
      (accumulator, [key, value]) => {
        if (typeof value === "string" && value.trim().length > 0) {
          accumulator[key] = value.trim();
        }

        return accumulator;
      },
      {},
    );

    const evaluation = evaluateReadinessResponses(responses);
    const versionNote = optionalString(body, "versionNote");
    const submittedAt = new Date();
    const existingSubmission = await prisma.readinessCheckSubmission.findUnique({
      where: {
        classId_studentId: {
          classId,
          studentId,
        },
      },
    });

    const existingEnrollment = await prisma.classEnrollment.findFirst({
      where: {
        classId,
        studentId,
      },
    });

    if (!existingEnrollment) {
      throw new ApiError("Student is not linked to this tutor-led class.", 403);
    }

    const [submission] = await prisma.$transaction([
      prisma.readinessCheckSubmission.upsert({
        where: {
          classId_studentId: {
            classId,
            studentId,
          },
        },
        update: {
          tutorId,
          subjectId,
          responses,
          score: evaluation.score,
          readinessLevel: evaluation.readinessLevel,
          weakTopics: evaluation.weakTopics,
          aiSummary: {
            summary: evaluation.summary,
            correctCount: evaluation.correctCount,
            totalQuestions: evaluation.totalQuestions,
          },
          approvalStatus: PrismaApprovalStatus.DRAFT,
          generatedByAiAt: submittedAt,
          reviewedByTutorAt: null,
          approvedByTutorId: null,
          approvedAt: null,
          submittedAt,
          versionHistory: appendVersionHistory(
            existingSubmission?.versionHistory,
            versionNote ?? `student submitted readiness check with ${evaluation.score}% readiness`,
          ),
        },
        create: {
          classId,
          subjectId,
          studentId,
          tutorId,
          responses,
          score: evaluation.score,
          readinessLevel: evaluation.readinessLevel,
          weakTopics: evaluation.weakTopics,
          aiSummary: {
            summary: evaluation.summary,
            correctCount: evaluation.correctCount,
            totalQuestions: evaluation.totalQuestions,
          },
          approvalStatus: PrismaApprovalStatus.DRAFT,
          generatedByAiAt: submittedAt,
          submittedAt,
          versionHistory: createInitialVersionHistory({
            generatedByAi: true,
            versionNote:
              versionNote ?? `student submitted readiness check with ${evaluation.score}% readiness`,
          }),
        },
      }),
      ...evaluation.weakTopics.map((topicLabel) =>
        prisma.studentMastery.updateMany({
          where: {
            studentId,
            subjectId,
            topicLabel,
          },
          data: {
            updatedByAiAt: submittedAt,
            tutorReviewNotes: `AI flagged this topic during the latest readiness check. Awaiting tutor review.`,
          },
        }),
      ),
      prisma.aiActivityLog.create({
        data: {
          userId: studentId,
          role: UserRole.STUDENT,
          featureUsed: "readiness_check_submission",
          inputType: "tutor_linked_pre_class_check",
          outputType: "ai_readiness_analysis",
          approvalRequired: true,
          approvedBy: tutorId,
          sourceEntityType: "readiness_check_submission",
          sourceEntityId: `${classId}:${studentId}`,
          moderationStatus: evaluation.readinessLevel,
        },
      }),
    ]);

    return NextResponse.json({
      data: {
        ...mapReadinessSubmission(submission),
        summary: evaluation.summary,
        weakTopics: evaluation.weakTopics,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
