import type { ReactNode } from "react";

type FeatureSpotlightProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  visual: ReactNode;
  reverse?: boolean;
};

export function FeatureSpotlight({
  id,
  eyebrow,
  title,
  description,
  bullets,
  visual,
  reverse = false,
}: FeatureSpotlightProps) {
  return (
    <section
      id={id}
      className={`grid gap-8 overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-12 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      } solace-panel`}
    >
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--solace-primary)]">
          {eyebrow}
        </p>
        <h3 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight text-[var(--solace-ink)]">
          {title}
        </h3>
        <p className="max-w-xl text-base leading-7 text-[var(--solace-ink-soft)]">
          {description}
        </p>
        <div className="grid gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-1">
          {bullets.map((bullet, index) => (
            <div
              key={bullet}
              className="solace-lift rounded-[1.4rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] px-4 py-4 shadow-[0_10px_24px_rgba(59,108,255,0.06)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-medium leading-7 text-[var(--solace-ink)]">
                  {bullet}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>{visual}</div>
    </section>
  );
}
