import { NextResponse } from "next/server";

import { platformBlueprint } from "@/lib/database-blueprint";

export function GET() {
  return NextResponse.json(platformBlueprint);
}
