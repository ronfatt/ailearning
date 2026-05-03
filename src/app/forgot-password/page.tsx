import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { SolaceLandingHeader } from "@/components/solace/landing-header";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Forgot Password",
  description:
    "Request a secure reset link and get back into your AI Learning OS workspace quickly.",
  path: "/forgot-password",
});

export default async function ForgotPasswordPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_18%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.16),transparent_20%),linear-gradient(180deg,#f7fbff_0%,#eef5ff_42%,#ffffff_100%)]">
      <SolaceLandingHeader />
      <main className="px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-[560px] items-center justify-center">
          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  );
}
