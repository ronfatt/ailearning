export function SolaceHeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -left-8 top-10 h-36 w-36 rounded-full bg-[rgba(183,154,102,0.18)] blur-3xl" />
      <div className="absolute -right-6 top-24 h-40 w-40 rounded-full bg-[rgba(71,101,95,0.16)] blur-3xl" />

      <div className="solace-panel relative overflow-hidden rounded-[2rem] p-4">
        <div className="solace-gradient-card grid gap-4 rounded-[1.7rem] border border-[var(--solace-line)] p-4">
          <div className="rounded-[1.5rem] bg-[var(--solace-primary)] p-6 text-white shadow-[0_18px_46px_rgba(23,63,58,0.24)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                  Daily check-in
                </p>
                <p className="mt-3 text-3xl font-semibold">How are you arriving today?</p>
              </div>
              <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-[#f1dec2]">
                Private by design
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Energy", "Low"],
                ["Stress", "Elevated"],
                ["Support plan", "Ready"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/52">{label}</p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.4rem] bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/52">
                Support note
              </p>
              <p className="mt-2 text-sm leading-7 text-white/78">
                You seem emotionally stretched. Let&apos;s slow things down, notice the pressure points, and find the next steady step.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.4rem] border border-[var(--solace-line)] bg-white p-5">
              <p className="text-sm font-semibold text-[var(--solace-ink)]">
                This week&apos;s rhythm
              </p>
              <div className="mt-4 flex h-24 items-end gap-2">
                {[56, 72, 48, 84, 62, 90, 74].map((value) => (
                  <div
                    key={value}
                    className="flex-1 rounded-t-2xl bg-[linear-gradient(180deg,#96b0a8_0%,#173f3a_100%)]"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-[var(--solace-line)] bg-white p-5">
              <p className="text-sm font-semibold text-[var(--solace-ink)]">
                Support surfaces
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Daily emotional check-ins",
                  "Weekly reflection summaries",
                  "Coach booking when human support is needed",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-[var(--solace-fog)] px-4 py-3 text-sm font-medium text-[var(--solace-ink)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
