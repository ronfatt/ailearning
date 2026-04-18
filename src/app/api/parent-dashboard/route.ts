import { NextRequest, NextResponse } from "next/server";

import { getParentDashboardData } from "@/lib/server/parent-dashboard";
import { ApiError, toErrorResponse } from "@/lib/server/workflow-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") ?? undefined;
    const data = await getParentDashboardData(parentId);

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
            metrics: [],
            latestReport: null,
            recentHomeworkFeedback: [],
            insights: [],
            reportTrace: [],
            reportWindow: "Pending",
            studentName: "Linked student unavailable",
            latestWelcomeMessage: null,
            enrolledClass: null,
            linkedStudent: null,
            latestBookingRequest: null,
            source: "unconfigured",
            message:
              "Parent dashboard could not connect to the database yet. Check DATABASE_URL and Prisma migrations.",
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
