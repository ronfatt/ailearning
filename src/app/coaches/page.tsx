import Link from "next/link";

import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";

const coachSupports = [
  {
    title: "Supportive conversations",
    detail:
      "For users who want more structure, accountability, or a steadier human touch alongside digital support.",
  },
  {
    title: "Between-session continuity",
    detail:
      "SOLACE can hold reflections and check-ins between sessions, so support feels more continuous instead of fragmented.",
  },
  {
    title: "Respectful escalation",
    detail:
      "Human support pathways become especially important when someone needs more care than self-guided support can offer.",
  },
];

const coachProfiles = [
  "Trauma-informed communication",
  "Support for stress, overwhelm, and burnout",
  "Reflective practice between therapy or coaching",
];

export default function CoachesPage() {
  return (
    <SolacePageShell
      eyebrow="Coaches"
      title="Human care remains part of the path."
      description="SOLACE is not positioned as AI-only. The platform includes clear pathways into human support when conversation, context, or accountability matter more."
      aside={
        <div className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe4_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
            Human support
          </p>
          <div className="mt-5 space-y-3">
            {coachProfiles.map((item) => (
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
        title="Coach support that feels premium, warm, and credible"
        description="The human layer is presented with calm professionalism, not exaggerated claims or salesy pressure."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {coachSupports.map((item) => (
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
              Human support pathway
            </p>
            <h2 className="solace-serif text-4xl leading-[1.04] sm:text-5xl">
              Want a more human support rhythm?
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/76">
              Start with the platform, then move into coach-supported care when the moment calls for more structure and presence.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--solace-primary)] transition hover:bg-[#f1ece2]"
            >
              View plans
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/18 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Start with care
            </Link>
          </div>
        </div>
      </section>
    </SolacePageShell>
  );
}
