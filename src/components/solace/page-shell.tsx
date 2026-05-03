import type { ReactNode } from "react";

import { SolaceLandingHeader } from "@/components/solace/landing-header";
import { SolaceSiteFooter } from "@/components/solace/site-footer";
import { PlayfulOrb } from "@/components/solace/youthful-ui";

type SolacePageShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
  actions?: ReactNode;
  highlights?: string[];
  heroColumnsClassName?: string;
  heroPanelClassName?: string;
  children: ReactNode;
};

export function SolacePageShell({
  eyebrow,
  title,
  description,
  aside,
  actions,
  highlights,
  heroColumnsClassName,
  heroPanelClassName,
  children,
}: SolacePageShellProps) {
  return (
    <div className="solace-page solace-grid-lines min-h-screen">
      <SolaceLandingHeader />
      <main className="solace-shell flex flex-col gap-12 lg:gap-14">
        <section
          className={`solace-panel fade-up relative overflow-hidden rounded-[2.2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 transition-shadow duration-300 ${heroPanelClassName ?? ""}`}
        >
          <PlayfulOrb className="-left-10 top-6 h-32 w-32" color="blue" />
          <PlayfulOrb className="right-10 top-8 h-28 w-28" color="purple" />
          <PlayfulOrb className="bottom-0 left-1/3 h-24 w-24" color="yellow" />
          <div
            className={`grid gap-8 lg:items-end ${
              heroColumnsClassName ?? "lg:grid-cols-[0.62fr_0.38fr]"
            }`}
          >
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-[var(--solace-line)] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--solace-primary)]">
                {eyebrow}
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight text-[var(--solace-ink)] sm:text-6xl lg:text-[4.7rem]">
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-7 text-[var(--solace-ink-soft)]">
                {description}
              </p>
              {actions ? <div className="flex flex-col gap-4 pt-1 sm:flex-row">{actions}</div> : null}
              {highlights?.length ? (
                <div className="flex flex-wrap gap-3 pt-1">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="solace-soft-pill rounded-full border border-[var(--solace-line)] bg-white/92 px-4 py-2 text-sm font-semibold text-[var(--solace-ink-soft)] shadow-[0_12px_26px_rgba(79,124,255,0.08)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {aside ? <div>{aside}</div> : null}
          </div>
        </section>

        {children}

        <SolaceSiteFooter />
      </main>
    </div>
  );
}
