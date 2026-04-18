import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { generateClassPollDraft } from "@/lib/server/tutor-copilot";
import {
  ApiError,
  assertRecord,
  requireString,
  toErrorResponse,
} from "@/lib/server/workflow-api";

export async function POST(request: NextRequest) {
  try {
    const body = assertRecord(await request.json());
    const tutorId = requireString(body, "tutorId");
    const classId = requireString(body, "classId");

    const lessonPlan = await prisma.$transaction((transaction) =>
      generateClassPollDraft(transaction, {
        tutorId,
        classId,
      }),
    );

    return NextResponse.json({
      data: {
        id: lessonPlan.id,
        title: lessonPlan.title,
        approvalStatus: lessonPlan.approvalStatus.toLowerCase(),
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return toErrorResponse(error);
    }

    return toErrorResponse(error);
  }
}
