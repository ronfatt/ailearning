import Link from "next/link";

import { demoCase, type DemoRole } from "@/lib/demo-case";

const roleOrder: DemoRole[] = ["student", "parent", "tutor", "admin"];

const accentClasses: Record<DemoRole, string> = {
  student:
    "border-[#cfe0ff] bg-[linear-gradient(135deg,rgba(59,108,255,0.12)_0%,rgba(18,207,243,0.12)_100%)] text-[#2049b8]",
  parent:
    "border-[#c8f1e5] bg-[linear-gradient(135deg,rgba(32,201,151,0.12)_0%,rgba(18,207,243,0.12)_100%)] text-[#12785d]",
  tutor:
    "border-[#ded5ff] bg-[linear-gradient(135deg,rgba(124,92,255,0.12)_0%,rgba(59,108,255,0.12)_100%)] text-[#5a3fd1]",
  admin:
    "border-[#cfd7f5] bg-[linear-gradient(135deg,rgba(17,24,39,0.1)_0%,rgba(59,108,255,0.12)_100%)] text-[#223465]",
};

export function DemoCasePlaybook({ role }: { role: DemoRole }) {
  const current = demoCase[role];
  const otherRoles = roleOrder.filter((item) => item !== role);
  const currentJourneyStep =
    demoCase.journey.find((item) => item.role === role)?.step ?? null;
  const currentJourneyIndex = demoCase.journey.findIndex((item) => item.role === role);
  const previousJourneyStep =
    currentJourneyIndex > 0 ? demoCase.journey[currentJourneyIndex - 1] : null;
  const nextJourneyStep =
    currentJourneyIndex >= 0 && currentJourneyIndex < demoCase.journey.length - 1
      ? demoCase.journey[currentJourneyIndex + 1]
      : null;

  return (
    <section className="rounded-[2rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] p-6 shadow-[0_18px_48px_rgba(59,108,255,0.08)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-[#dbe7ff] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3B6CFF]">
              Demo case
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${accentClasses[role]}`}>
              {current.dashboardLabel}
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#111827]">
            {demoCase.student.name} · {demoCase.className}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5B6472]">
            This local preview follows one real sample learning loop across student, parent,
            and tutor dashboards. The current role is{" "}
            <span className="font-semibold text-[#111827]">{current.name}</span>, and the main
            focus this week is <span className="font-semibold text-[#111827]">{demoCase.focus}</span>.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[#dbe7ff] bg-white/92 px-5 py-4 text-sm leading-7 text-[#5B6472]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3B6CFF]">
            Optional seeded login
          </p>
          <p className="mt-2">
            Email: <span className="font-semibold text-[#111827]">{current.loginHint}</span>
          </p>
          <p>
            Password: <span className="font-semibold text-[#111827]">{demoCase.passwordHint}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-[#dbe7ff] bg-white/92 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3B6CFF]">
            What to test here
          </p>
          <p className="mt-3 text-sm font-semibold text-[#111827]">{current.goal}</p>
          <div className="mt-4 space-y-3">
            {current.whatToCheck.map((item) => (
              <p
                key={item}
                className="rounded-2xl bg-[#f6faff] px-4 py-3 text-sm leading-7 text-[#5B6472]"
              >
                {item}
              </p>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-[#dbe7ff] bg-white/92 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3B6CFF]">
            Switch role in one click
          </p>
          <div className="mt-4 grid gap-3">
            {otherRoles.map((otherRole) => {
              const item = demoCase[otherRole];

              return (
                <Link
                  key={otherRole}
                  href={item.href}
                  className="rounded-[1.35rem] border border-[#dbe7ff] bg-[#f8fbff] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#7C5CFF] hover:bg-white"
                >
                  <p className="text-sm font-semibold text-[#111827]">{item.dashboardLabel}</p>
                  <p className="mt-1 text-sm leading-6 text-[#5B6472]">
                    Open {item.name}&apos;s view of the same learning cycle.
                  </p>
                </Link>
              );
            })}
          </div>
        </article>
      </div>

      <article className="mt-4 rounded-[1.75rem] border border-[#dbe7ff] bg-white/92 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3B6CFF]">
              Suggested walkthrough
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5B6472]">
              Follow this order to demonstrate one complete learning cycle from ops setup to
              parent visibility.
            </p>
          </div>
          {currentJourneyStep ? (
            <div className={`rounded-full border px-4 py-2 text-xs font-semibold ${accentClasses[role]}`}>
              You are on step {currentJourneyStep}
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          {demoCase.journey.map((step) => {
            const isCurrent = step.role === role;

            return (
              <Link
                key={step.id}
                href={step.href}
                className={`rounded-[1.5rem] border px-4 py-4 transition hover:-translate-y-0.5 ${
                  isCurrent
                    ? `${accentClasses[role]} shadow-[0_14px_30px_rgba(59,108,255,0.12)]`
                    : "border-[#dbe7ff] bg-[#f8fbff] hover:border-[#7C5CFF] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-current/20 bg-white/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Step {step.step}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5B6472]">
                    {demoCase[step.role].dashboardLabel.replace(" demo", "")}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#111827]">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5B6472]">{step.summary}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-[#dbe7ff] bg-[#f8fbff] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
              Guided demo controls
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5B6472]">
              Move through the same case step by step, from operations to teaching to student and parent visibility.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {previousJourneyStep ? (
              <Link
                href={previousJourneyStep.href}
                className="rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5 hover:border-[#7C5CFF] hover:text-[#3B6CFF]"
              >
                Previous: {demoCase[previousJourneyStep.role].dashboardLabel.replace(" demo", "")}
              </Link>
            ) : null}
            {nextJourneyStep ? (
              <Link
                href={nextJourneyStep.href}
                className="rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,108,255,0.18)] transition hover:-translate-y-0.5"
              >
                Next step: {demoCase[nextJourneyStep.role].dashboardLabel.replace(" demo", "")}
              </Link>
            ) : (
              <Link
                href="/"
                className="rounded-full bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(32,201,151,0.18)] transition hover:-translate-y-0.5"
              >
                Back to landing page
              </Link>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
