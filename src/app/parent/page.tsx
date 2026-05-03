import Link from "next/link";
import { AccessGuard } from "@/components/access-guard";
import { DemoCasePlaybook } from "@/components/demo-case-playbook";
import { ParentDashboardLive } from "@/components/parent-dashboard-live";
import { PageShell } from "@/components/page-shell";
import { RoleAssistantChatbox } from "@/components/role-assistant-chatbox";
import { WorkspaceHeroVisual } from "@/components/workspace-hero-visual";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function ParentPage() {
  const session = await getCurrentSession();
  const parentDashboardId = session.user.id ?? "parent_aina_01";
  const isGuestPreview =
    process.env.NODE_ENV !== "production" && session.user.role === "Guest";
  const quickStartSteps = [
    {
      label: "Start here",
      title: "Read this week’s summary",
      detail:
        "Begin with the latest tutor-approved report so you understand the current learning cycle.",
      href: "#weekly-summary",
      cta: "Open Summary",
    },
    {
      label: "Then",
      title: "Check recent homework feedback",
      detail:
        "See where your child is improving and what still needs support in plain language.",
      href: "#homework-feedback",
      cta: "View Feedback",
    },
    {
      label: "Need help?",
      title: "Book the next class",
      detail:
        "If you want to add more support, start the next booking from here without guessing the process.",
      href: "/book-class",
      cta: "Book a Class",
    },
  ] as const;

  if (
    !isGuestPreview &&
    !canAccessRole({
      currentRole: session.user.role,
      allowedRoles: ["Parent"],
    })
  ) {
    return (
      <AccessGuard
        allowedRoles={["Parent"]}
        currentRole={session.user.role}
        currentUserName={session.user.name}
        title="Parent Progress Portal"
      />
    );
  }

  if (!isGuestPreview && !session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  return (
    <PageShell
      title={isGuestPreview ? "Parent Dashboard Preview" : "Parent Progress Portal"}
      description={
        isGuestPreview
          ? "Local preview mode is active, so you can review reports, attendance, and homework follow-up directly."
          : "Track attendance, tutor comments, homework follow-up, and approved progress updates in one place."
      }
      action={
        isGuestPreview ? (
          <div className="rounded-full border border-[#fde8bf] bg-[#fff8e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a6b16]">
            Preview mode · Parent test workspace
          </div>
        ) : (
          <div className="rounded-[1.5rem] bg-teal px-5 py-4 text-sm font-semibold text-white">
            Report delivery window: Sunday 7:30 PM
          </div>
        )
      }
      visual={<WorkspaceHeroVisual role="parent" />}
      eyebrow="Parent Transparency Layer"
    >
      <RoleAssistantChatbox role="parent" roleId={parentDashboardId} />

      <ParentDashboardLive parentId={parentDashboardId} />

      <section className="grid gap-3 lg:grid-cols-3">
        {quickStartSteps.map((step) => (
          <article
            key={step.title}
            className="rounded-[1.5rem] border border-border bg-white/72 p-4 shadow-[0_10px_26px_rgba(59,108,255,0.06)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20C997]">
              {step.label}
            </p>
            <h2 className="mt-2 text-base font-semibold text-foreground">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{step.detail}</p>
            <Link
              href={step.href}
              className="mt-4 inline-flex rounded-full border border-[#cfeee4] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#20C997] transition hover:border-[#20C997] hover:bg-[#ecfdf5]"
            >
              {step.cta}
            </Link>
          </article>
        ))}
      </section>

      {isGuestPreview ? <DemoCasePlaybook role="parent" /> : null}
    </PageShell>
  );
}
