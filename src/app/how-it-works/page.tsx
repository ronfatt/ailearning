import type { Metadata } from "next";
import Link from "next/link";

import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";
import { createPageMetadata } from "@/lib/site-metadata";

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

export const metadata: Metadata = createPageMetadata({
  title: "How It Works",
  description:
    "Understand the path from first enquiry to tutor-led classes, AI revision, homework follow-up, and parent progress updates.",
  path: "/how-it-works",
  keywords: [
    "how tuition platform works",
    "online tuition onboarding",
    "AI revision workflow",
  ],
});

export default function HowItWorksPage() {
  return (
    <SolacePageShell
      eyebrow="How it works"
      title="A simple path from first enquiry to steady progress."
      description="Families can move from booking to live classes, revision, homework, and parent reporting without getting lost in admin."
      heroPanelClassName="border-[#e6ecf5] bg-[radial-gradient(circle_at_18%_12%,rgba(18,207,243,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(124,92,255,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_28px_80px_rgba(59,108,255,0.1)]"
      aside={
        <div className="rounded-[1.8rem] border border-[#e6ecf5] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] p-6 shadow-[0_18px_40px_rgba(59,108,255,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3B6CFF]">
            Core rules
          </p>
          <div className="mt-5 space-y-3">
            {supportPrinciples.map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-[#dbe7ff] bg-white px-4 py-3 text-sm font-medium leading-7 text-[#111827]"
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
              className="rounded-[1.7rem] border border-[#e6ecf5] bg-white p-5 shadow-[0_14px_32px_rgba(59,108,255,0.06)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3B6CFF]">
                {item.step}
              </p>
              <p className="mt-4 text-2xl font-semibold text-[#111827]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#5B6472]">
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
              className="rounded-[1.6rem] border border-[#e6ecf5] bg-white p-5 text-sm font-medium leading-7 text-[#111827] shadow-[0_12px_30px_rgba(59,108,255,0.06)]"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionShell>

      <section className="rounded-[2rem] border border-[#d6e3ff] bg-[linear-gradient(135deg,#3B6CFF_0%,#4F7CFF_42%,#7C5CFF_78%,#12CFF3_100%)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(59,108,255,0.22)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/72">
              Begin
            </p>
            <h2 className="solace-serif text-4xl leading-[1.04] sm:text-5xl">
              Start with one clear next step.
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/book-class"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#3B6CFF] transition hover:bg-[#f8fbff]"
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
