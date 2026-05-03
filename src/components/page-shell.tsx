import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";

type PageShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  visual?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
};

export function PageShell({
  title,
  description,
  action,
  visual,
  eyebrow = "Teacher-Led Tuition OS",
  children,
}: PageShellProps) {
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
