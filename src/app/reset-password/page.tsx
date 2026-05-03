import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/reset-password-form";
import { SolaceLandingHeader } from "@/components/solace/landing-header";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";
import { createPageMetadata } from "@/lib/site-metadata";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Reset Password",
  description:
    "Use your secure reset link to choose a new password and return to your tuition workspace.",
  path: "/reset-password",
});

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_18%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.16),transparent_20%),linear-gradient(180deg,#f7fbff_0%,#eef5ff_42%,#ffffff_100%)]">
      <SolaceLandingHeader />
      <main className="px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-[560px] items-center justify-center">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="w-full rounded-[2.2rem] border border-[#e6ecf5] bg-white/94 p-8 shadow-[0_24px_60px_rgba(59,108,255,0.1)]">
              <p className="text-sm font-medium text-[#FF6B6B]">Invalid reset link</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">
                This password reset link is missing information
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5B6472]">
                Request a new password reset link and try again.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-flex rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Request reset link
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
