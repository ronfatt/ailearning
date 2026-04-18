import { redirect } from "next/navigation";

import { ActivateAccountForm } from "@/components/activate-account-form";
import { PageShell } from "@/components/page-shell";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";

export default async function ActivateAccountPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  return (
    <PageShell
      title="Activate your invited account"
      description="Set a password for the tutor, student, parent, or admin account that has already been created for you."
      eyebrow="Account Activation"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">When to use this</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            For invited users joining an existing class or workspace
          </h2>
          <div className="mt-8 space-y-4">
            {[
              "Students usually activate an account after a tutor or parent has already started onboarding.",
              "Tutors can activate their workspace after approval.",
              "Parents who already have an invited account can activate it here instead of registering again.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5 text-sm leading-7 text-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <ActivateAccountForm />
      </section>
    </PageShell>
  );
}
