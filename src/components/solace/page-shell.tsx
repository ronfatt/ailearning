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
  heroVariant?: "default" | "stage";
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
  heroVariant = "default",
  children,
}: SolacePageShellProps) {
  const isStageHero = heroVariant === "stage";

  return (
    <div className="solace-page solace-grid-lines min-h-screen">
      {isStageHero ? null : <SolaceLandingHeader />}
      <main className="solace-shell flex flex-col gap-12 lg:gap-14">
        <section
          className={`solace-panel fade-up relative overflow-hidden transition-shadow duration-300 ${
            isStageHero
              ? "min-h-[680px] rounded-[3rem] border border-[#6fa8ff] bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.16),transparent_18%),radial-gradient(circle_at_80%_16%,rgba(255,255,255,0.12),transparent_16%),linear-gradient(180deg,#4f9aff_0%,#377dff_38%,#2867db_100%)] px-6 pb-10 pt-6 shadow-[0_36px_100px_rgba(59,108,255,0.26)] sm:px-8 sm:pt-8 lg:px-12 lg:pb-12 lg:pt-8"
              : "rounded-[2.2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
          } ${heroPanelClassName ?? ""}`}
        >
          {isStageHero ? <SolaceLandingHeader variant="hero" /> : null}
          {isStageHero ? (
            <>
              <div className="absolute left-10 top-40 h-16 w-16 rounded-full border-[7px] border-transparent border-l-white/80 border-t-white/80 opacity-80" />
              <div className="absolute right-14 top-48 text-7xl text-[#ffe066] opacity-95">✦</div>
              <div className="absolute left-14 top-[72%] text-7xl text-[#ffd84d] opacity-95">✺</div>
              <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_42%,transparent_66%)]" />
              <div className="absolute inset-x-0 bottom-0 mx-auto h-[320px] w-[86%] rounded-t-[999px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.08)_46%,transparent_72%)]" />
              <div className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-2xl" />
            </>
          ) : (
            <>
              <PlayfulOrb className="-left-10 top-6 h-32 w-32" color="blue" />
              <PlayfulOrb className="right-10 top-8 h-28 w-28" color="purple" />
              <PlayfulOrb className="bottom-0 left-1/3 h-24 w-24" color="yellow" />
            </>
          )}
          <div
            className={`grid gap-8 lg:items-end ${
              heroColumnsClassName ?? "lg:grid-cols-[0.62fr_0.38fr]"
            } ${isStageHero ? "relative z-10 pt-24 sm:pt-28 lg:pt-36" : ""}`}
          >
            <div className="space-y-5">
              <div
                className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                  isStageHero
                    ? "border border-white/30 bg-white/14 text-white shadow-[0_12px_30px_rgba(25,55,140,0.14)] backdrop-blur-sm"
                    : "border border-[var(--solace-line)] bg-white/72 text-[var(--solace-primary)]"
                }`}
              >
                {eyebrow}
              </div>
              <h1
                className={`max-w-4xl font-semibold tracking-tight ${
                  isStageHero
                    ? "text-5xl leading-[0.94] text-white sm:text-6xl lg:text-[5.1rem]"
                    : "text-5xl leading-[0.95] text-[var(--solace-ink)] sm:text-6xl lg:text-[4.7rem]"
                }`}
              >
                {title}
              </h1>
              <p
                className={`max-w-2xl text-lg ${
                  isStageHero
                    ? "leading-8 text-white/82"
                    : "leading-7 text-[var(--solace-ink-soft)]"
                }`}
              >
                {description}
              </p>
              {actions ? <div className="flex flex-col gap-4 pt-1 sm:flex-row">{actions}</div> : null}
              {highlights?.length ? (
                <div className="flex flex-wrap gap-3 pt-1">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className={`solace-soft-pill rounded-full px-4 py-2 text-sm font-semibold ${
                        isStageHero
                          ? "border border-white/20 bg-white/10 text-white/92 backdrop-blur-sm"
                          : "border border-[var(--solace-line)] bg-white/92 text-[var(--solace-ink-soft)] shadow-[0_12px_26px_rgba(79,124,255,0.08)]"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {aside ? <div className="relative z-10">{aside}</div> : null}
          </div>
        </section>

        {children}

        <SolaceSiteFooter />
      </main>
    </div>
  );
}
