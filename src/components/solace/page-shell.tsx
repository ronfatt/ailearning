import type { ReactNode } from "react";

import { SolaceLandingHeader } from "@/components/solace/landing-header";
import { SolaceSiteFooter } from "@/components/solace/site-footer";

type SolacePageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
};

export function SolacePageShell({
  eyebrow,
  title,
  description,
  aside,
  children,
}: SolacePageShellProps) {
  return (
    <div className="solace-page solace-grid-lines min-h-screen">
      <SolaceLandingHeader />
      <main className="solace-shell flex flex-col gap-12 lg:gap-14">
        <section className="solace-panel fade-up overflow-hidden rounded-[2.2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.62fr_0.38fr] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-[var(--solace-line)] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--solace-primary)]">
                {eyebrow}
              </div>
              <h1 className="solace-serif max-w-4xl text-5xl leading-[0.95] text-[var(--solace-ink)] sm:text-6xl lg:text-[4.6rem]">
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--solace-ink-soft)]">
                {description}
              </p>
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
