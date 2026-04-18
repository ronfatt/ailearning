import { NextRequest, NextResponse } from "next/server";

import { getTutorDashboardData } from "@/lib/server/tutor-dashboard";
import { ApiError, toErrorResponse } from "@/lib/server/workflow-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorId = searchParams.get("tutorId") ?? undefined;
    const data = await getTutorDashboardData(tutorId);

    return NextResponse.json({ data });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      typeof error.code === "string"
    ) {
      return NextResponse.json(
        {
          data: {
            summary: {
              lessonPlanDrafts: 0,
              studyPlanQueue: 0,
              homeworkQueue: 0,
              parentReportQueue: 0,
              readinessQueue: 0,
              submissionReviewQueue: 0,
              classSummaryQueue: 0,
              totalPendingApprovals: 0,
            },
            lessonSuggestions: [],
            studyPlanQueue: [],
            classSummaryQueue: [],
            assignmentQueue: [],
            parentReportQueue: [],
            readinessQueue: [],
            submissionReviewQueue: [],
            todaysClasses: [],
            liveClassWorkspace: [],
            afterClassFollowUp: [],
            weakTopicHeatmap: [],
            riskAlerts: [],
            classIntelligence: [],
            source: "unconfigured",
            message:
              "Tutor dashboard could not connect to the database yet. Check DATABASE_URL and Prisma migrations.",
          },
        },
        { status: 200 },
      );
    }

    if (error instanceof ApiError) {
      return toErrorResponse(error);
    }

    return toErrorResponse(error);
  }
}
