import { redirect } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { WelcomeOnboardingForm } from "@/components/welcome-onboarding-form";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";

export default async function WelcomePage() {
  const session = await getCurrentSession();

  if (!session.isAuthenticated || session.user.role === "Guest") {
    redirect("/login");
  }

  if (session.user.onboardingCompleted) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  return (
    <PageShell
      title="Welcome to your workspace"
      description="Before you start, we’ll tailor the workspace so the first experience feels simple, focused, and relevant to your role."
      eyebrow="First-Time Setup"
    >
      <WelcomeOnboardingForm
        role={session.user.role}
        name={session.user.name}
        email={session.user.email}
      />
    </PageShell>
  );
}
