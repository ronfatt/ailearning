import Link from "next/link";
import { AccessGuard } from "@/components/access-guard";
import { DemoCasePlaybook } from "@/components/demo-case-playbook";
import { PageShell } from "@/components/page-shell";
import { RoleAssistantChatbox } from "@/components/role-assistant-chatbox";
import { TutorDashboardLive } from "@/components/tutor-dashboard-live";
import { WorkspaceHeroVisual } from "@/components/workspace-hero-visual";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { platformSummary } from "@/lib/mvp-data";
import { redirect } from "next/navigation";

export default async function TutorPage() {
  const session = await getCurrentSession();
  const tutorDashboardId = session.user.id ?? "tutor_farrah_01";
  const isGuestPreview =
    process.env.NODE_ENV !== "production" && session.user.role === "Guest";
  const tutorDashboardName =
    session.isAuthenticated ? session.user.name : "Tutor workspace";
  const quickStartSteps = [
    {
      label: "Start here",
      title: "Open the live class workspace",
      detail:
        "See who needs attention first, open the room, and run the class from one screen.",
      href: "#live-workspace",
      cta: "Go to Live Class",
    },
    {
      label: "Next",
      title: "Clear today’s approval queue",
      detail:
        "Review lesson drafts, homework, and parent updates that are blocking follow-up.",
      href: "#approval-center",
      cta: "Open Approvals",
    },
    {
      label: "Finish strong",
      title: "Close the loop after class",
      detail:
        "Handle follow-up students, mini revision tasks, and parent notes before you log off.",
      href: "#after-class-follow-up",
      cta: "Open Follow-Up",
    },
  ] as const;

  if (
    !isGuestPreview &&
    !canAccessRole({
      currentRole: session.user.role,
      allowedRoles: ["Tutor"],
    })
  ) {
    return (
      <AccessGuard
        allowedRoles={["Tutor"]}
        currentRole={session.user.role}
        currentUserName={session.user.name}
        title="Tutor Dashboard"
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
          ? "Tutor Dashboard Preview"
          : `Tutor Dashboard for ${tutorDashboardName}`
      }
      description={
        isGuestPreview
          ? "Local preview mode is active, so you can test live class tools, approvals, and follow-up workflows directly."
          : "Plan lessons, run live classes, approve follow-up, and keep parents informed from one workspace."
      }
      action={
        isGuestPreview ? (
          <div className="rounded-full border border-[#fde8bf] bg-[#fff8e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a6b16]">
            Preview mode · Tutor test workspace
          </div>
        ) : (
          <div className="rounded-[1.5rem] bg-teal px-5 py-4 text-sm font-semibold text-white">
            Next class: {platformSummary.className} at 8:00 PM
          </div>
        )
      }
      visual={<WorkspaceHeroVisual role="tutor" />}
    >
      <RoleAssistantChatbox role="tutor" roleId={tutorDashboardId} />

      <TutorDashboardLive tutorId={tutorDashboardId} />

      <section className="grid gap-3 lg:grid-cols-3">
        {quickStartSteps.map((step) => (
          <article
            key={step.title}
            className="rounded-[1.5rem] border border-border bg-white/72 p-4 shadow-[0_10px_26px_rgba(59,108,255,0.06)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]">
              {step.label}
            </p>
            <h2 className="mt-2 text-base font-semibold text-foreground">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{step.detail}</p>
            <Link
              href={step.href}
              className="mt-4 inline-flex rounded-full border border-[#ddd4ff] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7C5CFF] transition hover:border-[#7C5CFF] hover:bg-[#f4efff]"
            >
              {step.cta}
            </Link>
          </article>
        ))}
      </section>

      {isGuestPreview ? <DemoCasePlaybook role="tutor" /> : null}
    </PageShell>
  );
}
