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
      className={`grid gap-8 rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-12 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      } solace-panel`}
    >
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--solace-primary)]">
          {eyebrow}
        </p>
        <h3 className="solace-serif text-4xl leading-[1.04] text-[var(--solace-ink)]">
          {title}
        </h3>
        <p className="max-w-xl text-base leading-8 text-[var(--solace-ink-soft)]">
          {description}
        </p>
        <div className="grid gap-3 pt-2">
          {bullets.map((bullet) => (
            <div
              key={bullet}
              className="rounded-[1.4rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] px-4 py-4 text-sm font-medium leading-7 text-[var(--solace-ink)]"
            >
              {bullet}
            </div>
          ))}
        </div>
      </div>

      <div>{visual}</div>
    </section>
  );
}
