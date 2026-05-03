import Link from "next/link";

import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/book-class", label: "Book a Class" },
  { href: "/signup", label: "Sign Up" },
  { href: "/tutor-apply", label: "Tutor Apply" },
];

export async function SiteHeader() {
  const session = await getCurrentSession();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e6ecf5] bg-white/84 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4 sm:px-10 lg:px-[96px] xl:px-[120px]">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] text-sm font-semibold tracking-[0.24em] text-white shadow-[0_12px_28px_rgba(59,108,255,0.25)]">
            AI
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#5B6472]">
              Malaysia Teacher-Led Tuition
            </p>
            <p className="solace-serif text-2xl leading-none text-[#111827]">AI Learning OS</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-3 rounded-full border border-[#e6ecf5] bg-white/92 px-3 py-2 shadow-[0_10px_28px_rgba(59,108,255,0.06)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-[#5B6472] transition hover:bg-[#eef4ff] hover:text-[#3B6CFF]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {session.isAuthenticated && session.user.role !== "Guest" ? (
            <>
              <Link
                href={getAuthenticatedHomePath(session.user)}
                className="hidden rounded-full border border-[#dbe7ff] bg-white px-5 py-2.5 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5 hover:border-[#7C5CFF] hover:text-[#3B6CFF] md:inline-flex"
              >
                {session.user.onboardingCompleted ? "Open Workspace" : "Finish Setup"}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-[#dbe7ff] bg-white px-5 py-2.5 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5 hover:border-[#7C5CFF] hover:text-[#3B6CFF] md:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/book-class"
                className="rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(59,108,255,0.22)] transition hover:-translate-y-0.5"
              >
                Book a Class
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
