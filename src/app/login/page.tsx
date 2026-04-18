import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { SignInForm } from "@/components/sign-in-form";
import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";

const roleCards = [
  {
    title: "Tutors",
    detail: "Manage classes, approve AI drafts, and guide every live session from one workspace.",
  },
  {
    title: "Students",
    detail: "Join tutor-led classes, complete assigned homework, and revise approved weak topics.",
  },
  {
    title: "Parents",
    detail: "See attendance, tutor comments, homework feedback, and progress updates clearly.",
  },
  {
    title: "Admins",
    detail: "Monitor classes, usage logs, approval workflows, and platform operations.",
  },
] as const;

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getAuthenticatedHomePath(session.user));
  }

  return (
    <PageShell
      title="Sign in to your workspace"
      description="Use your invited account email to open the correct tutor, student, parent, or admin workspace."
      eyebrow="Secure Access"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Who this is for</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            One platform, four clear workspaces
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {roleCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
              >
                <p className="text-lg font-semibold text-foreground">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[1.75rem] bg-[#103b35] p-6 text-white">
            <p className="text-sm font-medium text-white/70">Need access first?</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#12342f] transition hover:bg-[#e7fff2]"
              >
                Create Parent Account
              </Link>
              <Link
                href="/book-class"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Book a Class
              </Link>
              <Link
                href="/tutor-apply"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Apply as Tutor
              </Link>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Already invited but not activated yet? Use{" "}
              <Link href="/activate-account" className="font-semibold text-[#b5ffda]">
                Activate Account
              </Link>
              .
            </p>
          </div>
        </article>

        <SignInForm />
      </section>
    </PageShell>
  );
}
