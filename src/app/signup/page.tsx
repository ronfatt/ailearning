import Link from "next/link";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/sign-up-form";
import { SolacePageShell } from "@/components/solace/page-shell";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";

export default async function SignUpPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  return (
    <SolacePageShell
      title="Create your family account"
      description="Register once to book classes, follow progress, and manage your child’s learning journey in one place."
      eyebrow="Register"
      aside={
        <div className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe4_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
            Best for parents
          </p>
          <div className="mt-5 space-y-3">
            {[
              "Start with one account for bookings, reports, and class updates.",
              "Connect the student profile during onboarding or after class matching.",
              "Use one place to track progress instead of scattered messages.",
            ].map((item) => (
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
            Start with one family account, then connect the learning path
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--solace-ink-soft)]">
            Registration is simple on purpose. Once the account is ready, you can
            book a class, connect the student profile, and receive tutor-approved
            updates in one place.
          </p>
          <p className="mt-6 text-sm leading-7 text-[var(--solace-ink-soft)]">
            Already invited?{" "}
            <Link
              href="/activate-account"
              className="font-semibold text-[var(--solace-primary)]"
            >
              Activate your account
            </Link>
          </p>
        </article>

        <SignUpForm />
      </section>
    </SolacePageShell>
  );
}
