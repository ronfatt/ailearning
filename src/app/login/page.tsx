import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/sign-in-form";
import { SolacePageShell } from "@/components/solace/page-shell";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";

const accessRoutes = [
  "Parents returning to reports, bookings, and class updates",
  "Students opening homework, revision, and approved study plans",
  "Tutors continuing lesson prep, live teaching, and follow-up",
  "Invited users activating a tutor, student, or admin workspace",
];

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  return (
    <SolacePageShell
      eyebrow="Secure access"
      title="Return to your learning workspace."
      description="Sign in to continue classes, homework, progress tracking, parent reporting, and tutor-led follow-up."
      aside={
        <div className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe4_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
            Access routes
          </p>
          <div className="mt-5 space-y-3">
            {accessRoutes.map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-[var(--solace-line)] bg-white/78 px-4 py-3 text-sm font-medium leading-7 text-[var(--solace-ink)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="solace-panel rounded-[2rem] p-6 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--solace-primary)]">
            Before you continue
          </p>
          <h2 className="solace-serif mt-3 text-4xl leading-[1.04] text-[var(--solace-ink)]">
            Teacher-led learning, with clear roles and private access
          </h2>
          <div className="mt-6 space-y-4">
            {[
              "Families, students, tutors, and admins each sign in to their own workspace.",
              "Student AI support stays limited to tutor-approved topics and study plans.",
              "Reports, homework, and revision are linked to live class activity.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] px-4 py-4 text-sm font-medium leading-7 text-[var(--solace-ink)]"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm leading-7 text-[var(--solace-ink-soft)]">
            <Link href="/signup" className="font-semibold text-[var(--solace-primary)]">
              Create family account
            </Link>
            <Link
              href="/activate-account"
              className="font-semibold text-[var(--solace-primary)]"
            >
              Activate invited account
            </Link>
            <Link
              href="/forgot-password"
              className="font-semibold text-[var(--solace-primary)]"
            >
              Forgot password
            </Link>
          </div>
        </article>

        <SignInForm />
      </section>
    </SolacePageShell>
  );
}
