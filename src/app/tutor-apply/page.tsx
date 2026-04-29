import { SolacePageShell } from "@/components/solace/page-shell";
import { TutorApplyForm } from "@/components/tutor-apply-form";

const requirements = [
  "Clear subject ownership and teaching level",
  "Comfort with live online tuition and follow-up workflows",
  "Willingness to review AI drafts before anything reaches students or parents",
];

export default function TutorApplyPage() {
  return (
    <SolacePageShell
      title="Apply as a tutor"
      description="Bring your teaching online with AI support that helps you prepare faster, teach better, and follow up more personally."
      eyebrow="Tutor Onboarding"
      aside={
        <div className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe4_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
            We look for
          </p>
          <div className="mt-5 space-y-3">
            {requirements.map((item) => (
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
            Teacher-led from day one
          </p>
          <h2 className="solace-serif mt-3 text-4xl leading-[1.04] text-[var(--solace-ink)]">
            Teach live, use AI well, and keep follow-up stronger
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--solace-ink-soft)]">
            We are building for tutors who want better class preparation, clearer
            student follow-up, and more visible parent communication without
            losing the human side of teaching.
          </p>
        </article>

        <TutorApplyForm />
      </section>
    </SolacePageShell>
  );
}
