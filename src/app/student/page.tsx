import { AccessGuard } from "@/components/access-guard";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { StudentDashboardLive } from "@/components/student-dashboard-live";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function StudentPage() {
  const session = await getCurrentSession();
  const studentDashboardId = session.user.id ?? "student_aina_01";
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

  if (!session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  return (
    <PageShell
      title={`Welcome back, ${session.user.name}`}
      description="See today’s tasks, finish assigned homework, and revise approved topics between tutor-led classes."
      action={
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
      }
      eyebrow="Student Revision Workspace"
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {quickStartSteps.map((step) => (
          <article key={step.title} className="glass-panel rounded-[1.75rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              {step.label}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-foreground">
              {step.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">{step.detail}</p>
            <Link
              href={step.href}
              className="mt-5 inline-flex rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#09443c]"
            >
              {step.cta}
            </Link>
          </article>
        ))}
      </section>

      <StudentDashboardLive studentId={studentDashboardId} />
    </PageShell>
  );
}
