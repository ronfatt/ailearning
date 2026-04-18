import Link from "next/link";

import { getAuthenticatedHomePath, getCurrentSession } from "@/lib/auth-session";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Product" },
  { href: "/book-class", label: "Book a Class" },
  { href: "/signup", label: "Sign Up" },
  { href: "/tutor-apply", label: "Tutor Apply" },
];

export async function SiteHeader() {
  const session = await getCurrentSession();

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-sm font-semibold tracking-[0.24em] text-white">
            AI
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">
              Malaysia Teacher-Led Tuition
            </p>
            <p className="text-lg font-semibold text-foreground">AI Learning OS</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 rounded-full border border-border/80 bg-surface-strong/80 p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-teal hover:text-white"
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
                className="hidden rounded-full border border-border bg-white/70 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-teal hover:text-teal md:inline-flex"
              >
                {session.user.onboardingCompleted ? "Open Workspace" : "Finish Setup"}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-border bg-white/70 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-teal hover:text-teal md:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/book-class"
                className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#09443c]"
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
