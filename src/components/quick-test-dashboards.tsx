"use client";

import Link from "next/link";

export const dashboardLinks = [
  {
    title: "Student (Aina)",
    detail: "Homework, revision, and AI study assistant",
    href: "/student",
    accent:
      "bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] text-white shadow-[0_18px_42px_rgba(59,108,255,0.2)]",
  },
  {
    title: "Parent (Nur Aina)",
    detail: "Reports, attendance, and tutor feedback",
    href: "/parent",
    accent:
      "bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)] text-white shadow-[0_18px_42px_rgba(32,201,151,0.18)]",
  },
  {
    title: "Tutor (Farah)",
    detail: "Live class workflow and approvals",
    href: "/tutor",
    accent:
      "bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)] text-white shadow-[0_18px_42px_rgba(124,92,255,0.18)]",
  },
  {
    title: "Admin",
    detail: "Intake, enrolment, and platform oversight",
    href: "/admin",
    accent:
      "bg-[linear-gradient(135deg,#111827_0%,#3B6CFF_100%)] text-white shadow-[0_18px_42px_rgba(17,24,39,0.18)]",
  },
];

export function QuickTestHeaderLinks() {
  return (
    <div className="border-t border-[#e6ecf5] bg-white/72">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-6 py-3 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-[96px] xl:px-[120px]">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-[#dbe7ff] bg-[#eef4ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3B6CFF]">
            Quick test
          </div>
          <p className="text-sm text-[#5B6472]">
            Open the Aina Sofia demo case across student, parent, tutor, and admin views.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {dashboardLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5 hover:border-[#7C5CFF] hover:text-[#3B6CFF]"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuickTestDashboards() {
  return (
    <section className="rounded-[2rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] p-5 shadow-[0_20px_52px_rgba(59,108,255,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3B6CFF]">
            Quick test access
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#111827]">
            Open the dashboards directly
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5B6472]">
            Temporary local preview access for checking student, parent, and tutor flows without extra setup.
          </p>
        </div>
        <div className="rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5B6472]">
          Local testing only
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {dashboardLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-[1.7rem] p-5 transition hover:-translate-y-1 ${item.accent}`}
          >
            <p className="text-lg font-semibold">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-white/86">{item.detail}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
              Open now
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
