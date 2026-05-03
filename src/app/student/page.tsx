import { AccessGuard } from "@/components/access-guard";
import { DemoCasePlaybook } from "@/components/demo-case-playbook";
import Link from "next/link";
import { RoleAssistantChatbox } from "@/components/role-assistant-chatbox";
import { WorkspaceHeroVisual } from "@/components/workspace-hero-visual";

import { PageShell } from "@/components/page-shell";
import { StudentDashboardLive } from "@/components/student-dashboard-live";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function StudentPage() {
  const session = await getCurrentSession();
  const studentDashboardId = session.user.id ?? "student_aina_01";
  const isGuestPreview =
    process.env.NODE_ENV !== "production" && session.user.role === "Guest";
  const quickStartSteps = [
    {
      label: "First",
      title: "Finish the readiness check",
      detail:
        "Start with the short pre-class check so your tutor knows what needs extra help.",
      href: "/student/diagnostic",
      cta: "Start Check",
    },
    {
      label: "Then",
      title: "Complete assigned homework",
      detail:
        "Stay on top of tutor-approved work due this week before moving into extra revision.",
      href: "#assigned-homework",
      cta: "Open Homework",
    },
    {
      label: "After that",
      title: "Revise weak topics only",
      detail:
        "Use the AI Study Assistant only inside the topics your tutor has approved.",
      href: "#assistant",
      cta: "Open Assistant",
    },
  ] as const;

  if (
    !isGuestPreview &&
    !canAccessRole({
      currentRole: session.user.role,
      allowedRoles: ["Student"],
    })
  ) {
    return (
      <AccessGuard
        allowedRoles={["Student"]}
        currentRole={session.user.role}
        currentUserName={session.user.name}
        title="Student Dashboard"
      />
    );
  }

  if (!isGuestPreview && !session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  return (
    <PageShell
      title={
        isGuestPreview
          ? "Student Dashboard Preview"
          : `Welcome back, ${session.user.name}`
      }
      description={
        isGuestPreview
          ? "Local preview mode is active, so you can test homework, revision, and AI study assistant flows directly."
          : "See today’s tasks, finish assigned homework, and revise approved topics between tutor-led classes."
      }
      action={
        isGuestPreview ? (
          <div className="rounded-full border border-[#fde8bf] bg-[#fff8e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a6b16]">
            Preview mode · Student test workspace
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/student/diagnostic"
              className="rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c]"
            >
              Open Readiness Check
            </Link>
            <a
              href="#assistant"
              className="rounded-full border border-border bg-surface-strong px-5 py-3 text-sm font-semibold text-foreground transition hover:border-teal hover:text-teal"
            >
              Open AI Study Assistant
            </a>
          </div>
        )
      }
      visual={<WorkspaceHeroVisual role="student" />}
      eyebrow="Student Revision Workspace"
    >
      <RoleAssistantChatbox role="student" roleId={studentDashboardId} />

      <StudentDashboardLive studentId={studentDashboardId} />

      <section className="grid gap-3 lg:grid-cols-3">
        {quickStartSteps.map((step) => (
          <article
            key={step.title}
            className="rounded-[1.5rem] border border-border bg-white/72 p-4 shadow-[0_10px_26px_rgba(59,108,255,0.06)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3B6CFF]">
              {step.label}
            </p>
            <h2 className="mt-2 text-base font-semibold text-foreground">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{step.detail}</p>
            <Link
              href={step.href}
              className="mt-4 inline-flex rounded-full border border-[#d8e5ff] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3B6CFF] transition hover:border-[#3B6CFF] hover:bg-[#eef4ff]"
            >
              {step.cta}
            </Link>
          </article>
        ))}
      </section>

      {isGuestPreview ? <DemoCasePlaybook role="student" /> : null}
    </PageShell>
  );
}
