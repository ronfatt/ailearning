import Link from "next/link";

import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";

const resourceGroups = [
  {
    title: "SPM study guides",
    detail:
      "Short resources that help students review core topics, exam structure, and revision habits between classes.",
  },
  {
    title: "Parent guides",
    detail:
      "Simple guides for understanding weak topics, reading progress reports, and supporting study routines at home.",
  },
  {
    title: "Revision habits",
    detail:
      "Practical advice for building a steadier weekly learning rhythm instead of last-minute cramming.",
  },
  {
    title: "Tutor insights",
    detail:
      "Teaching and follow-up ideas for tutors running live online classes with AI-supported workflows.",
  },
];

export default function ResourcesPage() {
  return (
    <SolacePageShell
      eyebrow="Resources"
      title="Learning resources for students, parents, and tutors."
      description="A calmer content layer for revision tips, parent guidance, and practical learning support around the live tuition experience."
      aside={
        <div className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe4_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
            Good to know
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--solace-ink)]">
            Resources should support class performance and study habits, not overwhelm families with too much theory.
          </p>
        </div>
      }
    >
      <SectionShell
        title="A resource layer that supports real learning"
        description="This section should help families use the platform better and help students stay more consistent between classes."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {resourceGroups.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.7rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-6"
            >
              <p className="text-2xl font-semibold text-[var(--solace-ink)]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--solace-ink-soft)]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <section className="rounded-[2rem] border border-[rgba(23,63,58,0.1)] bg-[linear-gradient(135deg,#173f3a_0%,#214a43_50%,#355e56_100%)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(21,53,47,0.16)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#dbe6e1]">
              Ready to begin
            </p>
            <h2 className="solace-serif text-4xl leading-[1.04] sm:text-5xl">
              Turn learning plans into weekly progress.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/76">
              Book a class, register your family account, and use the platform to
              keep lessons, revision, and follow-up connected.
            </p>
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
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </SolacePageShell>
  );
}
