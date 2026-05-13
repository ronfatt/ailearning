import { AdminIntakePanel } from "@/components/admin-intake-panel";
import { AccessGuard } from "@/components/access-guard";
import { MetricCard } from "@/components/metric-card";
import { PageShell } from "@/components/page-shell";
import { StatusPill } from "@/components/status-pill";
import { WorkspaceHeroVisual } from "@/components/workspace-hero-visual";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { getAdminConsoleData, formatIntakeStatus } from "@/lib/server/admin-console";
import { getSupabaseIntegrationStatus } from "@/lib/supabase/config";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (session.user.role === "Guest") {
    redirect("/login");
  }

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
  const intakeItemsToTriage =
    adminData.bookingRequests.length +
    adminData.tutorApplications.length +
    adminData.contactEnquiries.length +
    adminData.enrollmentDrafts.length;
  const topHotspot = adminData.curriculumHotspots[0];
  const topClass = adminData.classHealth[0];
  const todayPriorityCards = [
    {
      id: "intake",
      label: "Step 1",
      title: "Triage intake first",
      detail:
        intakeItemsToTriage > 0
          ? `${intakeItemsToTriage} request${intakeItemsToTriage === 1 ? "" : "s"} need routing across bookings, tutor applications, contacts, and enrollment drafts.`
          : "No fresh intake is waiting, so you can move straight to workflow checks.",
      href: "#intake-panel",
      cta: "Open Intake",
    },
    {
      id: "approvals",
      label: "Step 2",
      title: "Clear workflow blockers",
      detail:
        adminData.approvalQueue.length > 0
          ? `${adminData.approvalQueue.length} teaching output${adminData.approvalQueue.length === 1 ? "" : "s"} still need admin visibility or follow-through.`
          : "No approval blockers are waiting right now, which keeps tutor flow clean.",
      href: "#approval-workflow",
      cta: "Open Approvals",
    },
    {
      id: "hotspots",
      label: "Step 3",
      title: "Watch learning drag",
      detail: topHotspot
        ? `${topHotspot.topic} is the current heat point in ${topHotspot.className}.`
        : "No curriculum hotspot is spiking yet, so you can stay focused on intake and delivery.",
      href: "#curriculum-hotspots",
      cta: "Open Hotspots",
    },
  ] as const;

  return (
    <PageShell
      title="Here’s what needs admin attention today"
      description="Triage intake, remove blockers, and watch learning risk in a clean order instead of hunting through every ops panel."
      variant="workspace"
      workspaceRole="admin"
      workspaceUserName={session.user.name}
      workspaceTabs={["Today", "Intake", "Hotspots", "Approvals"]}
      workspaceSearchPlaceholder="Search intake, classes, hotspot topics, approvals, or compliance signals..."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#admin-priority"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0F766E] shadow-[0_14px_32px_rgba(255,255,255,0.16)]"
          >
            Open Today&apos;s Priority
          </a>
          <a
            href="#approval-workflow"
            className="rounded-full border border-white/24 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
          >
            Jump To Approvals
          </a>
        </div>
      }
      visual={<WorkspaceHeroVisual role="admin" />}
      eyebrow="Admin Daily Command"
      rightRail={
        <section className="rounded-[1.8rem] border border-[#d9efe9] bg-white/92 p-5 shadow-[0_18px_46px_rgba(15,118,110,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0F766E]">
            Today in order
          </p>
          <div className="mt-4 space-y-3">
            {todayPriorityCards.map((step, index) => (
              <article
                key={step.id}
                className="overflow-hidden rounded-[1.4rem] border border-[#d7ece8] bg-white shadow-[0_12px_24px_rgba(15,118,110,0.05)]"
              >
                <div
                  className={`px-4 py-4 text-white ${
                    index === 0
                      ? "bg-[linear-gradient(135deg,#0F766E_0%,#14B8A6_100%)]"
                      : index === 1
                        ? "bg-[linear-gradient(135deg,#14B8A6_0%,#3B82F6_100%)]"
                        : "bg-[linear-gradient(135deg,#3B82F6_0%,#7C5CFF_100%)]"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/82">
                    {step.label}
                  </p>
                  <h2 className="mt-2 text-sm font-semibold text-white">{step.title}</h2>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-6 text-[#6B7280]">{step.detail}</p>
                  <a
                    href={step.href}
                    className="mt-4 inline-flex rounded-full border border-[#cfe7e3] bg-[#f5fbfa] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F766E] transition hover:border-[#0F766E] hover:bg-[#edf9f7]"
                  >
                    {step.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-[1.4rem] border border-[#d7ece8] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbfa_100%)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7B8597]">
              Internal only
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Use this view to unblock operations quickly before diving into deeper analytics.
            </p>
          </div>
        </section>
      }
    >
      {adminData.message ? (
        <section className="glass-panel rounded-[2rem] border border-border p-5 text-sm leading-7 text-muted">
          {adminData.message}
        </section>
      ) : null}

      <section
        id="admin-priority"
        className="glass-panel rounded-[2rem] p-8"
      >
        <p className="text-sm font-medium text-muted">Today&apos;s priority</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Start with intake, remove blockers second, then watch where learning is dragging
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <article className="rounded-[1.75rem] border border-border bg-white/85 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                Active classes
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {adminData.classHealth.length}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                {topClass
                  ? `${topClass.title} is one of the current live classes to monitor.`
                  : "Class coverage will show here once active class delivery is running."}
              </p>
            </article>
            <article className="rounded-[1.75rem] border border-border bg-white/85 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                Platform status
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {supabaseStatus.usingSupabaseDatabase
                  ? "Database connected"
                  : "Supabase-ready shell"}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Keep ops flow stable before pushing deeper platform changes.
              </p>
            </article>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {todayPriorityCards.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.75rem] border border-[#d7ece8] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbfa_100%)] p-5 shadow-[0_12px_24px_rgba(15,118,110,0.05)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F766E]">
                  {item.label}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.detail}</p>
                <a
                  href={item.href}
                  className="mt-4 inline-flex rounded-full border border-[#cfe7e3] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F766E] transition hover:border-[#0F766E] hover:bg-[#f5fbfa]"
                >
                  {item.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
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

      <section id="intake-funnel" className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Intake right now</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            What needs triage first
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {adminData.intakeFunnel.map((item) => {
              const tone =
                item.tone === "mint"
                  ? "from-[#20C997] to-[#12CFF3]"
                  : item.tone === "gold"
                    ? "from-[#FFD166] to-[#FF9F1C]"
                    : item.tone === "purple"
                      ? "from-[#7C5CFF] to-[#3B6CFF]"
                      : "from-[#3B6CFF] to-[#12CFF3]";

              return (
                <article
                  key={item.label}
                  className="rounded-[1.75rem] border border-border bg-white/85 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <span className="text-3xl font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#eef4ff]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${tone}`}
                      style={{ width: `${Math.min(100, Math.max(item.value * 18, 10))}%` }}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.note}</p>
                </article>
              );
            })}
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Tutor load today</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Who is carrying the current teaching load
          </h2>
          <div className="mt-8 space-y-4">
            {adminData.tutorWorkload.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                Tutor workload will appear once classes and student enrollments are active.
              </div>
            ) : (
              adminData.tutorWorkload.map((item) => (
                <article
                  key={item.tutorName}
                  className="rounded-[1.75rem] border border-border bg-white/85 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-foreground">
                      {item.tutorName}
                    </p>
                    <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2f5bff]">
                      {item.activeClasses} class{item.activeClasses === 1 ? "" : "es"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.note}</p>
                </article>
              ))
            )}
          </div>
        </article>
      </section>

      <section id="class-health" className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Class fill status</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Which classes are full, light, or still growing
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {adminData.classHealth.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted lg:col-span-3">
              Class occupancy will appear when active classes and enrollments are available.
            </div>
          ) : (
            adminData.classHealth.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.75rem] border border-border bg-white/85 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-foreground">{item.title}</p>
                  <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#0f9b74]">
                    {item.studentCount} student{item.studentCount === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted">{item.subjectName}</p>
                <p className="mt-2 text-sm text-muted">Tutor: {item.tutorName}</p>
                <p className="mt-2 text-sm text-muted">Schedule: {item.schedule}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section id="curriculum-hotspots" className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Learning drag to watch</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Which topics are creating the most learning drag
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {adminData.curriculumHotspots.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted lg:col-span-2 xl:col-span-3">
              Curriculum hotspots will appear once active students build enough mastery and readiness data.
            </div>
          ) : (
            adminData.curriculumHotspots.map((item) => (
              <article
                key={`${item.classId}-${item.topic}`}
                className="overflow-hidden rounded-[1.75rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
              >
                <div className="bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-5 py-4 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold text-white">{item.topic}</p>
                    <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                      {item.intensity} heat
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/78">
                    {item.className} · {item.subjectName}
                  </p>
                </div>
                <div className="p-5">
                  <div className="grid gap-3 text-sm text-muted sm:grid-cols-2">
                    <p>Avg mastery: {item.averageMastery}%</p>
                    <p>
                      Students affected: {item.affectedStudents}
                    </p>
                    <p>Readiness flags: {item.readinessFlags}</p>
                    <p>Topic focus: {item.topicName}</p>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#eef4ff]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#7C5CFF_0%,#3B6CFF_45%,#12CFF3_100%)]"
                      style={{ width: `${item.intensity}%` }}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.note}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">System readiness</p>
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
          <p className="text-sm font-medium text-white/70">Next rollout steps</p>
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
          <p className="text-sm font-medium text-muted">Permission guardrails</p>
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
          <p className="text-sm font-medium text-muted">AI activity logs</p>
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

      <section id="approval-workflow" className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Approval workflow</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Outputs that still need attention
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

      <section id="intake-panel">
        <AdminIntakePanel
          bookingRequests={adminData.bookingRequests.map((item) => ({
            ...item,
            status: formatIntakeStatus(item.status),
          }))}
          tutorApplications={adminData.tutorApplications.map((item) => ({
            ...item,
            status: formatIntakeStatus(item.status),
          }))}
          contactEnquiries={adminData.contactEnquiries.map((item) => ({
            ...item,
            status: formatIntakeStatus(item.status),
          }))}
          enrollmentDrafts={adminData.enrollmentDrafts}
          tutorOptions={adminData.tutorOptions}
          classOptions={adminData.classOptions}
          classRosters={adminData.classRosters}
        />
      </section>
    </PageShell>
  );
}
