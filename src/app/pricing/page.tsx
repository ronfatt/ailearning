import Link from "next/link";

import { PricingCard } from "@/components/solace/pricing-card";
import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";

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

export default function PricingPage() {
  return (
    <SolacePageShell
      eyebrow="Pricing"
      title="Tuition plans with clearer scope and fewer surprises."
      description="Start with revision support or move into live tutor-led classes depending on how much structure your child needs."
      aside={
        <div className="rounded-[1.8rem] border border-[rgba(183,154,102,0.22)] bg-[linear-gradient(180deg,#fffaf2_0%,#f7f0e3_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-accent)]">
            Pricing principle
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--solace-ink)]">
            Families should understand what they are paying for: class time,
            revision support, reporting, and the level of follow-up included.
          </p>
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

      <section className="rounded-[2rem] border border-[var(--solace-line)] bg-[rgba(255,252,247,0.7)] px-6 py-8 shadow-[0_18px_46px_rgba(21,53,47,0.05)] sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--solace-primary)]">
          Need help choosing?
        </p>
        <h2 className="solace-serif mt-3 text-4xl leading-[1.04] text-[var(--solace-ink)]">
          Start with the child’s level, then we guide the rest.
        </h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/book-class"
            className="solace-button-primary rounded-full px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Book a Class
          </Link>
          <Link
            href="/tutor-apply"
            className="solace-button-secondary rounded-full border border-[var(--solace-line)] bg-white/72 px-7 py-3.5 text-sm font-semibold text-[var(--solace-ink)] transition"
          >
            Apply as a Tutor
          </Link>
        </div>
      </section>
    </SolacePageShell>
  );
}
