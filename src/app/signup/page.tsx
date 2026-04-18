import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { SignUpForm } from "@/components/sign-up-form";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";

export default async function SignUpPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  return (
    <PageShell
      title="Create your account"
      description="Create your parent account first, then we will help you connect everything else."
      eyebrow="Register"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2.2rem] p-8 shadow-[0_24px_60px_rgba(13,92,82,0.07)]">
          <p className="text-sm font-medium text-muted">Best for parents</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Start with one account, then everything follows
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            Use one place to view reports, follow progress, and stay connected once your child starts class.
          </p>
          <div className="mt-8 space-y-4">
            {[
              "Track progress and reports in one place.",
              "Book a class after registration without re-entering everything.",
              "Connect the student profile during onboarding when your class starts.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.7rem] border border-border bg-surface-strong p-5 text-base font-medium leading-7 text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-muted">
            Already invited?{" "}
            <Link href="/activate-account" className="font-semibold text-teal">
              Activate your account
            </Link>
          </p>
        </article>

        <SignUpForm />
      </section>
    </PageShell>
  );
}
