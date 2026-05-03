import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SolaceLandingHeader } from "@/components/solace/landing-header";
import {
  AudienceSceneGrid,
  HorizontalLearningStory,
} from "@/components/solace/learning-scenes";
import { SolaceSiteFooter } from "@/components/solace/site-footer";
import {
  DashboardSpark,
  GlowBadge,
  MiniStat,
  PlayfulOrb,
} from "@/components/solace/youthful-ui";
import { createPageMetadata } from "@/lib/site-metadata";

const featureTags = [
  "Live Classes",
  "AI Revision",
  "Parent Reports",
  "Homework Tracker",
  "Reward System",
];

const roleCards = [
  {
    title: "For Students",
    subtitle: "Learn with your AI Study Buddy.",
    body:
      "Ask questions, revise weak topics, complete homework, earn rewards, and stay motivated after every class.",
    tone:
      "from-[#4f46e5] via-[#6366f1] to-[#7c3aed] border-[#c7d2fe] text-white",
  },
  {
    title: "For Teachers",
    subtitle: "Teach with Better Insights.",
    body:
      "Know each student’s weak topics, prepare lessons faster, assign homework easily, and follow up with confidence.",
    tone:
      "from-[#0284c7] via-[#06b6d4] to-[#22d3ee] border-[#bae6fd] text-white",
  },
  {
    title: "For Parents",
    subtitle: "See Real Progress, Not Vague Updates.",
    body:
      "Get weekly reports, homework status, attendance, and tutor-approved learning summaries.",
    tone:
      "from-[#f97316] via-[#fb7185] to-[#f43f5e] border-[#fed7aa] text-white",
  },
];

const studentFeatures = [
  { title: "AI Homework Helper", tone: "blue" as const },
  { title: "Personalised Revision Plan", tone: "purple" as const },
  { title: "Topic Practice", tone: "mint" as const },
  { title: "Exam Preparation", tone: "blue" as const },
  { title: "Progress Streaks", tone: "coral" as const },
  { title: "Rewards & Badges", tone: "yellow" as const },
];

const centreFeatures = [
  "Student Management",
  "Tutor Dashboard",
  "Parent Communication",
  "AI Learning Assistant",
  "Class Scheduling",
  "Homework Automation",
  "Branch Ready",
  "Subscription Packages",
];

const outcomes = [
  "Smarter Revision",
  "Better Homework Completion",
  "Clear Parent Communication",
  "Teacher-Led Learning",
  "Trackable Progress",
  "Centre Growth",
];

const testimonials = [
  {
    quote: "Parents stopped asking what happened in class because the reports were already clear.",
    by: "Tuition centre founder",
  },
  {
    quote: "Students came back after class with more energy because revision felt more like progress than punishment.",
    by: "Math tutor",
  },
  {
    quote: "The AI study buddy kept my son practising the exact topics his teacher wanted him to fix.",
    by: "Parent of Form 5 student",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "Smarter AI-powered tuition for Malaysia",
  description:
    "Live online and offline tuition with real teachers, AI revision, homework tracking, parent reports, and centre-ready workflows.",
  path: "/",
  keywords: [
    "AI tuition Malaysia",
    "online tuition platform",
    "offline tuition support",
    "AI study buddy",
    "parent reports",
    "tuition centre management",
  ],
});

function LandingSection({
  eyebrow,
  title,
  description,
  children,
  tinted = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[2.25rem] border px-6 py-8 shadow-[0_28px_80px_rgba(34,62,163,0.08)] sm:px-8 sm:py-10 lg:px-10 lg:py-12 ${
        tinted
          ? "border-[#e6ecf5] bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(238,244,255,0.96)_58%,rgba(236,253,245,0.94)_100%)]"
          : "border-[#e6ecf5] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,255,0.94)_100%)]"
      }`}
    >
      <PlayfulOrb className="-right-8 top-4 h-24 w-24" color={tinted ? "purple" : "blue"} />
      <PlayfulOrb className="-left-6 bottom-3 h-20 w-20" color={tinted ? "mint" : "yellow"} />
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#3B6CFF]">
          {eyebrow}
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-7 text-[#5B6472]">{description}</p>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function StudentFeatureVisual({
  tone,
  index,
}: {
  tone: "blue" | "purple" | "mint" | "yellow" | "coral";
  index: number;
}) {
  if (index === 0) {
    return (
      <div className="space-y-3">
        <GlowBadge label="Auto hint" tone={tone} />
        <MiniStat label="Suggested next step" value="Revise algebra in 10 min" tone={tone} />
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="space-y-3">
        <DashboardSpark bars={[20, 34, 28, 40]} tone={tone === "yellow" || tone === "coral" ? "purple" : tone} />
        <GlowBadge label="Weak topic unlocked" tone={tone} />
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <MiniStat label="Focus topic" value="Fractions" tone={tone} />
        <MiniStat label="Practice set" value="12 questions" tone={tone} />
      </div>
    );
  }

  if (index === 3) {
    return (
      <div className="space-y-3">
        <GlowBadge label="SPM mode" tone={tone} />
        <DashboardSpark bars={[18, 30, 36, 44]} tone="blue" />
      </div>
    );
  }

  if (index === 4) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <MiniStat label="Current streak" value="7 days" tone={tone} />
        <MiniStat label="XP gained" value="+120 XP" tone={tone} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <GlowBadge label="Bronze" tone="yellow" />
        <GlowBadge label="On fire" tone="coral" />
      </div>
      <MiniStat label="Next badge" value="Homework Hero" tone={tone} />
    </div>
  );
}

function HeroInfoCard({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute rounded-[1.8rem] border border-white/75 bg-white/96 p-5 shadow-[0_22px_54px_rgba(15,23,42,0.14)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.2),transparent_18%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.22),transparent_22%),radial-gradient(circle_at_78%_26%,rgba(251,191,36,0.18),transparent_18%),linear-gradient(180deg,#f7fbff_0%,#eef5ff_35%,#fbf7ff_72%,#fffdf8_100%)] text-[#10223e]">
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 pb-8 pt-8 sm:px-8 sm:pt-10 lg:gap-14 lg:px-[96px] lg:pb-10 lg:pt-10">
        <section className="relative overflow-hidden rounded-[3rem] border border-[#6fa8ff] bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.16),transparent_18%),radial-gradient(circle_at_80%_16%,rgba(255,255,255,0.12),transparent_16%),linear-gradient(180deg,#4f9aff_0%,#377dff_38%,#2867db_100%)] px-6 pb-0 pt-6 shadow-[0_36px_100px_rgba(59,108,255,0.26)] sm:px-8 sm:pt-8 lg:px-12 lg:pt-8">
          <SolaceLandingHeader variant="hero" />

          <div className="absolute left-10 top-40 h-16 w-16 rounded-full border-[7px] border-transparent border-l-white/80 border-t-white/80 opacity-80" />
          <div className="absolute right-14 top-48 text-7xl text-[#ffe066] opacity-95">✦</div>
          <div className="absolute left-14 top-[64%] text-7xl text-[#ffd84d] opacity-95">✺</div>
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_42%,transparent_66%)]" />

          <div className="relative z-10 flex flex-col items-center pt-24 text-center sm:pt-28 lg:pt-32">
            <div className="inline-flex rounded-full border border-white/35 bg-white/14 px-5 py-2 text-sm font-semibold tracking-[0.02em] text-white shadow-[0_12px_30px_rgba(25,55,140,0.14)] backdrop-blur-sm">
              Learn from real tutors with AI follow-up
            </div>
            <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-[5.2rem] lg:leading-[0.94]">
              Smarter Tuition.
              <br />
              Real Teachers.
              <br />
              AI That Follows Up.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 sm:text-xl">
              Live online and offline tuition with AI-powered revision, homework tracking,
              parent reports, and personalised follow-up after every lesson.
            </p>

            <div className="mt-8 flex w-full max-w-[580px] items-center gap-3 rounded-full bg-white px-3 py-3 shadow-[0_22px_60px_rgba(17,24,39,0.16)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4ff] text-xl text-[#2867db]">
                ⌕
              </div>
              <div className="flex-1 text-left text-base font-medium text-[#7b8597]">
                Search classes, tutors, or revision topics...
              </div>
              <Link
                href="/book-class"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.22)] transition hover:-translate-y-0.5"
              >
                Start Free Trial
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {featureTags.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/92 backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="relative mt-12 flex w-full justify-center">
              <div className="relative h-[640px] w-full max-w-[920px] sm:h-[720px]">
                <HeroInfoCard className="left-0 top-44 z-20 w-[220px] sm:left-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                    Student rating
                  </p>
                  <p className="mt-3 text-5xl font-semibold tracking-tight text-[#111827]">4.8</p>
                  <p className="mt-2 text-xl text-[#ffb703]">★★★★★</p>
                  <p className="mt-3 text-sm leading-6 text-[#5B6472]">
                    By students worldwide for quality learning and support.
                  </p>
                </HeroInfoCard>

                <HeroInfoCard className="right-0 top-32 z-20 w-[290px] sm:right-4">
                  <div className="flex -space-x-3">
                    {["#99f6e4", "#93c5fd", "#f9a8d4", "#fde68a"].map((tone, index) => (
                      <div
                        key={tone}
                        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-sm font-semibold text-[#111827]"
                        style={{ backgroundColor: tone, zIndex: 5 - index }}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-5xl font-semibold tracking-tight text-[#111827]">60k+</p>
                  <p className="mt-3 text-sm leading-6 text-[#5B6472]">
                    Learners growing with expert guidance from trusted tutors.
                  </p>
                </HeroInfoCard>

                <div className="absolute inset-x-0 bottom-0 mx-auto h-[460px] w-[460px] rounded-t-[250px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.14)_38%,rgba(255,255,255,0.02)_72%,transparent_100%)] sm:h-[560px] sm:w-[700px] sm:rounded-t-[360px]" />
                <div className="absolute inset-x-0 bottom-4 mx-auto h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_56%,transparent_78%)] blur-[4px]" />

                <div className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[660px] w-[500px] overflow-visible sm:h-[760px] sm:w-[600px]">
                  <Image
                    src="/malay-girl.png"
                    alt="Malay student holding books and smiling"
                    fill
                    priority
                    sizes="(min-width: 1024px) 600px, 500px"
                    className="object-contain object-bottom drop-shadow-[0_28px_54px_rgba(17,24,39,0.22)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <LandingSection
          eyebrow="Three audiences"
          title="One Platform. Three Powerful Experiences."
          description="Students stay engaged, tutors stay sharp, and parents stay updated without chasing for answers."
          tinted
        >
          <div className="space-y-5">
            <AudienceSceneGrid />
            <div className="grid gap-4 lg:grid-cols-3">
            {roleCards.map((card) => (
              <article
                key={card.title}
                className={`rounded-[2rem] border bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] p-6 shadow-[0_22px_54px_rgba(59,108,255,0.16)] ${card.tone}`}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/72">
                  {card.title}
                </p>
                <h3 className="mt-4 text-2xl font-semibold">{card.subtitle}</h3>
                <p className="mt-4 text-sm leading-6 text-white/88">{card.body}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.title === "For Students" ? (
                    <>
                      <GlowBadge label="Daily streak" tone="yellow" />
                      <GlowBadge label="AI buddy" tone="blue" />
                    </>
                  ) : card.title === "For Teachers" ? (
                    <>
                      <GlowBadge label="Readiness view" tone="mint" />
                      <GlowBadge label="Faster follow-up" tone="blue" />
                    </>
                  ) : (
                    <>
                      <GlowBadge label="Weekly report" tone="yellow" />
                      <GlowBadge label="Homework status" tone="coral" />
                    </>
                  )}
                </div>
              </article>
            ))}
            </div>
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="Student experience"
          title="Everything Students Need After Class"
          description="Keep revision active, visible, and motivating between tutor-led lessons."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {studentFeatures.map((item, index) => (
              <article
                key={item.title}
                className="rounded-[1.9rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] p-5 shadow-[0_18px_42px_rgba(14,165,233,0.08)]"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white ${
                    item.tone === "blue"
                      ? "bg-[linear-gradient(135deg,#06b6d4_0%,#3b82f6_100%)]"
                      : item.tone === "purple"
                        ? "bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)]"
                        : item.tone === "mint"
                          ? "bg-[linear-gradient(135deg,#22c55e_0%,#14b8a6_100%)]"
                          : "bg-[linear-gradient(135deg,#f59e0b_0%,#f97316_100%)]"
                  }`}
                >
                  {index + 1}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#10223e]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#55637c]">
                  Short, guided, and linked to what the tutor wants fixed next.
                </p>
                <div className="mt-4">
                  <StudentFeatureVisual tone={item.tone} index={index} />
                </div>
              </article>
            ))}
          </div>
        </LandingSection>

        <HorizontalLearningStory />

        <LandingSection
          eyebrow="Parent confidence"
          title="Parents Stay in the Loop"
          description="No more guessing what happened in tuition. Parents can see what was taught, what needs improvement, and what the next learning step is."
          tinted
        >
          <div className="grid gap-6 lg:grid-cols-[0.54fr_0.46fr] lg:items-center">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniStat label="Homework done" value="2 / 2 this week" tone="mint" />
                <MiniStat label="Attendance" value="100% on time" tone="blue" />
                <MiniStat label="Weak topic" value="Word problems" tone="coral" />
                <MiniStat label="Next focus" value="Fractions to algebra" tone="purple" />
              </div>
              <div className="flex flex-wrap gap-2">
                <GlowBadge label="Weekly summary" tone="blue" />
                <GlowBadge label="Tutor note" tone="mint" />
                <GlowBadge label="Next-step plan" tone="yellow" />
              </div>
            </div>
            <div className="rounded-[2rem] border border-[#dbe7ff] bg-white p-5 shadow-[0_22px_54px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3B6CFF]">
                Parent mobile report
              </p>
              <div className="mt-4 rounded-[1.8rem] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-[#10223e]">Aina Sofia</p>
                    <p className="text-sm text-[#5B6472]">Weekly learning summary</p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#3B6CFF]">
                    This week
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Attendance", "100%"],
                    ["Homework", "2/2 done"],
                    ["Weak topic", "Word Problems"],
                    ["Next focus", "Algebra translation"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[1.2rem] bg-white/88 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#64748b]">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#10223e]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="Tutor workflow"
          title="Teach Smarter Before, During & After Class"
          description="Keep the class human. Let the platform handle the follow-through."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Before Class",
                detail: "Readiness, weak topics, and quick prep in one glance.",
                tone:
                  "bg-[linear-gradient(180deg,#eff6ff_0%,#eef2ff_100%)] border-[#bfdbfe]",
              },
              {
                title: "During Class",
                detail: "Live support for quizzes, prompts, and focus checks.",
                tone:
                  "bg-[linear-gradient(180deg,#f5f3ff_0%,#fdf2f8_100%)] border-[#ddd6fe]",
              },
              {
                title: "After Class",
                detail: "Homework, revision, and parent reports move faster.",
                tone:
                  "bg-[linear-gradient(180deg,#fff7ed_0%,#fefce8_100%)] border-[#fed7aa]",
              },
            ].map((step, index) => (
              <article
                key={step.title}
                className={`rounded-[1.9rem] border p-6 shadow-[0_18px_44px_rgba(79,70,229,0.08)] ${step.tone}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10223e] text-sm font-bold text-white">
                    0{index + 1}
                  </div>
                  <h3 className="text-2xl font-semibold text-[#10223e]">{step.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#55637c]">{step.detail}</p>
                <div className="mt-4">
                  {index === 0 ? (
                    <DashboardSpark bars={[22, 36, 28, 42]} tone="blue" />
                  ) : index === 1 ? (
                    <div className="flex gap-2">
                      <GlowBadge label="Quick quiz" tone="purple" />
                      <GlowBadge label="Participation" tone="mint" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <MiniStat label="Homework" value="Auto drafted" tone="yellow" />
                      <MiniStat label="Parent note" value="Ready to send" tone="coral" />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="For tuition centres"
          title="Turn Your Tuition Centre Into an AI Learning Brand"
          description="Manage classes, students, tutors, homework, AI revision, parent communication, and learning reports from one smart platform."
        >
          <div className="rounded-[2rem] border border-[#111827]/10 bg-[linear-gradient(135deg,#111827_0%,#1d4ed8_50%,#0f766e_100%)] p-6 shadow-[0_28px_70px_rgba(29,78,216,0.2)]">
            <div className="mb-5 grid gap-3 md:grid-cols-3">
              <MiniStat label="Active students" value="420 across 3 branches" tone="blue" />
              <MiniStat label="Tutor follow-up" value="92% on time" tone="mint" />
              <MiniStat label="Parent replies" value="Same-day updates" tone="yellow" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {centreFeatures.map((item, index) => (
              <article
                key={item}
                className="rounded-[1.7rem] border border-white/12 bg-white/10 p-5 shadow-[0_16px_38px_rgba(0,0,0,0.12)] backdrop-blur-sm"
              >
                <div
                  className={`h-2 rounded-full ${
                    index % 4 === 0
                      ? "bg-[linear-gradient(90deg,#3b82f6_0%,#06b6d4_100%)]"
                      : index % 4 === 1
                        ? "bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]"
                        : index % 4 === 2
                          ? "bg-[linear-gradient(90deg,#f59e0b_0%,#f97316_100%)]"
                          : "bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)]"
                  }`}
                />
                <h3 className="mt-4 text-lg font-semibold text-white">{item}</h3>
              </article>
            ))}
            </div>
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="Outcomes"
          title="Designed to Improve Real Tuition Outcomes"
          description="Less chasing. Better follow-up. Stronger learning habits after class."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {outcomes.map((item, index) => (
              <article
                key={item}
                className="rounded-[1.7rem] border border-[#e6ecf5] bg-white p-5 shadow-[0_16px_36px_rgba(14,165,233,0.08)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#10223e]">{item}</h3>
                  <div
                    className={`h-10 w-10 rounded-2xl ${
                      index % 3 === 0
                        ? "bg-[#e0f2fe]"
                        : index % 3 === 1
                          ? "bg-[#ede9fe]"
                          : "bg-[#ffedd5]"
                    }`}
                  />
                </div>
                <div className="mt-4">
                  {index % 3 === 0 ? (
                    <DashboardSpark bars={[18, 28, 36, 44]} tone="blue" />
                  ) : index % 3 === 1 ? (
                    <div className="flex flex-wrap gap-2">
                      <GlowBadge label="Tutor-led" tone="mint" />
                      <GlowBadge label="Trackable" tone="blue" />
                    </div>
                  ) : (
                    <MiniStat label="Visible impact" value="Parents see what changed" tone="coral" />
                  )}
                </div>
              </article>
            ))}
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="What people say"
          title="Students, parents, tutors, and centres can all feel the difference"
          description="Real progress feels different when class, revision, homework, and follow-up all stay connected."
          tinted
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.quote}
                className="rounded-[1.8rem] border border-white/70 bg-white/88 p-6 shadow-[0_18px_42px_rgba(79,70,229,0.08)]"
              >
                <p className="text-base leading-8 text-[#334155]">“{item.quote}”</p>
                <p className="mt-5 text-sm font-semibold text-[#4f46e5]">{item.by}</p>
              </article>
            ))}
          </div>
        </LandingSection>

        <section className="rounded-[2.5rem] border border-white/60 bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_34%,#7c3aed_66%,#f97316_100%)] px-6 py-8 text-white shadow-[0_34px_90px_rgba(79,70,229,0.22)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/72">
                Final CTA
              </p>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Ready to Make Tuition Smarter?
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/84">
                Bring AI into your tuition centre without replacing your teachers.
                Help students learn better, help parents trust more, and help your
                centre grow faster.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/book-class"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold !text-[#2f5bff] shadow-[0_14px_32px_rgba(255,255,255,0.16)] transition hover:bg-[#f8fafc] hover:!text-[#2448d8]"
              >
                Book a Demo
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/26 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/18"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>

        <SolaceSiteFooter />
      </main>
    </div>
  );
}
