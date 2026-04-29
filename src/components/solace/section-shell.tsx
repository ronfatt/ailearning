import type { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  inverted?: boolean;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  inverted = false,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 ${
        inverted
          ? "border border-[#23453f]/10 bg-[#173f3a] text-white shadow-[0_28px_70px_rgba(21,53,47,0.18)]"
          : "solace-panel"
      }`}
    >
      <div className="max-w-3xl space-y-3">
        {eyebrow ? (
          <p
            className={`text-xs font-semibold uppercase tracking-[0.3em] ${
              inverted ? "text-[#cedfd9]" : "text-[var(--solace-primary)]"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 className="solace-serif text-4xl leading-[1.02] sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p
            className={`max-w-2xl text-base leading-8 ${
              inverted ? "text-white/74" : "text-[var(--solace-ink-soft)]"
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
