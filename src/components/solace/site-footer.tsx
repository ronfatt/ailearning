import Link from "next/link";

const footerGroups = [
  {
    title: "Product",
    items: [
      { label: "How it Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Families",
    items: [
      { label: "Book a Class", href: "/book-class" },
      { label: "Create Account", href: "/signup" },
      { label: "How it Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Tutors",
    items: [
      { label: "Apply as a Tutor", href: "/tutor-apply" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Student experience", href: "/how-it-works" },
      { label: "Parent reporting", href: "/how-it-works" },
      { label: "Centre workflows", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function SolaceSiteFooter() {
  return (
    <footer className="rounded-[2.2rem] border border-[#e6ecf5] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(238,244,255,0.92)_100%)] px-6 py-8 shadow-[0_18px_46px_rgba(79,124,255,0.08)] sm:px-8 lg:px-10">
      <div className="grid gap-8 border-b border-[#e6ecf5] pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] text-sm font-semibold tracking-[0.24em] text-white shadow-[0_12px_28px_rgba(59,108,255,0.2)]">
              S
            </div>
            <div>
              <p className="solace-serif text-2xl leading-none text-[var(--solace-ink)]">
                AI Learning OS
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--solace-ink-soft)]">
                Smart tuition platform
              </p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--solace-ink-soft)]">
            AI Learning OS helps Malaysian families move from trial class booking to tutor-led lessons, AI revision, homework follow-up, and parent-visible progress in one bright, modern platform.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Online + offline tuition", "AI revision", "Parent reports", "Centre ready"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-sm font-semibold text-[#3B6CFF] shadow-[0_10px_24px_rgba(59,108,255,0.06)]"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-[#d6e3ff] bg-[linear-gradient(135deg,#3B6CFF_0%,#4F7CFF_44%,#7C5CFF_78%,#12CFF3_100%)] p-6 text-white shadow-[0_18px_42px_rgba(59,108,255,0.2)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
            Start smarter
          </p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight">
            Bring tutors, students, and parents into one learning flow.
          </h3>
          <p className="mt-3 max-w-lg text-sm leading-7 text-white/82">
            Book a free trial, see how the platform works, and turn tuition into a clearer weekly progress system.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book-class"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold !text-[#2f5bff] shadow-[0_14px_32px_rgba(255,255,255,0.16)] transition hover:bg-[#f8fbff] hover:!text-[#2448d8]"
            >
              Book a Free Trial
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-full border border-white/24 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 pt-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <div className="rounded-[1.4rem] border border-[rgba(79,124,255,0.16)] bg-[rgba(79,124,255,0.06)] px-4 py-4 text-sm leading-7 text-[var(--solace-ink)]">
            Every student-facing AI flow stays linked to a tutor, class, subject, or tutor-approved study plan.
          </div>
          <p className="text-sm leading-7 text-[var(--solace-ink-soft)]">
            Built for Malaysian families, tutors, and tuition centres who want more visible progress after every class.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#3B6CFF]">
                {group.title}
              </p>
              <div className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-sm text-[var(--solace-ink-soft)] transition hover:text-[var(--solace-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
