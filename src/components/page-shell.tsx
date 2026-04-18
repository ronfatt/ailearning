import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";

type PageShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
};

export function PageShell({
  title,
  description,
  action,
  eyebrow = "Teacher-Led Tuition OS",
  children,
}: PageShellProps) {
  return (
    <div className="page-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="glass-panel fade-up rounded-[2rem] p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
                {eyebrow}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">{description}</p>
            </div>
            {action}
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}
