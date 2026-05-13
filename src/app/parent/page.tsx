import Link from "next/link";
import { AccessGuard } from "@/components/access-guard";
import { ParentDashboardLive } from "@/components/parent-dashboard-live";
import { PageShell } from "@/components/page-shell";
import { RoleAssistantChatbox } from "@/components/role-assistant-chatbox";
import { WorkspaceHeroVisual } from "@/components/workspace-hero-visual";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function ParentPage() {
  const session = await getCurrentSession();
  if (session.user.role === "Guest") {
    redirect("/login");
  }

  const parentDashboardId = session.user.id ?? "";
  const quickStartSteps = [
    {
      label: "Step 1",
      title: "Read this week’s summary",
      detail:
        "Start with the latest tutor-approved summary so you know how this learning cycle is going.",
      href: "#weekly-summary",
      cta: "Open Summary",
    },
    {
      label: "Step 2",
      title: "Check homework feedback",
      detail:
        "See what improved, what still needs support, and what the tutor noticed.",
      href: "#homework-feedback",
      cta: "View Feedback",
    },
    {
      label: "Step 3",
      title: "Decide the next support step",
      detail:
        "If more support is needed, book the next class without guessing what to do.",
      href: "/book-class",
      cta: "Book a Class",
    },
  ] as const;

  if (
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

  if (!session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  return (
    <PageShell
      title="See your child’s progress clearly"
      description="Start with this week’s summary, check feedback, and know exactly what support is needed next."
      variant="workspace"
      workspaceRole="parent"
      workspaceUserName={session.user.name}
      workspaceTabs={["This Week", "Reports", "Progress", "Homework"]}
      workspaceSearchPlaceholder="Search weekly reports, attendance, tutor notes, or next class..."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#parent-at-a-glance"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#15926b] shadow-[0_14px_32px_rgba(255,255,255,0.16)]"
          >
            Open This Week
          </a>
          <a
            href="#weekly-summary"
            className="rounded-full border border-white/24 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
          >
            Read Summary
          </a>
        </div>
      }
      visual={<WorkspaceHeroVisual role="parent" />}
      eyebrow="Parent Weekly View"
      rightRail={
        <div className="space-y-6">
          <section className="rounded-[1.8rem] border border-[#e6ecf5] bg-white/92 p-5 shadow-[0_18px_46px_rgba(79,124,255,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#20C997]">
              This week in order
            </p>
            <div className="mt-4 space-y-3">
              {quickStartSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="overflow-hidden rounded-[1.4rem] border border-[#d8efe8] bg-white shadow-[0_12px_24px_rgba(32,201,151,0.05)]"
                >
                  <div className={`px-4 py-4 text-white ${
                    index === 0
                      ? "bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)]"
                      : index === 1
                        ? "bg-[linear-gradient(135deg,#3B6CFF_0%,#20C997_100%)]"
                        : "bg-[linear-gradient(135deg,#F59E0B_0%,#FB7185_100%)]"
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
                      className="mt-4 inline-flex rounded-full border border-[#cfeee4] bg-[#f9fffc] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#20C997] transition hover:border-[#20C997] hover:bg-[#ecfdf5]"
                    >
                      {step.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <RoleAssistantChatbox role="parent" roleId={parentDashboardId} />
        </div>
      }
    >
      <ParentDashboardLive parentId={parentDashboardId} />
    </PageShell>
  );
}
