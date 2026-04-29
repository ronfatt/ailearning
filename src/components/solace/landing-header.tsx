import Link from "next/link";

const navItems = [
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/tutor-apply", label: "For Tutors" },
];

export function SolaceLandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--solace-line)] bg-[#fbf7f0]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 sm:px-10 lg:px-[120px]">
        <Link href="/" className="flex items-center gap-3">
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
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--solace-ink-soft)] transition hover:text-[var(--solace-primary)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full border border-[var(--solace-line)] bg-white/70 px-4 py-2.5 text-sm font-semibold text-[var(--solace-ink)] transition hover:border-[rgba(23,63,58,0.22)] hover:text-[var(--solace-primary)]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="solace-button-primary rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Book a Class
          </Link>
        </nav>
      </div>
    </header>
  );
}
