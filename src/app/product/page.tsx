import Link from "next/link";

import { FeatureSpotlight } from "@/components/solace/feature-spotlight";
import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";

const studentBenefits = [
  "Join tutor-led classes with a clearer weekly structure",
  "Use AI revision only inside approved topics and study plans",
  "See homework, weak topics, and next steps in one student workspace",
];

const tutorBenefits = [
  "Review readiness before class and teach with better context",
  "Use AI drafts for warm-ups, quizzes, and follow-up without giving up control",
  "Handle homework, study plans, and parent updates from one dashboard",
];

const parentBenefits = [
  "See enrolled classes, tutor feedback, and weekly progress in one place",
  "Track what was taught, what still needs support, and what happens next",
  "Book more support without restarting the whole process",
];

export default function ProductPage() {
  return (
    <SolacePageShell
      eyebrow="Product"
      title="A tuition platform built around real teaching, not just content."
      description="AI Learning OS helps tutors teach better, helps students revise more personally, and helps parents see progress more clearly."
      aside={
        <div className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe4_100%)] p-6 shadow-[0_18px_40px_rgba(21,53,47,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
            Product principle
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--solace-ink)]">
            Human tutors lead every learning cycle. AI speeds up planning, revision,
            and follow-up, but it does not replace the teacher.
          </p>
        </div>
      }
    >
      <SectionShell
        title="For students, tutors, and parents"
        description="The platform is strongest when these three sides stay connected instead of living in separate tools."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { title: "For students", items: studentBenefits },
            { title: "For tutors", items: tutorBenefits },
            { title: "For parents", items: parentBenefits },
          ].map((group) => (
            <div
              key={group.title}
              className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-6"
            >
              <p className="text-2xl font-semibold text-[var(--solace-ink)]">
                {group.title}
              </p>
              <div className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.2rem] border border-[var(--solace-line)] bg-white/78 px-4 py-3 text-sm leading-7 text-[var(--solace-ink-soft)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <FeatureSpotlight
        eyebrow="Pre-class"
        title="Know what needs attention before the lesson starts"
        description="Readiness checks, weak-topic signals, and lesson suggestions help tutors walk into class with a sharper plan."
        bullets={[
          "AI suggests warm-up questions and lesson objectives",
          "Tutors approve all educational materials before students see them",
          "Students who need extra support are surfaced clearly",
        ]}
        visual={
          <div className="solace-gradient-card rounded-[1.9rem] border border-[var(--solace-line)] p-5">
            <div className="rounded-[1.6rem] bg-[var(--solace-primary)] p-6 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                Pre-class signals
              </p>
              <div className="mt-5 space-y-3">
                {["Weak topic heatmap", "Readiness summary", "Warm-up draft"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white/10 px-4 py-4 text-sm font-medium"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        }
      />

      <FeatureSpotlight
        eyebrow="During class"
        title="Keep class delivery human, but make support faster"
        description="Tutors stay in charge during live lessons while the platform supports them with quick teaching tools and participation cues."
        bullets={[
          "Quick quiz generation for live teaching moments",
          "Concept explanation drafts to reduce prep friction",
          "Participation signals and follow-up prompts after class",
        ]}
        reverse
        visual={
          <div className="solace-gradient-card rounded-[1.9rem] border border-[var(--solace-line)] p-5">
            <div className="rounded-[1.6rem] border border-[var(--solace-line)] bg-white p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--solace-primary)]">
                Tutor tools
              </p>
              <div className="mt-5 grid gap-3">
                {["Quick quiz", "Class poll", "Explanation draft", "Focus alerts"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-[1.2rem] bg-[var(--solace-fog)] px-4 py-4 text-sm font-medium text-[var(--solace-ink)]"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        }
      />

      <FeatureSpotlight
        eyebrow="Post-class"
        title="Turn every lesson into a clearer revision loop"
        description="Homework, revision tasks, study plans, and parent reports all stay connected to the class that just happened."
        bullets={[
          "AI drafts homework and revision after tutor-led sessions",
          "Study plan approval controls what AI revision can unlock",
          "Parent reports remain tutor-reviewed before delivery",
        ]}
        visual={
          <div className="solace-gradient-card rounded-[1.9rem] border border-[var(--solace-line)] p-5">
            <div className="rounded-[1.6rem] border border-[rgba(183,154,102,0.22)] bg-[linear-gradient(180deg,#fffaf2_0%,#f6efe1_100%)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--solace-accent)]">
                Follow-up
              </p>
              <div className="mt-5 space-y-3">
                {["Homework drafts", "Revision plan queue", "Parent report drafts"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-[1.2rem] border border-[rgba(183,154,102,0.18)] bg-white/82 px-4 py-4 text-sm font-medium text-[var(--solace-ink)]"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        }
      />

      <section className="rounded-[2.2rem] border border-[rgba(23,63,58,0.1)] bg-[linear-gradient(135deg,#173f3a_0%,#214a43_50%,#355e56_100%)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(21,53,47,0.16)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#dbe6e1]">
              Start learning
            </p>
            <h2 className="solace-serif text-4xl leading-[1.04] sm:text-5xl">
              Start with a class, then keep the follow-up strong.
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/book-class"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--solace-primary)] transition hover:bg-[#f1ece2]"
            >
              Book a Class
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-full border border-white/18 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </SolacePageShell>
  );
}
