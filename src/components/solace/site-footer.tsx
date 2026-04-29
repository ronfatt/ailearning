import Link from "next/link";

const footerGroups = [
  {
    title: "Product",
    items: [
      { label: "Product", href: "/product" },
      { label: "How it Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Families",
    items: [
      { label: "Book a Class", href: "/book-class" },
      { label: "Create Account", href: "/signup" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Tutors",
    items: [
      { label: "Apply as a Tutor", href: "/tutor-apply" },
      { label: "Login", href: "/login" },
      { label: "Book a Class", href: "/book-class" },
    ],
  },
];

export function SolaceSiteFooter() {
  return (
    <footer className="rounded-[2rem] border border-[var(--solace-line)] bg-[rgba(255,252,247,0.7)] px-6 py-8 shadow-[0_18px_46px_rgba(21,53,47,0.05)] sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--solace-primary)] text-sm font-semibold tracking-[0.24em] text-white">
              S
            </div>
            <div>
              <p className="solace-serif text-2xl leading-none text-[var(--solace-ink)]">
                AI Learning OS
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--solace-ink-soft)]">
                Teacher-led online tuition
              </p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--solace-ink-soft)]">
            AI Learning OS helps Malaysian families move from class booking to tutor-led lessons, personalized revision, and parent-visible progress in one calm, structured platform.
          </p>
          <div className="rounded-[1.4rem] border border-[rgba(183,154,102,0.22)] bg-[rgba(183,154,102,0.08)] px-4 py-4 text-sm leading-7 text-[var(--solace-ink)]">
            Every student-facing AI flow stays linked to a tutor, class, subject, or tutor-approved study plan.
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--solace-primary)]">
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
