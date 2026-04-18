import { PageShell } from "@/components/page-shell";
import { BookClassForm } from "@/components/book-class-form";

const steps = [
  "Tell us the student level, subject, and preferred schedule.",
  "We match the student with the right tutor-led class or revision path.",
  "Student and parent workspaces are activated together for one smooth start.",
];

export default function BookClassPage() {
  return (
    <PageShell
      title="Book a class"
      description="A simple intake flow for parents who want a tutor-led learning plan without guesswork."
      eyebrow="Start Learning"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            From enquiry to first class, kept simple
          </h2>
          <div className="mt-8 space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">{step}</p>
              </div>
            ))}
          </div>
        </article>

        <BookClassForm />
      </section>
    </PageShell>
  );
}
