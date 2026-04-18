import { PageShell } from "@/components/page-shell";
import { BookClassForm } from "@/components/book-class-form";

const steps = [
  "Share the student's level and subject.",
  "We match the right tutor and class path.",
  "Your family gets a simple next-step plan.",
];

export default function BookClassPage() {
  return (
    <PageShell
      title="Book a class"
      description="A quick way to get your child started with tutor-led support."
      eyebrow="Start Learning"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2.2rem] p-8 shadow-[0_24px_60px_rgba(13,92,82,0.07)]">
          <p className="text-sm font-medium text-muted">Simple steps</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            From enquiry to first class
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            No long forms, no confusing setup. Just tell us what support your child needs and we will guide the next step.
          </p>
          <div className="mt-8 space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.7rem] border border-border bg-surface-strong p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-base font-medium leading-7 text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </article>

        <BookClassForm />
      </section>
    </PageShell>
  );
}
