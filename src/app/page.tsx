import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

const problemCards = [
  {
    icon: "01",
    title: "Same teaching for everyone",
    description:
      "Most tuition still moves one pace for the whole room, even when students understand very different things.",
  },
  {
    icon: "02",
    title: "No follow-up after class",
    description:
      "Students leave class without a clear next step, so mistakes repeat and weak topics stay hidden.",
  },
  {
    icon: "03",
    title: "Weak students fall behind",
    description:
      "By the time someone notices a student is struggling, confidence has already dropped and results follow.",
  },
];

const solutionPoints = [
  "AI tracks every student's weakness",
  "Teachers get real-time insights",
  "Personalized practice for every student",
];

const teacherTimeline = [
  {
    phase: "Before class",
    title: "AI analysis",
    description:
      "Tutors see weak topics, readiness signals, and who needs extra attention before teaching begins.",
  },
  {
    phase: "During class",
    title: "Live support",
    description:
      "Teachers get quick quiz drafts, prompt ideas, and student priority cues without losing control of the room.",
  },
  {
    phase: "After class",
    title: "Auto homework",
    description:
      "Homework, follow-up notes, and revision drafts are prepared fast, then approved by the tutor before release.",
  },
];

const studentBenefits = [
  "Learn from real teachers",
  "Practice with AI",
  "Get smarter revision",
  "Track progress",
];

const parentBenefits = [
  "See real progress",
  "Know weak topics",
  "Get clear reports",
];

const socialProof = [
  "SPM Math Tutors",
  "After-School Academies",
  "Parent Communities",
  "Tuition Centres",
  "PIBG Pilots",
];

const testimonials = [
  {
    quote:
      "I finally know which students need extra support before class even starts.",
    name: "Lead Tutor",
    role: "SPM Mathematics Programme",
  },
  {
    quote:
      "The reports are clear enough that I understand what my child is weak at immediately.",
    name: "Parent Account",
    role: "Parent",
  },
];

function ProductMockup() {
  return (
    <div className="relative">
      <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#cffc6d]/55 blur-3xl" />
      <div className="absolute -right-8 bottom-8 h-48 w-48 rounded-full bg-[#5cf0cf]/30 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/82 p-4 shadow-[0_24px_90px_rgba(12,58,51,0.14)] backdrop-blur-xl">
        <div className="rounded-[2rem] border border-[#0d5c52]/10 bg-[#f9fbf6] p-4">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.6rem] bg-[#0f4039] p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                    Live Class Workspace
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    Form 5 Algebra Sprint
                  </p>
                </div>
                <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-[#cffc6d]">
                  Live
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                    Readiness
                  </p>
                  <p className="mt-2 text-3xl font-semibold">82%</p>
                  <p className="mt-2 text-sm text-white/70">Class baseline before teaching</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                    Focus Topic
                  </p>
                  <p className="mt-2 text-xl font-semibold">Word Problems</p>
                  <p className="mt-2 text-sm text-white/70">Students needing support: 3</p>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                  AI Teaching Copilot
                </p>
                <p className="mt-3 text-sm leading-7 text-white/85">
                  Start with one easy success question, then move into paired practice before widening the task.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.6rem] border border-[#0d5c52]/10 bg-white p-4 shadow-[0_16px_40px_rgba(13,92,82,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">Student attention queue</p>
                  <span className="rounded-full bg-[#cffc6d] px-3 py-1 text-xs font-semibold text-[#153029]">
                    2 urgent
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ["Priority learner A", "42% on word problems"],
                    ["Priority learner B", "33% readiness check"],
                    ["Priority learner C", "Homework follow-up needed"],
                  ].map(([name, note]) => (
                    <div
                      key={name}
                      className="rounded-2xl bg-[#f6f9f4] px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <p className="mt-1 text-sm text-muted">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[#0d5c52]/10 bg-white p-4 shadow-[0_16px_40px_rgba(13,92,82,0.08)]">
                <p className="text-sm font-semibold text-foreground">Parent-ready progress</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    ["Attendance", "86%"],
                    ["Practice", "78%"],
                    ["Mastery", "Improving"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-[#f6f9f4] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">
                        {label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="page-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-8 sm:px-10 lg:px-[120px] lg:py-10">
        <section className="landing-hero fade-up overflow-hidden rounded-[2.8rem] border border-white/70 px-8 py-10 shadow-[0_28px_100px_rgba(13,92,82,0.12)] sm:px-10 lg:px-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[0.6fr_0.4fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border border-[#0d5c52]/12 bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-teal">
                Built for teachers. Designed for students. Trusted by parents.
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  Smarter tuition.
                  <span className="block text-teal">Powered by AI, led by real teachers.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted sm:text-[1.1rem]">
                  Personalized learning before class, better teaching during class, and smarter revision after class.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/book-class"
                  className="rounded-full bg-teal px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#09443c]"
                >
                  Start Learning
                </Link>
                <Link
                  href="/tutor-apply"
                  className="rounded-full border border-[#0d5c52]/18 bg-white/82 px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-teal hover:text-teal"
                >
                  Become a Tutor
                </Link>
              </div>

              <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
                {[
                  ["Before class", "AI tracks weak topics and class readiness"],
                  ["During class", "Teachers get real-time support and clarity"],
                  ["After class", "Revision and reports stay personalized"],
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="rounded-[1.6rem] border border-white/75 bg-white/70 p-5 shadow-[0_10px_28px_rgba(13,92,82,0.06)]"
                  >
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <ProductMockup />
          </div>
        </section>

        <section className="grid gap-8 rounded-[2.5rem] border border-white/70 bg-white/62 px-8 py-10 backdrop-blur-xl sm:px-10 lg:px-12 lg:py-14">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal">
              Problem
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground">
              Why students struggle today
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {problemCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[2rem] border border-[#0d5c52]/10 bg-[#fbfcf8] p-6 shadow-[0_18px_50px_rgba(13,92,82,0.05)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#cffc6d] text-sm font-semibold text-[#163029]">
                  {card.icon}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-foreground">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2.5rem] border border-[#0d5c52]/10 bg-[#103b35] px-8 py-10 text-white sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-14">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9ff8e3]">
              Solution
            </p>
            <h2 className="text-4xl font-semibold tracking-tight">
              How we fix it
            </h2>
            <p className="max-w-xl text-base leading-8 text-white/72">
              We do not start with software. We start with what students, teachers, and parents actually need to see happen.
            </p>
          </div>
          <div className="grid gap-4">
            {solutionPoints.map((point, index) => (
              <div
                key={point}
                className="flex items-start gap-4 rounded-[1.8rem] border border-white/10 bg-white/8 p-5"
              >
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#cffc6d] text-sm font-semibold text-[#163029]">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">{point}</p>
                  <p className="mt-2 text-sm leading-7 text-white/70">
                    {index === 0
                      ? "Weakness patterns stay visible before class and after class, not hidden inside guesswork."
                      : index === 1
                        ? "Tutors teach with better timing, clearer prompts, and stronger student awareness."
                        : "Every student gets follow-up that matches what really happened in class."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2.5rem] border border-white/70 bg-white/68 px-8 py-10 sm:px-10 lg:px-12 lg:py-14">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal">
              Teacher Advantage
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground">
              AI doesn&apos;t replace teachers. It makes them unstoppable.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {teacherTimeline.map((step, index) => (
              <article
                key={step.phase}
                className="relative rounded-[2rem] border border-[#0d5c52]/10 bg-[#fbfcf8] p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">{step.phase}</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{step.title}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[2.5rem] border border-white/70 bg-white/66 px-8 py-10 shadow-[0_20px_55px_rgba(13,92,82,0.06)] sm:px-10 lg:px-12">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal">
                Student Experience
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-foreground">
                What students experience
              </h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {studentBenefits.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.8rem] border border-[#0d5c52]/10 bg-[#fbfcf8] p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    0{index + 1}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{item}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {index === 0
                      ? "Students still learn from a real tutor, not from an unsupervised chatbot."
                      : index === 1
                        ? "AI practice stays available between sessions without breaking tutor-approved boundaries."
                        : index === 2
                          ? "Mistakes become the input for better next-step revision."
                          : "Progress feels visible, simple, and motivating instead of confusing."}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2.5rem] border border-white/70 bg-white/66 px-8 py-10 shadow-[0_20px_55px_rgba(13,92,82,0.06)] sm:px-10 lg:px-12">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal">
                Parent Trust
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-foreground">
                Built for parents, not just students
              </h2>
            </div>
            <div className="mt-8 grid gap-4">
              {parentBenefits.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.8rem] border border-[#0d5c52]/10 bg-[#fbfcf8] p-5"
                >
                  <p className="text-2xl font-semibold text-foreground">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[2rem] border border-[#0d5c52]/10 bg-[#f5faf7] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
                Parent report preview
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  ["Attendance", "86%"],
                  ["Weak topic", "Word Problems"],
                  ["Tutor note", "Needs short revision bursts this week"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-8 rounded-[2.5rem] border border-white/70 bg-white/62 px-8 py-10 sm:px-10 lg:px-12 lg:py-14">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal">
              Social Proof
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground">
              Trusted by the people closest to learning outcomes
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {socialProof.map((item) => (
              <div
                key={item}
                className="flex min-h-24 items-center justify-center rounded-[1.6rem] border border-[#0d5c52]/10 bg-[#fbfcf8] px-5 py-4 text-center text-sm font-semibold text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="rounded-[1.8rem] border border-[#0d5c52]/10 bg-[#fbfcf8] p-6"
              >
                <p className="text-base leading-8 text-foreground">{item.quote}</p>
                <p className="mt-5 text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted">{item.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2.8rem] border border-[#0d5c52]/10 bg-[linear-gradient(135deg,#143d36_0%,#0d5c52_45%,#11937d_100%)] px-8 py-12 text-white shadow-[0_28px_80px_rgba(13,92,82,0.18)] sm:px-10 lg:px-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b5ffda]">
                Start today
              </p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Start your learning journey today
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/75">
                AI-powered tuition platform designed for real results. Built for teachers. Designed for students. Trusted by parents.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/book-class"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#12342f] transition hover:bg-[#e7fff2]"
              >
                Book a Class
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/28 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-border/70 px-1 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">AI Learning OS</p>
            <p>Teacher-led tuition platform for smarter learning outcomes.</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/product" className="transition hover:text-teal">
              Product
            </Link>
            <Link href="/book-class" className="transition hover:text-teal">
              Book a Class
            </Link>
            <Link href="/tutor-apply" className="transition hover:text-teal">
              Tutor Apply
            </Link>
            <Link href="/" className="transition hover:text-teal">
              Home
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
