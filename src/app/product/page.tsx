import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { StatusPill } from "@/components/status-pill";
import {
  approvalObjects,
  businessModels,
  complianceGuardrails,
  lessonSuggestions,
  platformSummary,
  preDuringPostFlow,
} from "@/lib/mvp-data";

export default function ProductPage() {
  return (
    <div className="page-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 lg:px-10 lg:py-10">
        <section className="glass-panel fade-up overflow-hidden rounded-[2.5rem] p-8 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-7">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal">
                How the system works
              </p>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  AI Teaching System Architecture for
                  <span className="text-teal"> teacher-led tuition.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                  Human tutors remain the educators. The AI Teaching Copilot works before class, during class, and after class, while the AI Study Assistant stays scoped to tutor-approved learning flows.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c]"
                >
                  Back to Homepage
                </Link>
                <Link
                  href="#operational-core"
                  className="rounded-full border border-border bg-surface-strong px-6 py-3 text-sm font-semibold text-foreground transition hover:border-teal hover:text-teal"
                >
                  View Operational Core
                </Link>
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] border-white/40 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">System rule</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    Tutor-led by design
                  </p>
                </div>
                <div className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                  Compliance-first
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {lessonSuggestions.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.5rem] border border-border bg-white/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <StatusPill status={item.status} />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {preDuringPostFlow.map((phase) => (
            <article key={phase.phase} className="glass-panel rounded-[2rem] p-6">
              <div className="rounded-full bg-teal-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal">
                {phase.phase}
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-foreground">
                {phase.title}
              </h2>
              <div className="mt-5 space-y-3">
                {phase.tasks.map((task) => (
                  <p key={task} className="text-sm leading-7 text-muted">
                    {task}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section
          id="operational-core"
          className="grid gap-8 rounded-[2.5rem] bg-[#103b35] px-8 py-10 text-white sm:px-10 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <SectionHeading
            eyebrow="Operational Core"
            title="The main differentiator is the Tutor Dashboard."
            description="This product should feel like a tuition operating system that helps tutors plan better, teach live with support, and approve what students and parents see."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Today's classes",
              "Weak topic heatmap by class",
              "Student readiness indicator",
              "AI lesson suggestion panel",
              "One-click warm-up quiz generation",
              "Assignment approval queue",
              "Parent report draft queue",
              "Student risk alerts",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/15 bg-white/8 p-5 text-sm font-medium leading-7 text-white/90"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          id="approval-workflow"
          className="grid gap-8 lg:grid-cols-[1fr_0.9fr]"
        >
          <div className="glass-panel rounded-[2rem] p-8">
            <SectionHeading
              eyebrow="Approval Workflow"
              title="AI drafts fast. Tutors approve deliberately."
              description="Every teaching-related output passes through a clear workflow so the platform stays teacher-led, compliant, and scalable."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {approvalObjects.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {complianceGuardrails.map((rule) => (
              <article
                key={rule}
                className="rounded-[1.75rem] border border-border bg-surface-strong p-6"
              >
                <p className="text-sm leading-7 text-muted">{rule}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          {businessModels.map((item) => (
            <article key={item} className="glass-panel rounded-[1.75rem] p-6">
              <p className="text-sm font-medium leading-7 text-foreground">{item}</p>
            </article>
          ))}
        </section>

        <section className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Platform Positioning</p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            {platformSummary.positioning}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
            The product is not a fully autonomous AI teaching platform, not a generic ChatGPT wrapper, and not an unsupervised student classroom. It is a tutor productivity and learning follow-up system with strong parent transparency and structured AI assistance.
          </p>
        </section>
      </main>
    </div>
  );
}
