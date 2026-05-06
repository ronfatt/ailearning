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
      title="Parent Progress Portal"
      description="Track attendance, tutor comments, homework follow-up, and approved progress updates in one place."
      variant="workspace"
      workspaceRole="parent"
      workspaceUserName={session.user.name}
      workspaceTabs={["Overview", "Reports", "Progress", "Homework"]}
      workspaceSearchPlaceholder="Search weekly reports, attendance, tutor notes, or next class..."
      action={
        <div className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#15926b] shadow-[0_14px_32px_rgba(255,255,255,0.16)]">
          Report delivery window: Sunday 7:30 PM
        </div>
      }
      visual={<WorkspaceHeroVisual role="parent" />}
      eyebrow="Parent Transparency Layer"
      rightRail={
        <div className="space-y-6">
          <RoleAssistantChatbox role="parent" roleId={parentDashboardId} />
          <section className="rounded-[1.8rem] border border-[#e6ecf5] bg-white/92 p-5 shadow-[0_18px_46px_rgba(79,124,255,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#20C997]">
              Quick actions
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
        </div>
      }
    >
      <ParentDashboardLive parentId={parentDashboardId} />
    </PageShell>
  );
}
