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
      description="Parents can create an account first, then book a class or connect to a child profile once onboarding begins."
      eyebrow="Register"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Best for</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Parents starting the tuition journey
          </h2>
          <div className="mt-8 space-y-4">
            {[
              "Create your account once, then track progress and reports in one place.",
              "Book a class after registration and connect to the student profile during onboarding.",
              "Students and tutors usually join through invitation or class assignment.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5 text-sm leading-7 text-muted"
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
