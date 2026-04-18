export type ApprovalStatus =
  | "draft"
  | "tutor_reviewed"
  | "approved"
  | "assigned"
  | "archived";

export type RoleName = "Tutor" | "Student" | "Parent" | "Admin";

export type TutorClass = {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  readiness: string;
  attendance: string;
  focus: string;
};

export type ApprovalItem = {
  id: string;
  type:
    | "lesson_plan"
    | "class_summary"
    | "homework_set"
    | "revision_plan"
    | "student_report"
    | "parent_message";
  title: string;
  owner: string;
  status: ApprovalStatus;
  generatedAt: string;
  reviewedAt: string;
  approvedByTutorId: string;
  versionHistory: string[];
};

export type SchemaTable = {
  name: string;
  purpose: string;
  columns: Array<{
    name: string;
    note: string;
  }>;
};

export const platformSummary = {
  productName: "AI Learning OS",
  positioning: "Teacher-led AI-assisted tuition operating system for Malaysia",
  tutorName: "Teacher Farah",
  studentName: "Aina Sofia",
  className: "Form 5 Algebra Sprint",
  subject: "SPM Mathematics",
  nextClass: "Today, 8:00 PM",
};

export const preDuringPostFlow = [
  {
    phase: "Pre-Class",
    title: "Plan with the AI Teaching Copilot",
    tasks: [
      "Analyze student weaknesses by class, subject, and recent homework",
      "Draft lesson objectives and warm-up questions for tutor approval",
      "Flag students who need extra attention before live teaching starts",
    ],
  },
  {
    phase: "During Class",
    title: "Support the tutor live, never replace them",
    tasks: [
      "Generate quick quizzes, class polls, and explanation drafts on demand",
      "Track student participation and missed responses during the session",
      "Keep the tutor in control of all teaching decisions and classroom pacing",
    ],
  },
  {
    phase: "Post-Class",
    title: "Extend learning through tutor-approved follow-up",
    tasks: [
      "Draft homework and revision plans linked to the lesson just taught",
      "Update mastery tracking by topic and recommend next steps",
      "Prepare parent-friendly summaries for tutor review before sending",
    ],
  },
];

export const tutorMetrics = [
  {
    label: "Today's Classes",
    value: "4 sessions",
    detail: "The tutor dashboard is the operational core, so daily class load is visible first.",
    tone: "teal" as const,
  },
  {
    label: "Students Needing Attention",
    value: "7 learners",
    detail: "Risk alerts combine low attendance, repeated mistakes, and incomplete homework.",
    tone: "coral" as const,
  },
  {
    label: "Approval Queue",
    value: "11 drafts",
    detail: "AI can draft content quickly, but nothing educational reaches students without tutor review.",
    tone: "gold" as const,
  },
  {
    label: "Parent Reports Pending",
    value: "6 reports",
    detail: "Reports are AI-drafted and tutor-approved so communication stays compliant and personal.",
    tone: "teal" as const,
  },
];

export const todaysClasses: TutorClass[] = [
  {
    id: "cls-01",
    name: "Form 5 Algebra Sprint",
    subject: "SPM Mathematics",
    schedule: "8:00 PM - 9:00 PM",
    readiness: "82% class readiness",
    attendance: "18 / 20 expected",
    focus: "Word problems and simultaneous equations",
  },
  {
    id: "cls-02",
    name: "Form 4 Ratio Workshop",
    subject: "SPM Mathematics",
    schedule: "5:30 PM - 6:30 PM",
    readiness: "69% class readiness",
    attendance: "13 / 15 expected",
    focus: "Fractions, ratios, and unit conversions",
  },
  {
    id: "cls-03",
    name: "Weekend Catch-Up Clinic",
    subject: "Foundation Math",
    schedule: "Saturday, 10:00 AM",
    readiness: "58% class readiness",
    attendance: "9 / 12 expected",
    focus: "High-risk students with low completion",
  },
];

export const weakTopicHeatmap = [
  {
    className: "Form 5 Algebra Sprint",
    topic: "Word Problems",
    intensity: 88,
    note: "Narrative-to-equation translation remains the main class weakness.",
  },
  {
    className: "Form 4 Ratio Workshop",
    topic: "Ratios",
    intensity: 71,
    note: "Students lose marks when switching between fractions and ratio notation.",
  },
  {
    className: "Weekend Catch-Up Clinic",
    topic: "Linear Equations",
    intensity: 64,
    note: "Conceptual gaps are slowing down students before multi-step questions.",
  },
];

export const lessonSuggestions = [
  {
    title: "Lesson Objective Draft",
    status: "draft" as ApprovalStatus,
    detail:
      "By the end of class, students should convert narrative problems into equations and solve them in two steps.",
  },
  {
    title: "Warm-up Quiz Draft",
    status: "tutor_reviewed" as ApprovalStatus,
    detail:
      "5 short questions targeting translation from story format to algebraic expressions before the live lesson begins.",
  },
  {
    title: "Students to Watch",
    status: "approved" as ApprovalStatus,
    detail:
      "Aina, Danish, and Hafiz need extra check-ins because they repeated the same mistake pattern in homework.",
  },
];

export const liveClassTools = [
  "One-click warm-up quiz generation",
  "Concept explanation drafts for difficult questions",
  "Class poll generation for quick understanding checks",
  "Participation tracking and missed-response alerts",
];

export const assignmentQueue: ApprovalItem[] = [
  {
    id: "hw-01",
    type: "homework_set",
    title: "Word Problem Practice Set A",
    owner: "Form 5 Algebra Sprint",
    status: "approved",
    generatedAt: "2026-04-03 17:05",
    reviewedAt: "2026-04-03 17:18",
    approvedByTutorId: "tutor_farrah_01",
    versionHistory: ["v1 AI draft", "v2 tutor simplified question 3"],
  },
  {
    id: "rev-01",
    type: "revision_plan",
    title: "Aina Sofia post-class revision plan",
    owner: "Aina Sofia",
    status: "tutor_reviewed",
    generatedAt: "2026-04-03 17:22",
    reviewedAt: "2026-04-03 17:31",
    approvedByTutorId: "pending",
    versionHistory: ["v1 AI draft", "v2 tutor adjusted difficulty"],
  },
  {
    id: "sum-01",
    type: "class_summary",
    title: "Class summary for Form 4 Ratio Workshop",
    owner: "Form 4 Ratio Workshop",
    status: "draft",
    generatedAt: "2026-04-03 16:40",
    reviewedAt: "Pending",
    approvedByTutorId: "pending",
    versionHistory: ["v1 AI summary draft"],
  },
];

export const parentReportQueue: ApprovalItem[] = [
  {
    id: "rep-01",
    type: "student_report",
    title: "Weekly progress report for Aina Sofia",
    owner: "Parent channel",
    status: "approved",
    generatedAt: "2026-04-03 17:45",
    reviewedAt: "2026-04-03 17:58",
    approvedByTutorId: "tutor_farrah_01",
    versionHistory: ["v1 AI draft", "v2 tutor note added"],
  },
  {
    id: "msg-01",
    type: "parent_message",
    title: "Follow-up note about attendance risk",
    owner: "Parent channel",
    status: "draft",
    generatedAt: "2026-04-03 16:55",
    reviewedAt: "Pending",
    approvedByTutorId: "pending",
    versionHistory: ["v1 AI draft"],
  },
];

export const riskAlerts = [
  {
    student: "Aina Sofia",
    risk: "Repeated mistakes in word problems",
    action: "Use guided examples and check understanding during class.",
  },
  {
    student: "Hafiz Rahman",
    risk: "Attendance dropped to 62%",
    action: "Send tutor-approved parent report before the weekend.",
  },
  {
    student: "Danish Lee",
    risk: "Homework completion stalled for 2 sessions",
    action: "Assign shorter post-class revision tasks and review live.",
  },
];

export const studentDashboardMetrics = [
  {
    label: "Upcoming Class",
    value: "Today, 8:00 PM",
    detail: "Every student-facing activity is anchored to a live class, teacher, or approved study plan.",
    tone: "teal" as const,
  },
  {
    label: "Assigned Homework",
    value: "2 active sets",
    detail: "Homework is generated with AI assistance but assigned only after tutor approval.",
    tone: "gold" as const,
  },
  {
    label: "Revision Tasks",
    value: "3 tasks",
    detail: "Revision remains scoped to approved topics instead of open-ended independent AI tutoring.",
    tone: "coral" as const,
  },
  {
    label: "Attendance",
    value: "86%",
    detail: "Attendance affects readiness, parent reporting, and tutor risk alerts.",
    tone: "teal" as const,
  },
];

export const subjectProgress = [
  {
    id: "subj-01",
    title: "Word Problems",
    mastery: 54,
    status: "priority",
    note: "Assigned after Teacher Farah's last live class.",
  },
  {
    id: "subj-02",
    title: "Linear Equations",
    mastery: 81,
    status: "strong",
    note: "Teacher-approved revision shows stable improvement.",
  },
  {
    id: "subj-03",
    title: "Ratios and Fractions",
    mastery: 66,
    status: "watch",
    note: "Keep practicing only inside the Form 5 study plan.",
  },
];

export const assignedHomework = [
  {
    title: "Homework Set 04",
    dueDate: "Tomorrow, 6:00 PM",
    scope: "Teacher-approved word problem practice",
  },
  {
    title: "Warm-up redo",
    dueDate: "Before next class",
    scope: "Retry 5 questions from the tutor's warm-up quiz",
  },
];

export const revisionTasks = [
  "Complete the 10-minute revision task for word problems",
  "Review Teacher Farah's note on equation setup",
  "Open the AI Study Assistant only for approved topics",
];

export const teacherNotes = [
  "Focus on translating the story before solving the equation.",
  "Show your steps clearly so I can see where confusion starts.",
  "Use the AI Study Assistant only inside the assigned lesson plan for this week.",
];

export const approvedAssistantScope = [
  "Word Problems - approved until Sunday",
  "Linear Equations - approved for revision only",
  "Ratios - locked until after the next tutor session",
];

export const parentMetrics = [
  {
    label: "Attendance",
    value: "86%",
    detail: "Parents can monitor consistency without seeing noisy internal analytics.",
    tone: "teal" as const,
  },
  {
    label: "Tutor Comments",
    value: "3 notes",
    detail: "Comments come from the tutor, even when AI helps draft the summary.",
    tone: "gold" as const,
  },
  {
    label: "Homework Completion",
    value: "78%",
    detail: "The goal is visibility into effort and follow-through after class.",
    tone: "coral" as const,
  },
  {
    label: "Next Session",
    value: "Today, 8:00 PM",
    detail: "Live class scheduling stays central because the platform is teacher-led.",
    tone: "teal" as const,
  },
];

export const parentInsights = [
  {
    label: "Tutor-Approved Summary",
    value: "Ready to send",
    note: "AI drafted the report, and Teacher Farah approved it after adjusting the tone and next-step advice.",
  },
  {
    label: "Main Weakness",
    value: "Word Problems",
    note: "Aina understands formulas but still hesitates when translating longer questions into equations.",
  },
  {
    label: "Recommended Action",
    value: "3 short revision bursts",
    note: "Teacher Farah wants Aina to complete three short approved revision tasks before the next session.",
  },
];

export const reportTrace = [
  "generated_by_ai_at: 2026-04-03 17:45",
  "reviewed_by_tutor_at: 2026-04-03 17:58",
  "approved_by_tutor_id: tutor_farrah_01",
  "version_history: v1 AI draft, v2 tutor note added",
];

export const adminMetrics = [
  {
    label: "Active Tutors",
    value: "24",
    detail: "The commercial core is the tutor subscription layer, not a pure student chatbot product.",
    tone: "teal" as const,
  },
  {
    label: "Active Seats",
    value: "412",
    detail: "Per-student active seat pricing scales with real classroom usage.",
    tone: "gold" as const,
  },
  {
    label: "AI Logs Needing Review",
    value: "9 events",
    detail: "Admin oversight protects compliance, moderation, and traceability.",
    tone: "coral" as const,
  },
  {
    label: "Community Partners",
    value: "3 PIBG pilots",
    detail: "School and community partnerships layer on top of the tutor operating system.",
    tone: "teal" as const,
  },
];

export const rolePermissions: Array<{
  role: RoleName;
  permissions: string[];
}> = [
  {
    role: "Tutor",
    permissions: [
      "Create and manage classes",
      "Approve AI-generated lesson suggestions",
      "Assign homework",
      "Review student performance",
      "Send reports to parents",
    ],
  },
  {
    role: "Student",
    permissions: [
      "Join tutor-led classes",
      "Complete assigned homework",
      "Use AI Study Assistant only inside tutor-approved subjects or topics",
      "Cannot unlock independent AI learning plans without tutor linkage",
    ],
  },
  {
    role: "Parent",
    permissions: [
      "View child progress",
      "View attendance",
      "View tutor comments",
      "Receive AI-drafted but tutor-approved reports",
    ],
  },
  {
    role: "Admin",
    permissions: [
      "Manage users, tutors, classes, payments, partnerships, and referrals",
      "Monitor AI usage logs and tutor approval workflows",
      "Review operational risk and platform-level compliance events",
    ],
  },
];

export const approvalStatuses: Array<{
  status: ApprovalStatus;
  description: string;
}> = [
  {
    status: "draft",
    description: "Created by AI and waiting for tutor review before it can affect teaching or communication.",
  },
  {
    status: "tutor_reviewed",
    description: "Seen and adjusted by the tutor but not yet approved for assignment or delivery.",
  },
  {
    status: "approved",
    description: "Approved by the tutor and ready for student or parent use.",
  },
  {
    status: "assigned",
    description: "Released to the target student, class, or parent after tutor approval.",
  },
  {
    status: "archived",
    description: "Retained for traceability and version history but no longer active.",
  },
];

export const approvalObjects = [
  "lesson plans",
  "class summaries",
  "homework sets",
  "revision plans",
  "student reports",
  "parent messages",
];

export const aiActivityLogs = [
  {
    role: "Tutor",
    feature: "AI Teaching Copilot lesson draft",
    input: "Class weakness map",
    output: "Lesson objective draft",
    approval: "Required",
    approvedBy: "Teacher Farah",
  },
  {
    role: "Student",
    feature: "AI Study Assistant",
    input: "Tutor-approved topic request",
    output: "Revision hint",
    approval: "Within approved scope",
    approvedBy: "Study plan rules",
  },
  {
    role: "Admin",
    feature: "Moderation review",
    input: "Parent message draft",
    output: "Audit event",
    approval: "Tracked",
    approvedBy: "Compliance workflow",
  },
];

export const complianceGuardrails = [
  "AI cannot create or assign final teaching content to students without tutor review.",
  "AI cannot message parents directly without tutor approval.",
  "AI cannot advertise itself as a certified teacher or replacement for a tutor.",
  "AI-generated content must include internal traceability and moderation logging.",
  "Student AI interactions must be scoped by age, class, subject, and tutor-approved curriculum boundaries.",
];

export const businessModels = [
  "Tutor subscription plan",
  "Per-student active seat pricing",
  "Parent add-on reports and analytics",
  "School or PIBG partnership dashboard",
  "Referral engine for student acquisition",
];

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
];

export const schemaTables: SchemaTable[] = [
  {
    name: "classes",
    purpose: "Links every learning experience to a tutor, subject, schedule, and live teaching context.",
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
    purpose: "Stores AI-generated drafts and tutor-edited plans for each live class.",
    columns: [
      { name: "id", note: "Primary key" },
      { name: "class_id", note: "Associated tutor-led class" },
      { name: "tutor_id", note: "Tutor who reviews and owns the lesson" },
      { name: "title", note: "Lesson title" },
      { name: "objectives", note: "Structured lesson goals" },
      { name: "ai_draft", note: "Raw AI suggestion content" },
      { name: "tutor_edited_content", note: "Tutor-approved version" },
      { name: "approval_status", note: "draft, tutor_reviewed, approved, assigned, archived" },
      { name: "created_at", note: "Draft creation timestamp" },
      { name: "approved_at", note: "Tutor approval timestamp" },
    ],
  },
  {
    name: "student_mastery",
    purpose: "Tracks progress by student, subject, and topic while preserving tutor oversight.",
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
    purpose: "Stores homework that AI can draft but tutors must approve before assignment.",
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
    purpose: "Delivers parent transparency while enforcing tutor review on all communications.",
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
    purpose: "Provides traceability for every AI action and approval requirement.",
    columns: [
      { name: "id", note: "Primary key" },
      { name: "user_id", note: "Actor who triggered the event" },
      { name: "role", note: "Tutor, student, parent, or admin" },
      { name: "feature_used", note: "AI Teaching Copilot, AI Study Assistant, moderation, etc." },
      { name: "input_type", note: "Weakness map, prompt, attendance event, or report data" },
      { name: "output_type", note: "Lesson draft, revision hint, parent report draft, and so on" },
      { name: "approval_required", note: "Whether tutor or admin approval is needed" },
      { name: "approved_by", note: "Approver identity or policy scope" },
      { name: "created_at", note: "Event timestamp" },
    ],
  },
];
