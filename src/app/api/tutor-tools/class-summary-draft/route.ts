import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { generateClassSummaryDraft } from "@/lib/server/tutor-copilot";
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

    const summary = await prisma.$transaction((transaction) =>
      generateClassSummaryDraft(transaction, {
        tutorId,
        classId,
      }),
    );

    return NextResponse.json({
      data: {
        id: summary.id,
        classSessionId: summary.classSessionId,
        approvalStatus: summary.approvalStatus.toLowerCase(),
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return toErrorResponse(error);
    }

    return toErrorResponse(error);
  }
}
