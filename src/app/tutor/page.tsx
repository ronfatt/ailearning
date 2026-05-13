import Link from "next/link";
import { AccessGuard } from "@/components/access-guard";
import { PageShell } from "@/components/page-shell";
import { RoleAssistantChatbox } from "@/components/role-assistant-chatbox";
import { TutorDashboardLive } from "@/components/tutor-dashboard-live";
import { WorkspaceHeroVisual } from "@/components/workspace-hero-visual";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function TutorPage() {
  const session = await getCurrentSession();
  if (session.user.role === "Guest") {
    redirect("/login");
  }

  const tutorDashboardId = session.user.id ?? "";
  const tutorDashboardName = session.user.name;
  const quickStartSteps = [
    {
      label: "Step 1",
      title: "Run the live class",
      detail:
        "See who needs attention first, open the room, and teach from one screen.",
      href: "#live-workspace",
      cta: "Go to Live Class",
    },
    {
      label: "Step 2",
      title: "Clear the approval queue",
      detail:
        "Review lesson drafts, homework, and parent updates that are blocking the next step.",
      href: "#approval-center",
      cta: "Open Approvals",
    },
    {
      label: "Step 3",
      title: "Close the loop after class",
      detail:
        "Handle follow-up students, mini revision tasks, and parent notes before you log off.",
      href: "#after-class-follow-up",
      cta: "Open Follow-Up",
    },
  ] as const;

  if (
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

  if (!session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  return (
    <PageShell
      title={`Hi ${tutorDashboardName}, here’s what needs your attention today`}
      description="Teach, review, and follow up in a clear order so nothing important gets buried under analytics."
      variant="workspace"
      workspaceRole="tutor"
      workspaceUserName={tutorDashboardName}
      workspaceTabs={["Today", "Live", "Reviews", "Approvals"]}
      workspaceSearchPlaceholder="Search classes, approvals, follow-up tasks, or student signals..."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#tutor-priority"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#4F46E5] shadow-[0_14px_32px_rgba(255,255,255,0.16)]"
          >
            Open Today&apos;s Priority
          </a>
          <a
            href="#live-workspace"
            className="rounded-full border border-white/24 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
          >
            Jump To Live Class
          </a>
        </div>
      }
      visual={<WorkspaceHeroVisual role="tutor" />}
      eyebrow="Tutor Daily Command"
      rightRail={
        <div className="space-y-6">
          <section className="rounded-[1.8rem] border border-[#e6ecf5] bg-white/92 p-5 shadow-[0_18px_46px_rgba(79,124,255,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7C5CFF]">
              Today in order
            </p>
            <div className="mt-4 space-y-3">
              {quickStartSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="overflow-hidden rounded-[1.4rem] border border-[#e4ddff] bg-white shadow-[0_12px_24px_rgba(124,92,255,0.05)]"
                >
                  <div className={`px-4 py-4 text-white ${
                    index === 0
                      ? "bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)]"
                      : index === 1
                        ? "bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)]"
                        : "bg-[linear-gradient(135deg,#FF9F1C_0%,#FB7185_100%)]"
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
                      className="mt-4 inline-flex rounded-full border border-[#ddd4ff] bg-[#faf8ff] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7C5CFF] transition hover:border-[#7C5CFF] hover:bg-[#f4efff]"
                    >
                      {step.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <RoleAssistantChatbox role="tutor" roleId={tutorDashboardId} />
        </div>
      }
    >
      <TutorDashboardLive tutorId={tutorDashboardId} />
    </PageShell>
  );
}
