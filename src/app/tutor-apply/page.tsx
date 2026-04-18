import { PageShell } from "@/components/page-shell";
import { TutorApplyForm } from "@/components/tutor-apply-form";

const requirements = [
  "Clear subject ownership and teaching level",
  "Comfort with live online tuition and follow-up workflows",
  "Willingness to review AI drafts before anything reaches students or parents",
];

export default function TutorApplyPage() {
  return (
    <PageShell
      title="Apply as a tutor"
      description="Bring your teaching online with AI support that helps you prepare faster, teach better, and follow up more personally."
      eyebrow="Tutor Onboarding"
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">What we look for</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Teacher-led from day one
          </h2>
          <div className="mt-8 space-y-4">
            {requirements.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5 text-sm leading-7 text-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <TutorApplyForm />
      </section>
    </PageShell>
  );
}
