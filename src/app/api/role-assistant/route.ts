import { NextRequest, NextResponse } from "next/server";

import {
  getRoleAssistantReply,
  type RoleAssistantKind,
} from "@/lib/server/role-assistant";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      role?: RoleAssistantKind;
      roleId?: string;
      message?: string;
    };

    if (!body.role || !["student", "parent", "tutor"].includes(body.role)) {
      return NextResponse.json(
        { error: "A valid role is required." },
        { status: 400 },
      );
    }

    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "Please enter a question first." },
        { status: 400 },
      );
    }

    const reply = await getRoleAssistantReply({
      role: body.role,
      roleId: body.roleId,
      message,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate assistant reply.",
      },
      { status: 500 },
    );
  }
}
