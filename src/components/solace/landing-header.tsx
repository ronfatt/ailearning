import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function SolaceLandingHeader({
  variant = "default",
}: {
  variant?: "default" | "hero";
}) {
  const isHero = variant === "hero";

  return (
    <header
      className={
        isHero
          ? "absolute inset-x-0 top-0 z-30"
          : "sticky top-0 z-30 border-b border-[#e6ecf5] bg-white/84 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 sm:px-10 lg:px-[96px] xl:px-[120px]">
        <Link href="/" className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold tracking-[0.24em] shadow-[0_12px_28px_rgba(59,108,255,0.25)] ${
              isHero
                ? "bg-white text-[#3B6CFF]"
                : "bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] text-white"
            }`}
          >
            AI
          </div>
          <div>
            <p
              className={`solace-serif text-2xl leading-none ${
                isHero ? "text-white" : "text-[var(--solace-ink)]"
              }`}
            >
              AI Learning OS
            </p>
            <p
              className={`text-[11px] uppercase tracking-[0.28em] ${
                isHero ? "text-white/72" : "text-[var(--solace-ink-soft)]"
              }`}
            >
              Bright AI tuition platform
            </p>
          </div>
        </Link>

        <nav
          className={`hidden items-center gap-2 rounded-full px-3 py-2 lg:flex ${
            isHero
              ? "border border-white/14 bg-white/8 backdrop-blur-sm"
              : "border border-[#e6ecf5] bg-white/92 shadow-[0_10px_28px_rgba(59,108,255,0.06)]"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                isHero
                  ? "text-white/84 hover:bg-white/10 hover:text-white"
                  : "text-[var(--solace-ink-soft)] hover:bg-[#eef4ff] hover:text-[var(--solace-primary)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/signup"
            className={`inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
              isHero
                ? "bg-white text-[#111827] shadow-[0_14px_32px_rgba(8,15,52,0.18)]"
                : "border border-[#dbe7ff] bg-white text-[#111827] hover:border-[#7C5CFF] hover:text-[#3B6CFF]"
            }`}
          >
            Register
            {isHero ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B6CFF] text-base text-white">
                ↗
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
