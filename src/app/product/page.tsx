import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

const platformBenefits = [
  {
    title: "For students",
    points: [
      "Learn with real teachers",
      "Get revision based on weak topics",
      "See progress more clearly",
    ],
  },
  {
    title: "For tutors",
    points: [
      "Plan lessons faster",
      "See who needs attention before class",
      "Send homework and reports in less time",
    ],
  },
  {
    title: "For parents",
    points: [
      "Know what your child is weak at",
      "See updates after class",
      "Follow progress without guesswork",
    ],
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Start",
    detail: "Book a class or create a parent account in a few minutes.",
  },
  {
    step: "02",
    title: "Get matched",
    detail: "We connect the student with the right tutor-led path.",
  },
  {
    step: "03",
    title: "Attend and revise",
    detail: "Students learn in class, then continue with guided follow-up.",
  },
  {
    step: "04",
    title: "Track improvement",
    detail: "Tutors and parents stay aligned through simple progress updates.",
  },
];

const differentiators = [
  "Real teachers stay at the center of learning",
  "Revision follows each student's weak topics",
  "Parents get clear updates, not confusing data",
  "Built for steady academic improvement",
];

const proofCards = [
  {
    metric: "+18%",
    label: "Math score improvement",
  },
  {
    metric: "2x",
    label: "Homework completion",
  },
  {
    metric: "86%",
    label: "Parent report open rate",
  },
];

export default function ProductPage() {
  return (
    <div className="page-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 py-8 sm:px-10 lg:gap-14 lg:px-[120px] lg:py-10">
        <section className="landing-hero fade-up overflow-hidden rounded-[3rem] border border-white/70 px-8 py-10 shadow-[0_28px_100px_rgba(13,92,82,0.12)] sm:px-10 lg:px-14 lg:py-18">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border border-[#0d5c52]/12 bg-white/78 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-teal shadow-[0_8px_20px_rgba(13,92,82,0.05)]">
                Product Overview
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl lg:text-[4.2rem] lg:leading-[0.96]">
                  A tuition platform built for
                  <span className="block text-teal"> real progress.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted sm:text-[1.1rem]">
                  Teacher-led classes, smarter revision, and clear parent updates, all in one simple learning flow.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/book-class"
                  className="rounded-full bg-teal px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(13,92,82,0.2)] transition hover:-translate-y-0.5 hover:bg-[#09443c]"
                >
                  Book a Class
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-[#0d5c52]/18 bg-white/82 px-7 py-3.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-teal hover:text-teal"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="rounded-[2.4rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_90px_rgba(12,58,51,0.14)] backdrop-blur-xl">
              <div className="rounded-[2rem] border border-[#0d5c52]/10 bg-[#f9fbf6] p-5">
                <div className="rounded-[1.8rem] bg-[#0f4039] p-6 text-white shadow-[0_18px_50px_rgba(10,45,39,0.22)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                    Learning Snapshot
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    Better teaching. Better follow-up. Better visibility.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Tutor-led", "Every class guided by a real teacher"],
                      ["Personalized", "Revision opens by weak topic"],
                      ["Parent-ready", "Updates stay simple and clear"],
                    ].map(([title, detail]) => (
                      <div key={title} className="rounded-2xl bg-white/10 p-4">
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="mt-2 text-xs leading-6 text-white/72">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {proofCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.6rem] border border-[#0d5c52]/10 bg-white p-5 text-center shadow-[0_16px_40px_rgba(13,92,82,0.08)]"
                    >
                      <p className="text-3xl font-semibold text-teal">{item.metric}</p>
                      <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {platformBenefits.map((group) => (
            <article
              key={group.title}
              className="rounded-[2.2rem] border border-white/70 bg-white/72 p-7 shadow-[0_18px_50px_rgba(13,92,82,0.05)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal">
                {group.title}
              </p>
              <div className="mt-6 space-y-3">
                {group.points.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.4rem] border border-[#0d5c52]/10 bg-[#fbfcf8] px-4 py-4 text-sm font-medium leading-7 text-foreground"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-[2.7rem] border border-[#0d5c52]/10 bg-[#103b35] px-8 py-10 text-white shadow-[0_24px_70px_rgba(12,58,51,0.12)] sm:px-10 lg:px-12 lg:py-14">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9ff8e3]">
              How It Works
            </p>
            <h2 className="text-4xl font-semibold tracking-tight">
              A simple flow from first enquiry to better results
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {journeySteps.map((item) => (
              <article
                key={item.step}
                className="rounded-[2rem] border border-white/10 bg-white/8 p-6"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b5ffda]">
                  {item.step}
                </p>
                <p className="mt-4 text-2xl font-semibold text-white">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/72">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2.7rem] border border-white/70 bg-white/62 px-8 py-10 shadow-[0_20px_55px_rgba(13,92,82,0.06)] sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-14">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal">
              Why Families Choose It
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground">
              Less guesswork. More learning momentum.
            </h2>
            <p className="max-w-xl text-base leading-8 text-muted">
              The platform keeps the human side of tuition strong while making follow-up, revision, and reporting much easier.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div
                key={item}
                className="rounded-[1.7rem] border border-[#0d5c52]/10 bg-[#fbfcf8] p-5 text-sm font-medium leading-7 text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[3rem] border border-[#0d5c52]/10 bg-[linear-gradient(135deg,#143d36_0%,#0d5c52_45%,#11937d_100%)] px-8 py-12 text-white shadow-[0_28px_80px_rgba(13,92,82,0.18)] sm:px-10 lg:px-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b5ffda]">
                Get Started
              </p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Ready to see how it works for your family?
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/75">
                Start with a class enquiry or create your parent account first. We will guide the rest.
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
                href="/signup"
                className="rounded-full border border-white/28 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
