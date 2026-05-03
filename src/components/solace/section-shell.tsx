import type { ReactNode } from "react";

import { PlayfulOrb } from "@/components/solace/youthful-ui";

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
      className={`fade-up relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 ${
        inverted
          ? "border border-[#1e3a8a]/10 bg-[linear-gradient(135deg,#111827_0%,#1d4ed8_52%,#0f766e_100%)] text-white shadow-[0_28px_70px_rgba(29,78,216,0.2)]"
          : "border border-[#e6ecf5] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,255,0.96)_100%)] shadow-[0_24px_64px_rgba(59,108,255,0.08)]"
      }`}
    >
      {!inverted ? (
        <>
          <PlayfulOrb className="-left-8 top-8 h-28 w-28" color="blue" />
          <PlayfulOrb className="right-8 top-6 h-24 w-24" color="purple" />
          <PlayfulOrb className="bottom-2 right-16 h-20 w-20" color="yellow" />
        </>
      ) : null}
      <div className="max-w-3xl space-y-3">
        {eyebrow ? (
          <p
            className={`text-xs font-semibold uppercase tracking-[0.3em] ${
              inverted ? "text-white/70" : "text-[#3B6CFF]"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p
            className={`max-w-2xl text-base leading-7 ${
              inverted ? "text-white/78" : "text-[#5B6472]"
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
