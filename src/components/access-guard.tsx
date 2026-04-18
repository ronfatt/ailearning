import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import type { AppRole, WorkspaceRole } from "@/lib/auth-session";

type AccessGuardProps = {
  allowedRoles: WorkspaceRole[];
  currentRole: AppRole;
  currentUserName: string;
  title: string;
};

export function AccessGuard({
  allowedRoles,
  currentRole,
  currentUserName,
  title,
}: AccessGuardProps) {
  return (
    <PageShell
      title={`${title} Access Restricted`}
      description="This workspace is available only to the account type that owns it, so student, parent, tutor, and admin data stay separated."
      action={
        <div className="rounded-[1.5rem] bg-gold-soft px-5 py-4 text-sm font-semibold text-[#8b5a13]">
          Current access: {currentUserName} · {currentRole}
        </div>
      }
      eyebrow="Role-Based Access"
    >
      <section className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm leading-8 text-muted">
          Allowed roles for this page: {allowedRoles.join(", ")}.
        </p>
        <p className="mt-4 text-sm leading-8 text-muted">
          Sign in with the correct account to open this workspace.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c]"
          >
            Sign in
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
