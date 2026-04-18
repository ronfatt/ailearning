import { NextRequest, NextResponse } from "next/server";

import { getStudentDashboardData } from "@/lib/server/student-dashboard";
import { ApiError, toErrorResponse } from "@/lib/server/workflow-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") ?? undefined;
    const data = await getStudentDashboardData(studentId);

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
            welcomeMessage: null,
            assistantUnlockNotice: null,
            enrollmentStatus: null,
            upcomingClass: {
              className: "Student dashboard unavailable",
              subject: "Database setup needed",
              nextClassLabel: "Pending",
              tutorName: "Pending",
            },
            assignedHomework: [],
            teacherNotes: [],
            subjectProgress: [],
            revisionTasks: [],
            approvedAssistantScope: [],
            source: "unconfigured",
            message:
              "Student dashboard could not connect to the database yet. Check DATABASE_URL and Prisma migrations.",
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
