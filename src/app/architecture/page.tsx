import { PageShell } from "@/components/page-shell";
import { StatusPill } from "@/components/status-pill";
import {
  approvalObjects,
  approvalStatuses,
  businessModels,
  complianceGuardrails,
  roadmapPhases,
  rolePermissions,
  schemaTables,
} from "@/lib/mvp-data";

export default function ArchitecturePage() {
  return (
    <PageShell
      title="Platform Architecture and Governance"
      description="This page captures the system logic behind the UI: permissions, approval workflow, schema design, compliance guardrails, business model, and roadmap."
      action={
        <div className="rounded-[1.5rem] bg-teal px-5 py-4 text-sm font-semibold text-white">
          Teacher-led by default
        </div>
      }
      eyebrow="Architecture Blueprint"
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Role Permissions</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Clean role-based access control
          </h2>
          <div className="mt-8 space-y-4">
            {rolePermissions.map((role) => (
              <article
                key={role.role}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
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
          <p className="text-sm font-medium text-muted">Approval Workflow</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Required states for AI-generated educational content
          </h2>
          <div className="mt-8 space-y-4">
            {approvalStatuses.map((statusItem) => (
              <article
                key={statusItem.status}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-foreground">
                    {statusItem.status}
                  </p>
                  <StatusPill status={statusItem.status} />
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {statusItem.description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {approvalObjects.map((item) => (
              <div
                key={item}
                className="rounded-full border border-border bg-white/75 px-4 py-2 text-sm text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Database Schema</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Teacher-led AI workflow tables
        </h2>
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {schemaTables.map((table) => (
            <article
              key={table.name}
              className="rounded-[1.75rem] border border-border bg-surface-strong p-6"
            >
              <p className="text-lg font-semibold text-foreground">{table.name}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{table.purpose}</p>
              <div className="mt-5 space-y-2">
                {table.columns.map((column) => (
                  <div
                    key={`${table.name}-${column.name}`}
                    className="flex flex-col gap-1 rounded-2xl bg-white/75 p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <code className="text-sm font-semibold text-foreground">
                      {column.name}
                    </code>
                    <p className="text-sm leading-7 text-muted sm:max-w-[70%]">
                      {column.note}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] bg-[#103b35] p-8 text-white">
          <p className="text-sm font-medium text-white/70">Compliance</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Guardrails that protect the model
          </h2>
          <div className="mt-8 space-y-4">
            {complianceGuardrails.map((rule) => (
              <p key={rule} className="rounded-[1.5rem] border border-white/15 bg-white/8 p-5 text-sm leading-7 text-white/90">
                {rule}
              </p>
            ))}
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Business Model</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            B2B2C structure centered on tutors
          </h2>
          <div className="mt-8 space-y-4">
            {businessModels.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5 text-sm font-medium leading-7 text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Roadmap</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Product phases that scale without losing tutor control
        </h2>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {roadmapPhases.map((phase) => (
            <article
              key={phase.phase}
              className="rounded-[1.75rem] border border-border bg-surface-strong p-6"
            >
              <p className="text-lg font-semibold text-foreground">{phase.phase}</p>
              <div className="mt-4 space-y-2">
                {phase.items.map((item) => (
                  <p key={item} className="text-sm leading-7 text-muted">
                    {item}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
