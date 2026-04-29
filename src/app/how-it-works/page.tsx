import Link from "next/link";

import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";

const steps = [
  {
    step: "01",
    title: "Book a class",
    detail:
      "A parent shares the student level, subject focus, and preferred time so the intake can begin clearly.",
  },
  {
    step: "02",
    title: "Match the right tutor path",
    detail:
      "Admin and tutor workflows help assign the right class, create enrollment, and prepare the first lesson cycle.",
  },
  {
    step: "03",
    title: "Learn with tutor-led live classes",
    detail:
      "Students join real classes led by tutors, supported by readiness checks, class tools, and clearer follow-up.",
  },
  {
    step: "04",
    title: "Revise and track progress",
    detail:
      "Homework, revision tasks, and parent updates stay linked to the class, so progress does not disappear after the lesson.",
  },
];

const supportPrinciples = [
  "Human tutors remain the primary educators",
  "Student AI support stays inside tutor-approved scope",
  "Parent reporting stays clear and tutor-reviewed",
];

export default function HowItWorksPage() {
  return (
    <SolacePageShell
      eyebrow="How it works"
      title="A simpler path from enquiry to steady learning."
      description="The public journey is designed to stay easy for families while the platform handles the heavier operational work behind the scenes."
      aside={
        <div className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe4_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
            Core rules
          </p>
          <div className="mt-5 space-y-3">
            {supportPrinciples.map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-[var(--solace-line)] bg-white/78 px-4 py-3 text-sm font-medium leading-7 text-[var(--solace-ink)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <SectionShell
        title="What the first learning cycle looks like"
        description="Families should understand the process in minutes, not need a product walkthrough to figure it out."
      >
        <div className="grid gap-4 lg:grid-cols-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-[1.7rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
                {item.step}
              </p>
              <p className="mt-4 text-2xl font-semibold text-[var(--solace-ink)]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--solace-ink-soft)]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="What students experience"
        title="Clear classes, guided revision, and visible next steps"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Before class: a short readiness check helps the tutor see what needs attention.",
            "During class: the tutor teaches live while using AI support tools behind the scenes.",
            "After class: homework and revision appear in the student workspace with approved scope.",
            "At home: parents can see what happened, what improved, and what comes next.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.6rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-5 text-sm font-medium leading-7 text-[var(--solace-ink)]"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionShell>

      <section className="rounded-[2rem] border border-[rgba(23,63,58,0.1)] bg-[linear-gradient(135deg,#173f3a_0%,#214a43_50%,#355e56_100%)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(21,53,47,0.16)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#dbe6e1]">
              Begin
            </p>
            <h2 className="solace-serif text-4xl leading-[1.04] sm:text-5xl">
              Start with one clear next step.
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/book-class"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--solace-primary)] transition hover:bg-[#f1ece2]"
            >
              Book a Class
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/18 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Create Family Account
            </Link>
          </div>
        </div>
      </section>
    </SolacePageShell>
  );
}
