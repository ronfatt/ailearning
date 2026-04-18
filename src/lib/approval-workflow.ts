export const approvalStatuses = [
  {
    status: "draft",
    description:
      "Created by AI and waiting for tutor review before it can affect teaching or communication.",
  },
  {
    status: "tutor_reviewed",
    description:
      "Seen and adjusted by the tutor but not yet approved for assignment or delivery.",
  },
  {
    status: "approved",
    description:
      "Approved by the tutor and ready for student or parent use.",
  },
  {
    status: "assigned",
    description:
      "Released to the target student, class, or parent after tutor approval.",
  },
  {
    status: "archived",
    description:
      "Retained for traceability and version history but no longer active.",
  },
] as const;

export type ApprovalStatus = (typeof approvalStatuses)[number]["status"];

export const approvalObjectTypes = [
  "lesson_plan",
  "class_summary",
  "homework_set",
  "revision_plan",
  "student_report",
  "parent_message",
] as const;

export type ApprovalObjectType = (typeof approvalObjectTypes)[number];

export const approvalTransitionMap: Record<
  ApprovalStatus,
  readonly ApprovalStatus[]
> = {
  draft: ["tutor_reviewed", "archived"],
  tutor_reviewed: ["approved", "draft", "archived"],
  approved: ["assigned", "archived", "tutor_reviewed"],
  assigned: ["archived"],
  archived: [],
};

export const requiredApprovalAuditFields = [
  "generated_by_ai_at",
  "reviewed_by_tutor_at",
  "approved_by_tutor_id",
  "version_history",
] as const;

export type ApprovalAuditFields = {
  approvalStatus: ApprovalStatus;
  generatedByAiAt: string;
  reviewedByTutorAt: string | null;
  approvedByTutorId: string | null;
  versionHistory: string[];
};

export function canTransitionApprovalStatus(
  from: ApprovalStatus,
  to: ApprovalStatus,
) {
  return approvalTransitionMap[from].includes(to);
}

export function createDraftApprovalAudit(
  generatedAt: string = new Date().toISOString(),
): ApprovalAuditFields {
  return {
    approvalStatus: "draft",
    generatedByAiAt: generatedAt,
    reviewedByTutorAt: null,
    approvedByTutorId: null,
    versionHistory: ["v1 AI draft"],
  };
}

export function markApprovalReviewed(
  audit: ApprovalAuditFields,
  reviewedAt: string = new Date().toISOString(),
) {
  if (!canTransitionApprovalStatus(audit.approvalStatus, "tutor_reviewed")) {
    return audit;
  }

  return {
    ...audit,
    approvalStatus: "tutor_reviewed" as const,
    reviewedByTutorAt: reviewedAt,
  };
}

export function markApprovalApproved(
  audit: ApprovalAuditFields,
  tutorId: string,
  approvedAt: string = new Date().toISOString(),
) {
  if (!canTransitionApprovalStatus(audit.approvalStatus, "approved")) {
    return audit;
  }

  return {
    ...audit,
    approvalStatus: "approved" as const,
    reviewedByTutorAt: audit.reviewedByTutorAt ?? approvedAt,
    approvedByTutorId: tutorId,
    versionHistory: [...audit.versionHistory, "tutor approved"],
  };
}
