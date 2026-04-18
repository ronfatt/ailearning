import Link from "next/link";
import { AccessGuard } from "@/components/access-guard";
import { ParentDashboardLive } from "@/components/parent-dashboard-live";
import { PageShell } from "@/components/page-shell";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function ParentPage() {
  const session = await getCurrentSession();
  const parentDashboardId = session.user.id ?? "parent_aina_01";
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
      action={
        <div className="rounded-[1.5rem] bg-teal px-5 py-4 text-sm font-semibold text-white">
          Report delivery window: Sunday 7:30 PM
        </div>
      }
      eyebrow="Parent Transparency Layer"
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

      <ParentDashboardLive parentId={parentDashboardId} />
    </PageShell>
  );
}
