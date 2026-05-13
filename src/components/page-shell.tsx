import type { ReactNode } from "react";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SignOutButton } from "@/components/sign-out-button";

type PageShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  visual?: ReactNode;
  eyebrow?: string;
  variant?: "default" | "workspace";
  workspaceRole?: "student" | "parent" | "tutor" | "admin";
  workspaceUserName?: string;
  workspaceTabs?: string[];
  workspaceSearchPlaceholder?: string;
  rightRail?: ReactNode;
  children: ReactNode;
};

const workspaceRoleConfig = {
  student: {
    brand: "Student hub",
    nav: [
      { label: "Today", href: "#overview" },
      { label: "Progress", href: "#progress-overview" },
      { label: "Homework", href: "#assigned-homework" },
      { label: "Activity", href: "#learning-history" },
      { label: "AI helper", href: "#assistant" },
    ],
    accent: "from-[#3B6CFF] via-[#4F7CFF] to-[#7C5CFF]",
    status: "Learning active",
    supportCopy: "Homework, revision, and class prep in one place.",
    railStats: [
      { label: "Focus", value: "3 tasks" },
      { label: "Streak", value: "7 days" },
    ],
  },
  parent: {
    brand: "Parent hub",
    nav: [
      { label: "This week", href: "#overview" },
      { label: "Progress", href: "#progress-overview" },
      { label: "Summary", href: "#weekly-summary" },
      { label: "Homework", href: "#homework-feedback" },
      { label: "Activity", href: "#learning-history" },
    ],
    accent: "from-[#20C997] via-[#12CFF3] to-[#3B6CFF]",
    status: "Reports live",
    supportCopy: "Track progress, notes, and what to support next.",
    railStats: [
      { label: "Reports", value: "Weekly" },
      { label: "Follow-up", value: "2 items" },
    ],
  },
  tutor: {
    brand: "Tutor hub",
    nav: [
      { label: "Today", href: "#overview" },
      { label: "Live class", href: "#live-workspace" },
      { label: "Reviews", href: "#homework-reviews" },
      { label: "Approvals", href: "#approval-center" },
      { label: "Follow-up", href: "#after-class-follow-up" },
    ],
    accent: "from-[#4F7CFF] via-[#7C5CFF] to-[#8B5CF6]",
    status: "Classroom ready",
    supportCopy: "Run classes, reviews, and follow-up from one hub.",
    railStats: [
      { label: "Queue", value: "Live" },
      { label: "Follow-up", value: "Today" },
    ],
  },
  admin: {
    brand: "Admin hub",
    nav: [
      { label: "Today", href: "#overview" },
      { label: "Intake", href: "#intake-funnel" },
      { label: "Class health", href: "#class-health" },
      { label: "Hotspots", href: "#curriculum-hotspots" },
      { label: "Approvals", href: "#approval-workflow" },
    ],
    accent: "from-[#0F766E] via-[#14B8A6] to-[#3B82F6]",
    status: "Ops active",
    supportCopy: "Triage intake, clear blockers, and watch learning risk from one view.",
    railStats: [
      { label: "Ops", value: "Live" },
      { label: "Queues", value: "Today" },
    ],
  },
} as const;

export function PageShell({
  title,
  description,
  action,
  visual,
  eyebrow = "Teacher-Led Tuition OS",
  variant = "default",
  workspaceRole,
  workspaceUserName,
  workspaceTabs,
  workspaceSearchPlaceholder = "Search classes, topics, reports, or tasks...",
  rightRail,
  children,
}: PageShellProps) {
  if (variant === "workspace" && workspaceRole) {
    const roleConfig = workspaceRoleConfig[workspaceRole];

    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9ff_0%,#eef4ff_100%)] text-[#111827]">
        <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <aside className="hidden w-[240px] shrink-0 lg:flex">
            <div className={`flex min-h-[calc(100vh-3rem)] w-full flex-col rounded-[2rem] bg-gradient-to-b ${roleConfig.accent} p-5 text-white shadow-[0_30px_80px_rgba(59,108,255,0.24)]`}>
              <Link href="/" className="flex items-center gap-3 rounded-[1.4rem] bg-white/14 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-semibold tracking-[0.24em] text-[#3B6CFF]">
                  AI
                </div>
                <div>
                  <p className="text-lg font-semibold leading-none">AI Learning OS</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/70">
                    {roleConfig.brand}
                  </p>
                </div>
              </Link>

              <nav className="mt-8 space-y-2">
                {roleConfig.nav.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium transition ${
                      index === 0
                        ? "bg-white/18 text-white shadow-[0_14px_32px_rgba(17,24,39,0.14)]"
                        : "text-white/80 hover:bg-white/12 hover:text-white"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/16 text-xs font-semibold">
                      {index + 1}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-3">
                <Link
                  href="/"
                  className="block rounded-[1.2rem] border border-white/18 bg-white/10 px-4 py-3 text-sm font-medium text-white/86 transition hover:bg-white/16"
                >
                  Return to landing page
                </Link>
                <div className="[&_button]:w-full [&_button]:justify-center [&_button]:border-white/18 [&_button]:bg-white/10 [&_button]:text-white [&_button]:hover:border-white/36 [&_button]:hover:text-white">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
              <div className="min-w-0 space-y-6">
                <div className="rounded-[1.8rem] border border-[#e6ecf5] bg-white/88 p-4 shadow-[0_18px_46px_rgba(79,124,255,0.08)]">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-center gap-3 rounded-full bg-[#f7f9ff] px-4 py-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef4ff] text-[#3B6CFF]">
                        ⌕
                      </span>
                      <span className="truncate text-sm font-medium text-[#7b8597]">
                        {workspaceSearchPlaceholder}
                      </span>
                    </div>
                    {workspaceTabs?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {workspaceTabs.map((tab, index) => (
                          <button
                            key={tab}
                            type="button"
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                              index === 0
                                ? "bg-[#3B6CFF] text-white shadow-[0_12px_26px_rgba(59,108,255,0.18)]"
                                : "border border-[#e6ecf5] bg-white text-[#6B7280] hover:border-[#cfe0ff] hover:text-[#3B6CFF]"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <section id="overview" className={`overflow-hidden rounded-[2.2rem] bg-gradient-to-br ${roleConfig.accent} p-8 text-white shadow-[0_28px_80px_rgba(59,108,255,0.2)]`}>
                  <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                    <div className="space-y-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">
                        {eyebrow}
                      </p>
                      <div className="space-y-3">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                          {title}
                        </h1>
                        <p className="max-w-2xl text-base leading-8 text-white/82">
                          {description}
                        </p>
                      </div>
                      {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
                    </div>
                    {visual ? <div className="xl:pl-4">{visual}</div> : null}
                  </div>
                </section>

                {children}
              </div>

              <aside className="space-y-6">
                <div className="overflow-hidden rounded-[2rem] border border-[#dbe7ff] bg-white/94 shadow-[0_20px_48px_rgba(79,124,255,0.1)]">
                  <div className={`bg-gradient-to-br ${roleConfig.accent} p-5 text-white`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/18 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(17,24,39,0.18)]">
                          {(workspaceUserName ?? workspaceRole).slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {workspaceUserName ?? title}
                          </p>
                          <p className="text-sm text-white/76">{roleConfig.brand}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/16 text-sm text-white">
                          ⎈
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/16 text-sm text-white">
                          ✦
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="rounded-full bg-white/14 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/88">
                        {roleConfig.status}
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/66">
                        Workspace
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <p className="text-sm leading-7 text-[#6B7280]">{roleConfig.supportCopy}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {roleConfig.railStats.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[1.2rem] border border-[#e8eef8] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] p-4"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#111827]">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {rightRail}
              </aside>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-grid min-h-screen solace-page">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-6 py-8 sm:px-10 lg:px-[96px] lg:py-10 xl:px-[120px]">
        <section className="landing-hero solace-hero-glow fade-up rounded-[2.3rem] border border-[#dbe7ff] p-8 sm:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
            <div className="flex flex-col gap-6">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3B6CFF]">
                  {eyebrow}
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[#5B6472]">
                  {description}
                </p>
              </div>
              {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
            </div>

            {visual ? (
              <div className="xl:pl-4">{visual}</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Live classes", "Teacher-led learning, online or offline."],
                  ["AI follow-up", "Revision, homework, and insights after class."],
                  ["Parent visibility", "Reports, attendance, and next focus in one place."],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="solace-lift rounded-[1.5rem] border border-[#dbe7ff] bg-white/88 p-5 shadow-[0_14px_36px_rgba(59,108,255,0.08)]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
                      {label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#5B6472]">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}
