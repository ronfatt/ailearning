import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  const resolvedSearchParams = await searchParams;
  const tokenParam = resolvedSearchParams.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  return (
    <PageShell
      title="Reset your password"
      description="Use the secure reset link from your email to choose a new password."
      eyebrow="Password Reset"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2.2rem] p-8 shadow-[0_24px_60px_rgba(13,92,82,0.07)]">
          <p className="text-sm font-medium text-muted">Secure access</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Create a new password and continue
          </h2>
          <div className="mt-8 space-y-4">
            {[
              "Reset links expire after 1 hour.",
              "Once used, the old sessions are signed out automatically.",
              "If your link expires, request a fresh reset.",
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

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="rounded-[2.2rem] border border-border bg-white/82 p-8 shadow-[0_24px_60px_rgba(13,92,82,0.08)]">
            <p className="text-sm font-medium text-coral">Invalid reset link</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              This password reset link is missing information
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Request a new password reset link and try again.
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-flex rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(13,92,82,0.18)] transition hover:-translate-y-0.5 hover:bg-[#09443c]"
            >
              Request reset link
            </Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}
