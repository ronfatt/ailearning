import Link from "next/link";

import { FeatureSpotlight } from "@/components/solace/feature-spotlight";
import { SolaceHeroPreview } from "@/components/solace/hero-preview";
import { SolaceLandingHeader } from "@/components/solace/landing-header";
import { PricingCard } from "@/components/solace/pricing-card";
import { SectionShell } from "@/components/solace/section-shell";
import { SolaceSiteFooter } from "@/components/solace/site-footer";

const proofPoints = [
  "Tutor-led live classes",
  "AI-supported revision and follow-up",
  "Parent-visible progress and reports",
];

const useCases = [
  "Students who need clearer explanations and more structure after school",
  "Parents who want visible progress instead of vague tuition updates",
  "Families preparing for SPM with a steadier weekly learning rhythm",
  "Students who need guided revision between live classes",
  "Tutors who want faster prep, better follow-up, and cleaner reporting",
  "Learners who benefit from tutor-approved AI practice after class",
];

const outcomes = [
  "Every student starts from a tutor-approved class, subject, or study plan.",
  "Revision and homework are adapted after each lesson instead of staying static.",
  "Parents can see what was taught, what needs support, and what comes next.",
];

const features = [
  "Guided enrollment and class matching",
  "Tutor dashboard for planning and follow-up",
  "Live class support before, during, and after lessons",
  "AI study assistant limited to approved topics",
  "Homework, revision, and progress tracking",
  "Tutor-approved parent reports",
];

const testimonials = [
  {
    quote:
      "We finally had one place to see class updates, homework, and what my daughter still needed help with.",
    name: "Parent of Form 5 student",
  },
  {
    quote:
      "The tutor workflow feels much stronger than a normal tuition setup because the revision after class is already prepared.",
    name: "Online math tutor",
  },
  {
    quote:
      "It felt more structured than ordinary tuition because every class led into clear revision tasks and follow-up.",
    name: "SPM student",
  },
];

const pricing = [
  {
    name: "AI Revision",
    price: "From RM39/mo",
    description:
      "For students who need guided practice, revision tasks, and progress visibility between tutor-led sessions.",
    features: [
      "Tutor-approved revision scope",
      "AI Study Assistant in approved topics",
      "Homework and revision tracking",
      "Parent progress visibility",
    ],
  },
  {
    name: "Tutor-Led Class",
    price: "From RM129/mo",
    description:
      "For families who want weekly live online tuition with teacher-led instruction and structured follow-up.",
    features: [
      "Live online classes",
      "Readiness checks before class",
      "Tutor-assigned homework",
      "Weekly progress updates",
    ],
    highlight: true,
  },
  {
    name: "Tutor-Led + Reports",
    price: "Custom",
    description:
      "For families or small learning groups that want stronger reporting, revision support, and guided follow-up.",
    features: [
      "Everything in Tutor-Led Class",
      "Parent summary reports",
      "Deeper revision planning",
      "Higher-touch enrollment support",
    ],
  },
];

function ProofStrip() {
  return (
    <div className="flex flex-wrap gap-3">
      {proofPoints.map((item) => (
        <div
          key={item}
          className="rounded-full border border-[var(--solace-line)] bg-white/74 px-4 py-2 text-sm font-medium text-[var(--solace-ink)]"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function TrustMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-5">
      <p className="solace-serif text-4xl leading-none text-[var(--solace-ink)]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--solace-ink-soft)]">{label}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="solace-page solace-grid-lines min-h-screen">
      <SolaceLandingHeader />
      <main className="solace-shell flex flex-col gap-12 lg:gap-14">
        <section className="solace-panel fade-up overflow-hidden rounded-[2.2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[0.56fr_0.44fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-[var(--solace-line)] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--solace-primary)]">
                Malaysia online tuition
              </div>
              <h1 className="solace-serif max-w-4xl text-5xl leading-[0.93] text-[var(--solace-ink)] sm:text-6xl lg:text-[4.9rem]">
                Smarter tuition, led by real teachers.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--solace-ink-soft)]">
                Live online classes, tutor-approved AI revision, and parent-visible
                progress in one structured learning platform.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/book-class"
                  className="solace-button-primary rounded-full px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Book a Class
                </Link>
                <Link
                  href="/product"
                  className="solace-button-secondary rounded-full border border-[var(--solace-line)] bg-white/72 px-7 py-3.5 text-sm font-semibold text-[var(--solace-ink)] transition"
                >
                  Explore the Platform
                </Link>
              </div>
              <div className="space-y-4 pt-1">
                <ProofStrip />
                <p className="text-sm leading-7 text-[var(--solace-ink-soft)]">
                  Every student-facing AI flow is linked to a tutor, class, subject,
                  or tutor-approved study plan.
                </p>
              </div>
            </div>

            <SolaceHeroPreview />
          </div>
        </section>

        <SectionShell
          eyebrow="Why families choose this"
          title="Built for real tuition outcomes, not just content access"
          description="The platform keeps teaching human, uses AI where it helps most, and keeps parents in the loop without adding noise."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <TrustMetric
              value="Live"
              label="Real tutors lead every class and approve what students see after class."
            />
            <TrustMetric
              value="Clear"
              label="Homework, revision, and reports are connected so families know what happens next."
            />
            <TrustMetric
              value="Scoped"
              label="Student AI support stays inside approved topics instead of wandering into random learning paths."
            />
          </div>
        </SectionShell>

        <SectionShell
          eyebrow="Who it helps"
          title="What families and tutors come here for"
          description="This is designed for structured after-school learning, not passive video content or generic chat."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item}
                className="rounded-[1.6rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-5 text-sm font-medium leading-7 text-[var(--solace-ink)]"
              >
                {item}
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          eyebrow="What the platform includes"
          title="A calmer, more complete tuition system"
          description="Everything is organized around pre-class readiness, better teaching during class, and stronger follow-up after class."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((item) => (
              <div
                key={item}
                className="rounded-[1.6rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-5 text-sm font-medium leading-7 text-[var(--solace-ink)]"
              >
                {item}
              </div>
            ))}
          </div>
        </SectionShell>

        <FeatureSpotlight
          eyebrow="Before class"
          title="Tutors see readiness and weak topics before teaching begins"
          description="Short readiness checks and student mastery signals help tutors know who needs extra attention, what to warm up, and what to simplify before class starts."
          bullets={[
            "AI suggests lesson objectives and warm-up questions",
            "Tutors review and approve all teaching materials",
            "Weaker students are surfaced early instead of being missed in class",
          ]}
          visual={
            <div className="solace-gradient-card rounded-[1.9rem] border border-[var(--solace-line)] p-5">
              <div className="rounded-[1.6rem] bg-[var(--solace-primary)] p-6 text-white shadow-[0_18px_46px_rgba(23,63,58,0.22)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Pre-class
                </p>
                <p className="mt-3 text-3xl font-semibold">Readiness before the lesson</p>
                <div className="mt-6 grid gap-3">
                  {[
                    "Weak topic heatmap by class",
                    "Students needing extra attention",
                    "Tutor-approved warm-up draft",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white/10 px-4 py-4 text-sm font-medium"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />

        <FeatureSpotlight
          eyebrow="During class"
          title="Teachers stay in control while AI helps the lesson move faster"
          description="The platform supports the tutor with quick quizzes, concept explanation drafts, class prompts, and participation signals without turning the class into an AI-led experience."
          bullets={[
            "Tutor remains the primary educator in every live class",
            "Quick in-class tools reduce prep friction and keep lessons responsive",
            "Student participation and follow-up signals are easier to catch",
          ]}
          reverse
          visual={
            <div className="solace-gradient-card rounded-[1.9rem] border border-[var(--solace-line)] p-5">
              <div className="rounded-[1.6rem] border border-[var(--solace-line)] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--solace-primary)]">
                  During class
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[1.3rem] bg-[var(--solace-fog)] p-4">
                    <p className="text-sm font-semibold text-[var(--solace-ink)]">
                      Live support tools
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--solace-ink-soft)]">
                      Quick quiz generation, class poll drafts, and concept explanation prompts.
                    </p>
                  </div>
                  <div className="rounded-[1.3rem] bg-[var(--solace-fog)] p-4">
                    <div className="space-y-3">
                      {["Warm-up quiz", "Participation cues", "Core questions"].map(
                        (item) => (
                          <div
                            key={item}
                            className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[var(--solace-ink)]"
                          >
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <FeatureSpotlight
          eyebrow="After class"
          title="Homework, revision, and parent reporting stay connected"
          description="Each class can lead directly into tutor-approved homework, revision plans, and clear parent updates, so learning does not disappear after the live session ends."
          bullets={[
            "Homework can be generated from the lesson taught",
            "Study plans keep AI revision inside approved scope",
            "Parents receive tutor-approved reporting instead of vague summaries",
          ]}
          visual={
            <div className="solace-gradient-card rounded-[1.9rem] border border-[var(--solace-line)] p-5">
              <div className="rounded-[1.6rem] border border-[rgba(183,154,102,0.25)] bg-[linear-gradient(180deg,#fffaf2_0%,#f6efe1_100%)] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--solace-accent)]">
                  After class
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--solace-ink)]">
                  A clearer follow-up loop
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Assigned homework queue",
                    "Study plan topic approval",
                    "Parent report draft queue",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.3rem] border border-[rgba(183,154,102,0.18)] bg-white/80 px-4 py-4 text-sm font-medium text-[var(--solace-ink)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />

        <SectionShell
          eyebrow="Why it works"
          title="What makes the system stronger than ordinary online tuition"
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {outcomes.map((item, index) => (
              <div
                key={item}
                className="rounded-[1.7rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--solace-primary)]">
                  0{index + 1}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--solace-ink-soft)]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          eyebrow="What families say"
          title="Trusted by the people closest to learning outcomes"
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.quote}
                className="rounded-[1.8rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-6"
              >
                <p className="text-base leading-8 text-[var(--solace-ink)]">
                  “{item.quote}”
                </p>
                <p className="mt-5 text-sm font-semibold text-[var(--solace-primary)]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          eyebrow="Plans"
          title="Choose the tuition path that fits your family"
          description="Start with guided revision, or move into tutor-led classes and deeper reporting as support needs grow."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {pricing.map((plan) => (
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

        <section className="rounded-[2.2rem] border border-[rgba(23,63,58,0.1)] bg-[linear-gradient(135deg,#173f3a_0%,#214a43_50%,#355e56_100%)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(21,53,47,0.16)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#dbe6e1]">
                Start learning
              </p>
              <h2 className="solace-serif text-4xl leading-[1.04] sm:text-5xl">
                Give your child a steadier tuition rhythm.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/76">
                Start with a class booking, get matched into the right tutor-led
                path, and keep progress visible from the first learning cycle.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/book-class"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--solace-primary)] transition hover:bg-[#f1ece2]"
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

        <SolaceSiteFooter />
      </main>
    </div>
  );
}
