import { redirect } from "next/navigation";

import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { PageShell } from "@/components/page-shell";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";

export default async function ForgotPasswordPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  return (
    <PageShell
      title="Forgot your password?"
      description="Request a reset link and get back into your workspace."
      eyebrow="Password Help"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2.2rem] p-8 shadow-[0_24px_60px_rgba(13,92,82,0.07)]">
          <p className="text-sm font-medium text-muted">What happens next</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            One reset link, then you are back in
          </h2>
          <div className="mt-8 space-y-4">
            {[
              "Enter the email attached to your account.",
              "We send a secure reset link if the account exists.",
              "Choose a new password and continue back to your workspace.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.7rem] border border-border bg-surface-strong p-5 text-base font-medium leading-7 text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <ForgotPasswordForm />
      </section>
    </PageShell>
  );
}
