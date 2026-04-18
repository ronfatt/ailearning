import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

const proofStrip = [
  ["Tutor-led", "Every class guided by a real teacher"],
  ["Personalized", "Revision adapts to each student"],
  ["Parent-visible", "Progress stays clear and simple"],
];

const successStories = [
  {
    result: "+18%",
    title: "Math score improvement",
    detail: "After 8 weeks of tutor-led revision and weekly follow-up.",
  },
  {
    result: "2x",
    title: "Homework completion",
    detail: "Students stayed consistent once tasks were personalized.",
  },
  {
    result: "86%",
    title: "Parent report open rate",
    detail: "Families actually read the updates because they are simple.",
  },
];

const socialProof = ["SPM Tutors", "Tuition Centres", "Parent Circles", "School Communities"];

const testimonials = [
  {
    quote: "I spend less time preparing and more time actually teaching well.",
    name: "Farah",
    role: "SPM Math Tutor",
  },
  {
    quote: "For the first time, I can see what my child is weak at without guessing.",
    name: "Aina's Parent",
    role: "Parent",
  },
  {
    quote: "The homework feels more doable because it matches what I got wrong.",
    name: "Form 5 Student",
    role: "Student",
  },
];

function ProductMockup() {
  return (
    <div className="relative">
      <div className="absolute -left-12 top-6 h-44 w-44 rounded-full bg-[#cffc6d]/55 blur-3xl" />
      <div className="absolute -right-10 top-16 h-52 w-52 rounded-full bg-[#5cf0cf]/28 blur-3xl" />
      <div className="absolute bottom-4 left-12 h-32 w-32 rounded-full bg-white/55 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2.6rem] border border-white/70 bg-white/80 p-4 shadow-[0_28px_100px_rgba(12,58,51,0.15)] backdrop-blur-xl">
        <div className="grid gap-4 rounded-[2.1rem] border border-[#0d5c52]/10 bg-[#f9fbf6] p-4">
          <div className="rounded-[1.8rem] bg-[#0f4039] p-6 text-white shadow-[0_18px_50px_rgba(10,45,39,0.22)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Live Class
                </p>
                <p className="mt-2 text-2xl font-semibold">Form 5 Algebra Sprint</p>
              </div>
              <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-[#cffc6d]">
                82% Ready
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Focus", "Word Problems"],
                ["Practice", "78%"],
                ["Progress", "+18%"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/50">{label}</p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 h-28 rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-4">
              <div className="flex h-full items-end gap-2">
                {[30, 44, 38, 58, 67, 74, 86].map((height, index) => (
                  <div
                    key={height}
                    className={`flex-1 rounded-t-2xl ${
                      index === 6 ? "bg-[#cffc6d]" : "bg-white/45"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[1.7rem] border border-[#0d5c52]/10 bg-white p-5 shadow-[0_16px_40px_rgba(13,92,82,0.08)]">
              <p className="text-sm font-semibold text-foreground">This week</p>
              <div className="mt-4 space-y-3">
                {[
                  "Tutor-led class completed",
                  "Revision unlocked",
                  "Parent update ready",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-[#f6f9f4] px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-[#0d5c52]/10 bg-white p-5 shadow-[0_16px_40px_rgba(13,92,82,0.08)]">
              <p className="text-sm font-semibold text-foreground">Parent view</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Attendance", "86%"],
                  ["Homework", "On track"],
                  ["Weak topic", "Ratios"],
                  ["Tutor note", "Improving"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-[#f6f9f4] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
                  </div>
                ))}
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
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 py-8 sm:px-10 lg:gap-14 lg:px-[120px] lg:py-10">
        <section className="landing-hero fade-up overflow-hidden rounded-[3rem] border border-white/70 px-8 py-10 shadow-[0_28px_100px_rgba(13,92,82,0.12)] sm:px-10 lg:px-14 lg:py-18">
          <div className="grid gap-12 lg:grid-cols-[0.6fr_0.4fr] lg:items-center">
            <div className="space-y-9">
              <div className="inline-flex rounded-full border border-[#0d5c52]/12 bg-white/78 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-teal shadow-[0_8px_20px_rgba(13,92,82,0.05)]">
                AI-powered tuition for real results
              </div>

              <div className="space-y-6">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl lg:text-[4.6rem] lg:leading-[0.94]">
                  Smarter tuition.
                  <span className="block text-teal">Powered by AI, led by real teachers.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted sm:text-[1.12rem]">
                  Personalized support for students, better teaching for tutors, and clearer progress for parents.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/book-class"
                  className="rounded-full bg-teal px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(13,92,82,0.2)] transition hover:-translate-y-0.5 hover:bg-[#09443c]"
                >
                  Start Learning
                </Link>
                <Link
                  href="/tutor-apply"
                  className="rounded-full border border-[#0d5c52]/18 bg-white/82 px-7 py-3.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-teal hover:text-teal"
                >
                  Become a Tutor
                </Link>
              </div>

              <div className="flex max-w-3xl flex-wrap gap-3">
                {proofStrip.map(([title, detail]) => (
                  <div
                    key={title}
                    className="rounded-full border border-white/75 bg-white/74 px-4 py-3 shadow-[0_10px_28px_rgba(13,92,82,0.06)]"
                  >
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-xs tracking-[0.02em] text-muted">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <ProductMockup />
          </div>
        </section>

        <section className="grid gap-8 rounded-[2.7rem] border border-[#0d5c52]/10 bg-[#103b35] px-8 py-10 text-white shadow-[0_24px_70px_rgba(12,58,51,0.12)] sm:px-10 lg:px-12 lg:py-14">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9ff8e3]">
              Results
            </p>
            <h2 className="text-4xl font-semibold tracking-tight">
              Built to improve learning outcomes
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {successStories.map((story) => (
              <article
                key={story.title}
                className="rounded-[2rem] border border-white/10 bg-white/8 p-6"
              >
                <p className="text-4xl font-semibold text-[#cffc6d]">{story.result}</p>
                <p className="mt-4 text-2xl font-semibold text-white">{story.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/72">{story.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2.7rem] border border-white/70 bg-white/62 px-8 py-10 shadow-[0_20px_55px_rgba(13,92,82,0.06)] sm:px-10 lg:px-12 lg:py-14">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal">
              Trusted By
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground">
              Families, tutors, and learning communities
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {socialProof.map((item) => (
              <div
                key={item}
                className="flex min-h-24 items-center justify-center rounded-[1.6rem] border border-[#0d5c52]/10 bg-[#fbfcf8] px-5 py-4 text-center text-sm font-semibold text-foreground"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="rounded-[2rem] border border-[#0d5c52]/10 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcf8_100%)] p-6 shadow-[0_14px_35px_rgba(13,92,82,0.05)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-4xl leading-none text-teal/20">“</span>
                  <span className="rounded-full bg-[#edf7f3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">
                    Verified Voice
                  </span>
                </div>
                <p className="mt-4 text-base leading-8 text-foreground">{item.quote}</p>
                <div className="mt-6 border-t border-[#0d5c52]/8 pt-4">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[3rem] border border-[#0d5c52]/10 bg-[linear-gradient(135deg,#143d36_0%,#0d5c52_45%,#11937d_100%)] px-8 py-12 text-white shadow-[0_28px_80px_rgba(13,92,82,0.18)] sm:px-10 lg:px-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b5ffda]">
                Start today
              </p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Start your child’s learning journey today
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/75">
                Simple to start. Clear to follow. Built to help students improve week by week.
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
