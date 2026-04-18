import { AdminIntakePanel } from "@/components/admin-intake-panel";
import { AccessGuard } from "@/components/access-guard";
import { MetricCard } from "@/components/metric-card";
import { PageShell } from "@/components/page-shell";
import { StatusPill } from "@/components/status-pill";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { getAdminConsoleData, formatIntakeStatus } from "@/lib/server/admin-console";
import { getSupabaseIntegrationStatus } from "@/lib/supabase/config";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (
    !canAccessRole({
      currentRole: session.user.role,
      allowedRoles: ["Admin"],
    })
  ) {
    return (
      <AccessGuard
        allowedRoles={["Admin"]}
        currentRole={session.user.role}
        currentUserName={session.user.name}
        title="Admin Oversight Console"
      />
    );
  }

  if (!session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  const adminData = await getAdminConsoleData();
  const supabaseStatus = getSupabaseIntegrationStatus();

  return (
    <PageShell
      title="Admin Oversight Console"
      description="Admin keeps the system compliant and scalable by monitoring tutors, classes, payments, partnerships, referrals, AI logs, and approval workflows."
      action={
        <div className="rounded-[1.5rem] bg-gold-soft px-5 py-4 text-sm font-semibold text-[#8b5a13]">
          Internal access only
        </div>
      }
      eyebrow="Admin Control Layer"
    >
      {adminData.message ? (
        <section className="glass-panel rounded-[2rem] border border-border p-5 text-sm leading-7 text-muted">
          {adminData.message}
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {adminData.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Supabase Readiness</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Connection layer status
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
              <p className="text-sm font-medium text-muted">Database Runtime</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {supabaseStatus.usingSupabaseDatabase
                  ? supabaseStatus.usingPooledConnection
                    ? "Supabase pooled Postgres"
                    : "Supabase direct Postgres"
                  : "Local or custom Postgres"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
              <p className="text-sm font-medium text-muted">Public Client</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {supabaseStatus.publicClientReady
                  ? `Ready (${supabaseStatus.keyType} key)`
                  : "Not configured"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
              <p className="text-sm font-medium text-muted">Service Role</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {supabaseStatus.hasServiceRoleKey ? "Configured" : "Optional"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
              <p className="text-sm font-medium text-muted">Status</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {supabaseStatus.usingSupabaseDatabase
                  ? "Supabase database connected"
                  : "Supabase-ready shell"}
              </p>
            </div>
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] bg-[#103b35] p-8 text-white">
          <p className="text-sm font-medium text-white/70">Next Supabase Steps</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Safe rollout path
          </h2>
          <div className="mt-8 space-y-4">
            {[
              "Point DATABASE_URL to Supabase Postgres first.",
              "Run Prisma push and seed before touching auth.",
              "Use the new Supabase browser/server clients for storage, notifications, or future auth experiments.",
              "Only add service-role flows for trusted server-side jobs.",
            ].map((item) => (
              <p
                key={item}
                className="rounded-[1.5rem] border border-white/15 bg-white/8 p-5 text-sm leading-7 text-white/90"
              >
                {item}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Role Logic</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Strict role-based permissions
          </h2>
          <div className="mt-8 space-y-4">
            {adminData.rolePermissionsData.map((role) => (
              <article
                key={role.role}
                className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
              >
                <p className="text-lg font-semibold text-foreground">{role.role}</p>
                <div className="mt-4 space-y-2">
                  {role.permissions.map((permission) => (
                    <p key={permission} className="text-sm leading-7 text-muted">
                      {permission}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">AI Activity Logs</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Traceability and moderation logging
          </h2>
          <div className="mt-8 space-y-4">
            {adminData.aiLogs.map((log) => (
              <article
                key={`${log.role}-${log.feature}`}
                className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-foreground">{log.feature}</p>
                  <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                    {log.role}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                  <p>Input: {log.input}</p>
                  <p>Output: {log.output}</p>
                  <p>Approval: {log.approval}</p>
                  <p>Approved by: {log.approvedBy}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Approval Workflow</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Teaching outputs that still need attention
          </h2>
          <div className="mt-8 space-y-4">
            {adminData.approvalQueue.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No tutor approval items are waiting right now.
              </div>
            ) : (
              adminData.approvalQueue.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted">{item.owner}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Generated at {item.generatedAt}. Reviewed at {item.reviewedAt}.
                </p>
              </article>
              ))
            )}
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] bg-[#103b35] p-8 text-white">
          <p className="text-sm font-medium text-white/70">Compliance Guardrails</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Rules the platform must enforce
          </h2>
          <div className="mt-8 space-y-4">
            {adminData.complianceRules.map((rule) => (
              <p key={rule} className="rounded-[1.5rem] border border-white/15 bg-white/8 p-5 text-sm leading-7 text-white/90">
                {rule}
              </p>
            ))}
          </div>
        </article>
      </section>

      <AdminIntakePanel
        bookingRequests={adminData.bookingRequests.map((item) => ({
          ...item,
          status: formatIntakeStatus(item.status),
        }))}
        tutorApplications={adminData.tutorApplications.map((item) => ({
          ...item,
          status: formatIntakeStatus(item.status),
        }))}
        enrollmentDrafts={adminData.enrollmentDrafts}
        tutorOptions={adminData.tutorOptions}
        classOptions={adminData.classOptions}
        classRosters={adminData.classRosters}
      />
    </PageShell>
  );
}
