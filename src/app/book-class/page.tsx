import { BookClassForm } from "@/components/book-class-form";
import { SolacePageShell } from "@/components/solace/page-shell";

const steps = [
  "Share the student's level and subject.",
  "We match the right tutor and class path.",
  "Your family gets a simple next-step plan.",
];

export default function BookClassPage() {
  return (
    <SolacePageShell
      title="Book a class"
      description="A simple starting point for matching the right tutor, subject, and class path for your child."
      eyebrow="Start Learning"
      aside={
        <div className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe4_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
            What happens next
          </p>
          <div className="mt-5 space-y-3">
            {[
              "We review the student level and subject focus.",
              "We match the right tutor and class path.",
              "We guide the first class setup and learning cycle.",
            ].map((item) => (
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
      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="solace-panel rounded-[2rem] p-6 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--solace-primary)]">
            From enquiry to first class
          </p>
          <h2 className="solace-serif mt-3 text-4xl leading-[1.04] text-[var(--solace-ink)]">
            Start the learning journey without a complicated intake
          </h2>
          <div className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.4rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--solace-primary)]">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--solace-ink-soft)]">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </article>

        <BookClassForm />
      </section>
    </SolacePageShell>
  );
}
