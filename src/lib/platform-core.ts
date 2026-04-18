export const systemGoals = [
  "Help tutors teach better, faster, and more personally.",
  "Help students revise and practice after teacher-led sessions.",
  "Help parents see progress clearly.",
  "Keep the platform compliant, teacher-led, and scalable.",
] as const;

export const productGuardrails = [
  "Human tutors are the primary educators.",
  "AI supports teaching but never replaces the teacher.",
  "All student-facing AI flows must be linked to a tutor, class, subject, or tutor-approved study plan.",
  "Student AI interactions must stay within age, class, subject, and curriculum boundaries.",
] as const;

export const roleNames = ["Tutor", "Student", "Parent", "Admin"] as const;

export type PlatformRole = (typeof roleNames)[number];

export const rolePermissionMap = {
  Tutor: [
    "create_and_manage_classes",
    "approve_ai_lesson_suggestions",
    "assign_homework",
    "review_student_performance",
    "send_reports_to_parents",
    "review_ai_drafts",
  ],
  Student: [
    "join_tutor_led_classes",
    "complete_assigned_homework",
    "use_ai_study_assistant_within_approved_scope",
    "view_teacher_notes",
  ],
  Parent: [
    "view_child_progress",
    "view_attendance",
    "view_tutor_comments",
    "receive_tutor_approved_reports",
  ],
  Admin: [
    "manage_users",
    "manage_tutors",
    "manage_classes",
    "manage_payments",
    "manage_school_partnerships",
    "manage_referrals",
    "monitor_ai_logs",
    "monitor_approval_workflows",
  ],
} as const satisfies Record<PlatformRole, readonly string[]>;

export type PlatformPermission =
  (typeof rolePermissionMap)[PlatformRole][number];

export const rolePermissionDescriptions: Record<
  PlatformRole,
  Array<{ permission: PlatformPermission; label: string }>
> = {
  Tutor: [
    { permission: "create_and_manage_classes", label: "Create and manage classes" },
    {
      permission: "approve_ai_lesson_suggestions",
      label: "Approve AI-generated lesson suggestions",
    },
    { permission: "assign_homework", label: "Assign homework" },
    {
      permission: "review_student_performance",
      label: "Review student performance",
    },
    { permission: "send_reports_to_parents", label: "Send reports to parents" },
    { permission: "review_ai_drafts", label: "Review all teaching-related AI drafts" },
  ],
  Student: [
    {
      permission: "join_tutor_led_classes",
      label: "Join tutor-led classes",
    },
    {
      permission: "complete_assigned_homework",
      label: "Complete assigned homework",
    },
    {
      permission: "use_ai_study_assistant_within_approved_scope",
      label: "Use AI Study Assistant only within approved subjects or topics",
    },
    { permission: "view_teacher_notes", label: "View teacher notes" },
  ],
  Parent: [
    { permission: "view_child_progress", label: "View child progress" },
    { permission: "view_attendance", label: "View attendance" },
    { permission: "view_tutor_comments", label: "View tutor comments" },
    {
      permission: "receive_tutor_approved_reports",
      label: "Receive AI-drafted but tutor-approved reports",
    },
  ],
  Admin: [
    { permission: "manage_users", label: "Manage users" },
    { permission: "manage_tutors", label: "Manage tutors" },
    { permission: "manage_classes", label: "Manage classes" },
    { permission: "manage_payments", label: "Manage payments" },
    {
      permission: "manage_school_partnerships",
      label: "Manage school and community partnerships",
    },
    { permission: "manage_referrals", label: "Manage referral logic" },
    { permission: "monitor_ai_logs", label: "Monitor AI usage logs" },
    {
      permission: "monitor_approval_workflows",
      label: "Monitor tutor approval workflows",
    },
  ],
};

export const complianceGuardrails = [
  "AI cannot create or assign final teaching content to students without tutor review.",
  "AI cannot message parents directly without tutor approval.",
  "AI cannot advertise itself as a certified teacher or replacement for a tutor.",
  "AI-generated content must include internal traceability and moderation logging.",
  "Student AI interactions must be scoped by age, class, subject, and tutor-approved curriculum boundaries.",
] as const;

export const disallowedProductDirections = [
  "a fully autonomous AI teaching platform",
  "a generic ChatGPT wrapper",
  "a direct-to-student unsupervised AI classroom",
  "a feature-heavy LMS with weak teacher workflow",
  "a live class app without strong tutor intelligence tools",
] as const;

export function getPermissionsForRole(role: PlatformRole) {
  return rolePermissionMap[role];
}

export function roleHasPermission(
  role: PlatformRole,
  permission: PlatformPermission,
) {
  return (rolePermissionMap[role] as readonly PlatformPermission[]).includes(
    permission,
  );
}

export function canStudentUseAiStudyAssistant({
  hasTutorLink,
  isApprovedTopic,
}: {
  hasTutorLink: boolean;
  isApprovedTopic: boolean;
}) {
  return hasTutorLink && isApprovedTopic;
}
