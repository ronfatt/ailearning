export const demoCase = {
  name: "Aina Sofia learning cycle",
  className: "Form 5 Algebra Sprint",
  subject: "SPM Mathematics",
  focus: "Turning word problems into equations with more confidence",
  journey: [
    {
      id: "admin-intake",
      step: 1,
      role: "admin",
      title: "Admin sets up the learning journey",
      summary:
        "Start from intake, enrolment, class placement, and workload visibility.",
      href: "/admin",
    },
    {
      id: "tutor-class",
      step: 2,
      role: "tutor",
      title: "Tutor teaches and reviews what needs follow-up",
      summary:
        "Check the live class workspace, student growth panel, and homework review queue.",
      href: "/tutor",
    },
    {
      id: "student-work",
      step: 3,
      role: "student",
      title: "Student completes homework and tracks progress",
      summary:
        "Open homework, review feedback, redo work, and check the progress chart.",
      href: "/student",
    },
    {
      id: "parent-visibility",
      step: 4,
      role: "parent",
      title: "Parent sees the same learning cycle clearly",
      summary:
        "Review the child progress snapshot, chart, tutor feedback, and learning history.",
      href: "/parent",
    },
  ],
  student: {
    name: "Aina Sofia",
    dashboardLabel: "Student demo",
    goal: "Complete tutor-approved homework, review weak topics, and resubmit after feedback.",
    whatToCheck: [
      "Open assigned homework and see the tutor-linked tasks.",
      "Submit answers, review tutor comments, then try Redo homework.",
      "Use the AI Study Assistant only inside approved topics.",
    ],
    href: "/student",
    loginHint: "aina@ailearningos.demo",
  },
  parent: {
    name: "Nur Aina",
    dashboardLabel: "Parent demo",
    goal: "Track weekly progress, homework feedback, and the next learning focus without chasing the tutor.",
    whatToCheck: [
      "Open the weekly summary and latest tutor note.",
      "See the homework feedback and revision history for the same student.",
      "Check enrolled class, attendance, and next support steps.",
    ],
    href: "/parent",
    loginHint: "parent.aina@ailearningos.demo",
  },
  tutor: {
    name: "Teacher Farah",
    dashboardLabel: "Tutor demo",
    goal: "Run class, review submissions, assign follow-up, and close the parent communication loop faster.",
    whatToCheck: [
      "Open the live class workspace and spot which student needs support first.",
      "Review homework submissions and leave per-question feedback.",
      "Clear approval items and after-class follow-up in one pass.",
    ],
    href: "/tutor",
    loginHint: "farah@ailearningos.demo",
  },
  admin: {
    name: "Admin operations",
    dashboardLabel: "Admin demo",
    goal: "Follow the same family from booking request into enrollment, class setup, and platform oversight.",
    whatToCheck: [
      "Open the parent intake queue and find the Aina Sofia booking request.",
      "Review enrollment drafts, assigned class placement, and approval items tied to the same learning cycle.",
      "Use the queue to understand what operations sees before student, parent, and tutor dashboards update.",
    ],
    href: "/admin",
    loginHint: "admin@ailearningos.demo",
  },
  passwordHint: "Password123!",
} as const;

export type DemoRole = keyof Pick<
  typeof demoCase,
  "student" | "parent" | "tutor" | "admin"
>;
