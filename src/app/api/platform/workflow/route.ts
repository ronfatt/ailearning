import { NextResponse } from "next/server";

import {
  approvalObjectTypes,
  approvalStatuses,
  approvalTransitionMap,
  requiredApprovalAuditFields,
} from "@/lib/approval-workflow";

export function GET() {
  return NextResponse.json({
    approvalObjectTypes,
    approvalStatuses,
    approvalTransitionMap,
    requiredApprovalAuditFields,
  });
}
