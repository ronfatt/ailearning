import Link from "next/link";

import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";

const boundaries = [
  "SOLACE offers emotional support and guided reflection.",
  "It is not emergency care.",
  "It is not diagnosis.",
  "It is not medication advice.",
  "It does not replace licensed medical or psychiatric treatment.",
  "High-risk language triggers a different safety flow.",
];

const responses = [
  "The normal conversational flow is interrupted.",
  "The user is reminded that SOLACE is not emergency care.",
  "Clearer crisis and emergency pathways are surfaced.",
  "The platform encourages more urgent action where needed.",
];

export default function SafetyPage() {
  return (
    <SolacePageShell
      eyebrow="Safety"
      title="Support with boundaries, not false reassurance."
      description="SOLACE is designed to feel emotionally intelligent and calming while staying honest about what it can and cannot do."
      aside={
        <div className="rounded-[1.8rem] border border-[rgba(183,154,102,0.22)] bg-[linear-gradient(180deg,#fffaf2_0%,#f7f0e3_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-accent)]">
            Critical note
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--solace-ink)]">
            SOLACE is not built for emergencies. If someone may be in immediate danger, emergency or crisis support should be contacted right away.
          </p>
        </div>
      }
    >
      <SectionShell
        title="What SOLACE is, and what it is not"
        description="Clarity builds trust. The platform supports emotional check-ins, reflection, and calmer decision-making, but it does not present itself as a substitute for urgent or licensed care."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {boundaries.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] px-5 py-4 text-sm font-medium leading-7 text-[var(--solace-ink)]"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        title="What happens when risk appears higher"
        description="When language suggests elevated risk, the product shifts away from its normal support behavior."
        inverted
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {responses.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-white/12 bg-white/8 px-5 py-4 text-sm font-medium leading-7 text-white/86"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionShell>

      <section className="rounded-[2rem] border border-[var(--solace-line)] bg-[rgba(255,252,247,0.7)] px-6 py-8 shadow-[0_18px_46px_rgba(21,53,47,0.05)] sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--solace-primary)]">
          Crisis resources
        </p>
        <h2 className="solace-serif mt-3 text-4xl leading-[1.04] text-[var(--solace-ink)]">
          Need immediate help?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--solace-ink-soft)]">
          If someone may be in immediate danger, contact local emergency services or a crisis hotline right away. SOLACE should not be used as the only response in a crisis.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/resources"
            className="solace-button-primary rounded-full px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            View crisis resources
          </Link>
          <Link
            href="/"
            className="solace-button-secondary rounded-full border border-[var(--solace-line)] bg-white/72 px-7 py-3.5 text-sm font-semibold text-[var(--solace-ink)] transition"
          >
            Back to homepage
          </Link>
        </div>
      </section>
    </SolacePageShell>
  );
}
