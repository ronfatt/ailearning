import { AccessGuard } from "@/components/access-guard";
import Link from "next/link";
import { RoleAssistantChatbox } from "@/components/role-assistant-chatbox";
import { WorkspaceHeroVisual } from "@/components/workspace-hero-visual";

import { PageShell } from "@/components/page-shell";
import { StudentDashboardLive } from "@/components/student-dashboard-live";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function StudentPage() {
  const session = await getCurrentSession();
  if (session.user.role === "Guest") {
    redirect("/login");
  }

  const studentDashboardId = session.user.id ?? "";
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
      variant="workspace"
      workspaceRole="student"
      workspaceUserName={session.user.name}
      workspaceTabs={["Overview", "Progress", "Homework", "History"]}
      workspaceSearchPlaceholder="Search homework, weak topics, class notes, or revision..."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/student/diagnostic"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold !text-[#2f5bff] shadow-[0_14px_32px_rgba(255,255,255,0.16)] transition hover:bg-[#f8fbff] hover:!text-[#2448d8]"
          >
            Open Readiness Check
          </Link>
          <a
            href="#assistant"
            className="rounded-full border border-white/24 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
          >
            Open AI Study Assistant
          </a>
        </div>
      }
      visual={<WorkspaceHeroVisual role="student" />}
      eyebrow="Student Revision Workspace"
      rightRail={
        <div className="space-y-6">
          <RoleAssistantChatbox role="student" roleId={studentDashboardId} />
          <section className="rounded-[1.8rem] border border-[#e6ecf5] bg-white/92 p-5 shadow-[0_18px_46px_rgba(79,124,255,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3B6CFF]">
              Quick actions
            </p>
            <div className="mt-4 space-y-3">
              {quickStartSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="overflow-hidden rounded-[1.4rem] border border-[#dbe7ff] bg-white shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                >
                  <div className={`px-4 py-4 text-white ${
                    index === 0
                      ? "bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)]"
                      : index === 1
                        ? "bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)]"
                        : "bg-[linear-gradient(135deg,#22C55E_0%,#12CFF3_100%)]"
                  }`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/82">
                      {step.label}
                    </p>
                    <h2 className="mt-2 text-sm font-semibold text-white">{step.title}</h2>
                  </div>
                  <div className="p-4">
                    <p className="text-sm leading-6 text-[#6B7280]">{step.detail}</p>
                    <Link
                      href={step.href}
                      className="mt-4 inline-flex rounded-full border border-[#d8e5ff] bg-[#f8fbff] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3B6CFF] transition hover:border-[#3B6CFF] hover:bg-[#eef4ff]"
                    >
                      {step.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      }
    >
      <StudentDashboardLive studentId={studentDashboardId} />
    </PageShell>
  );
}
