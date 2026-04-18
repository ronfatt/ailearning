import {
  approvalObjectTypes,
  approvalStatuses,
  requiredApprovalAuditFields,
} from "@/lib/approval-workflow";
import {
  complianceGuardrails,
  disallowedProductDirections,
  rolePermissionDescriptions,
  systemGoals,
} from "@/lib/platform-core";

export type SchemaTable = {
  name: string;
  purpose: string;
  columns: Array<{
    name: string;
    note: string;
  }>;
};

export const businessModels = [
  "Tutor subscription plan",
  "Per-student active seat pricing",
  "Parent add-on reports and analytics",
  "School or PIBG partnership dashboard",
  "Referral engine for student acquisition",
] as const;

export const roadmapPhases = [
  {
    phase: "Phase 1",
    items: [
      "Tutor dashboard",
      "Live class management",
      "AI lesson drafting",
      "Homework generation",
      "Parent report drafts",
      "Referral system",
    ],
  },
  {
    phase: "Phase 2",
    items: [
      "Personalized revision engine",
      "Class analytics",
      "Parent portal",
      "School and community reporting",
      "Attendance intelligence",
    ],
  },
  {
    phase: "Phase 3",
    items: [
      "AI-generated teacher video summaries",
      "Multilingual explanation engine",
      "Predictive dropout and risk detection",
      "School network dashboards",
      "Advanced learning personalization",
    ],
  },
] as const;

export const schemaTables: SchemaTable[] = [
  {
    name: "classes",
    purpose:
      "Links every learning experience to a tutor, subject, schedule, and live teaching context.",
    columns: [
      { name: "id", note: "Primary key" },
      { name: "tutor_id", note: "Owner of the class" },
      { name: "subject_id", note: "Subject linkage for curriculum scope" },
      { name: "schedule", note: "Live or recurring session timing" },
      { name: "class_type", note: "Online, hybrid, clinic, or revision format" },
      { name: "status", note: "Active, paused, archived" },
    ],
  },
  {
    name: "lesson_plans",
    purpose:
      "Stores AI-generated drafts and tutor-edited plans for each live class.",
    columns: [
      { name: "id", note: "Primary key" },
      { name: "class_id", note: "Associated tutor-led class" },
      { name: "tutor_id", note: "Tutor who reviews and owns the lesson" },
      { name: "title", note: "Lesson title" },
      { name: "objectives", note: "Structured lesson goals" },
      { name: "ai_draft", note: "Raw AI suggestion content" },
      { name: "tutor_edited_content", note: "Tutor-approved version" },
      {
        name: "approval_status",
        note: "draft, tutor_reviewed, approved, assigned, archived",
      },
      { name: "created_at", note: "Draft creation timestamp" },
      { name: "approved_at", note: "Tutor approval timestamp" },
    ],
  },
  {
    name: "student_mastery",
    purpose:
      "Tracks progress by student, subject, and topic while preserving tutor oversight.",
    columns: [
      { name: "id", note: "Primary key" },
      { name: "student_id", note: "Student reference" },
      { name: "subject_id", note: "Approved subject scope" },
      { name: "topic_id", note: "Topic-level tracking" },
      { name: "mastery_score", note: "Current estimated mastery" },
      { name: "updated_by_ai_at", note: "Last AI mastery update" },
      { name: "reviewed_by_tutor_at", note: "Tutor review timestamp" },
    ],
  },
  {
    name: "homework_assignments",
    purpose:
      "Stores homework that AI can draft but tutors must approve before assignment.",
    columns: [
      { name: "id", note: "Primary key" },
      { name: "class_id", note: "Class linkage" },
      { name: "student_id", note: "Assigned learner" },
      { name: "generated_by_ai", note: "Boolean or source marker" },
      { name: "approved_by_tutor", note: "Boolean approval result" },
      { name: "assignment_content", note: "Tutor-approved task content" },
      { name: "due_date", note: "Homework due date" },
      { name: "status", note: "draft, approved, assigned, archived" },
    ],
  },
  {
    name: "parent_reports",
    purpose:
      "Delivers parent transparency while enforcing tutor review on all communications.",
    columns: [
      { name: "id", note: "Primary key" },
      { name: "student_id", note: "Student reference" },
      { name: "tutor_id", note: "Tutor owner of the report" },
      { name: "ai_summary", note: "AI drafted report text" },
      { name: "tutor_notes", note: "Tutor additions or edits" },
      { name: "approval_status", note: "Workflow status" },
      { name: "sent_at", note: "Delivery timestamp" },
    ],
  },
  {
    name: "ai_activity_logs",
    purpose:
      "Provides traceability for every AI action and approval requirement.",
    columns: [
      { name: "id", note: "Primary key" },
      { name: "user_id", note: "Actor who triggered the event" },
      { name: "role", note: "Tutor, student, parent, or admin" },
      {
        name: "feature_used",
        note: "AI Teaching Copilot, AI Study Assistant, moderation, and more",
      },
      {
        name: "input_type",
        note: "Weakness map, prompt, attendance event, or report data",
      },
      {
        name: "output_type",
        note: "Lesson draft, revision hint, parent report draft, and more",
      },
      {
        name: "approval_required",
        note: "Whether tutor or admin approval is required",
      },
      { name: "approved_by", note: "Approver identity or policy scope" },
      { name: "created_at", note: "Event timestamp" },
    ],
  },
];

export const platformBlueprint = {
  systemGoals,
  rolePermissions: rolePermissionDescriptions,
  approvalStatuses,
  approvalObjectTypes,
  requiredApprovalAuditFields,
  complianceGuardrails,
  disallowedProductDirections,
  businessModels,
  roadmapPhases,
  schemaTables,
};
