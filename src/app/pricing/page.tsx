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
      title="Simple tuition plans for revision, live classes, and follow-up."
      description="Start with AI revision support or move into tutor-led classes with homework, reports, and clearer weekly structure."
      heroPanelClassName="border-[#e6ecf5] bg-[radial-gradient(circle_at_20%_12%,rgba(18,207,243,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(124,92,255,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_28px_80px_rgba(59,108,255,0.1)]"
      aside={
        <div className="space-y-4">
          <div className="rounded-[1.8rem] border border-[#e6ecf5] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] p-6 shadow-[0_18px_40px_rgba(59,108,255,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3B6CFF]">
              Pricing principle
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniStat label="Start light" value="AI revision only" tone="blue" />
              <MiniStat label="Most chosen" value="Tutor-led class" tone="purple" />
              <MiniStat label="For families" value="Clear weekly follow-up" tone="mint" />
              <MiniStat label="For centres" value="Structured growth" tone="yellow" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <GlowBadge label="No vague plans" tone="blue" />
              <GlowBadge label="Teacher-led" tone="mint" />
            </div>
          </div>
          <AudienceSceneGrid />
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
            className="rounded-full border border-[#dbe7ff] bg-white px-7 py-3.5 text-sm font-semibold text-[#111827] transition hover:border-[#7C5CFF] hover:text-[#3B6CFF]"
          >
            Apply as a Tutor
          </Link>
        </div>
      </section>
    </SolacePageShell>
  );
}
