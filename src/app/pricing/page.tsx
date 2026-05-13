import type { Metadata } from "next";
import Link from "next/link";

import {
  AudienceSceneGrid,
  HorizontalLearningStory,
} from "@/components/solace/learning-scenes";
import { PricingCard } from "@/components/solace/pricing-card";
import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";
import { GlowBadge, MiniStat } from "@/components/solace/youthful-ui";
import { createPageMetadata } from "@/lib/site-metadata";

const plans = [
  {
    name: "AI Revision",
    price: "From RM39/mo",
    description:
      "For tutor-approved revision practice, progress visibility, and structured follow-up between lessons.",
    features: [
      "AI Study Assistant within approved topics",
      "Revision tasks and homework tracking",
      "Progress updates in one student workspace",
      "Parent visibility into next steps",
    ],
  },
  {
    name: "Tutor-Led Class",
    price: "From RM129/mo",
    description:
      "For weekly online tuition with real teachers, readiness checks, and stronger post-class follow-up.",
    features: [
      "Live online classes with a real tutor",
      "Pre-class readiness check",
      "Tutor-assigned homework and revision",
      "Parent-friendly progress updates",
    ],
    highlight: true,
  },
  {
    name: "Tutor-Led + Reports",
    price: "Custom",
    description:
      "For families or learning groups that need deeper reporting, study plan support, and a more guided rhythm.",
    features: [
      "Everything in Tutor-Led Class",
      "Higher-touch study plan follow-up",
      "Deeper progress reporting",
      "Enrollment and scheduling support",
    ],
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Compare AI revision, tutor-led class, and deeper reporting plans for families and tuition operators on AI Learning OS.",
  path: "/pricing",
  keywords: [
    "tuition pricing Malaysia",
    "AI revision pricing",
    "tutor-led class plans",
  ],
});

export default function PricingPage() {
  return (
    <SolacePageShell
      eyebrow="Pricing"
      title="Plans built for tutor-led classes, clearer follow-up, and centre growth."
      description="Start with AI revision support or move into live tuition plans with homework, reports, and a more visible weekly progress rhythm."
      heroVariant="stage"
      heroColumnsClassName="lg:grid-cols-[0.6fr_0.4fr]"
      actions={
        <>
          <Link
            href="/book-class"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold !text-[#2f5bff] shadow-[0_14px_32px_rgba(255,255,255,0.16)] transition hover:bg-[#f8fbff] hover:!text-[#2448d8]"
          >
            Book a Class
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/24 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/18"
          >
            Ask About Plans
          </Link>
        </>
      }
      highlights={["AI revision", "Tutor-led classes", "Parent reports", "Centre ready"]}
      aside={
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/75 bg-white/96 p-6 shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FFD166]/40 blur-2xl" />
            <div className="absolute -bottom-10 left-6 h-32 w-32 rounded-full bg-[#7C5CFF]/20 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3B6CFF]">
                Pricing principle
              </p>
              <p className="mt-3 text-3xl font-semibold leading-tight text-[#111827]">
                Start small, upgrade when the child needs more guidance.
              </p>
            </div>
            <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
              <MiniStat label="Start light" value="AI revision only" tone="blue" />
              <MiniStat label="Most chosen" value="Tutor-led class" tone="purple" />
              <MiniStat label="For families" value="Clear weekly follow-up" tone="mint" />
              <MiniStat label="For centres" value="Structured growth" tone="yellow" />
            </div>
            <div className="relative mt-4 flex flex-wrap gap-2">
              <GlowBadge label="No vague plans" tone="blue" />
              <GlowBadge label="Teacher-led" tone="mint" />
              <GlowBadge label="Flexible path" tone="yellow" />
            </div>
          </div>
          <div className="hidden lg:block">
            <AudienceSceneGrid />
          </div>
        </div>
      }
    >
      <SectionShell
        title="Three ways to begin"
        description="The plans are designed around how much teacher-led support and structured follow-up your family needs."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              highlight={plan.highlight}
            />
          ))}
        </div>
      </SectionShell>

      <HorizontalLearningStory />

      <section className="rounded-[2rem] border border-[#e6ecf5] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] px-6 py-8 shadow-[0_18px_46px_rgba(59,108,255,0.08)] sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#3B6CFF]">
              Need help choosing?
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-tight text-[#111827]">
              Start with the child’s level, then we guide the rest.
            </h2>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/book-class"
                className="rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:-translate-y-0.5"
              >
                Book a Class
              </Link>
              <Link
                href="/tutor-apply"
                className="inline-flex items-center justify-center rounded-full border border-[#dbe7ff] bg-white px-7 py-3.5 text-sm font-semibold !text-[#111827] shadow-[0_10px_24px_rgba(59,108,255,0.08)] transition hover:border-[#7C5CFF] hover:!text-[#3B6CFF]"
              >
                Apply as a Tutor
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Tell us the level", "Pick class support", "Track weekly progress"].map(
              (item, index) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-[#dbe7ff] bg-white p-4 shadow-[0_14px_30px_rgba(59,108,255,0.08)]"
                >
                  <p className="text-4xl font-semibold text-[#3B6CFF]">
                    {index + 1}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#111827]">
                    {item}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </SolacePageShell>
  );
}
