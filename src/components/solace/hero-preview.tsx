const roleCards = [
  { label: "Student AI Study Buddy", tone: "from-[#4f46e5] to-[#7c3aed]" },
  { label: "Tutor Command Center", tone: "from-[#0284c7] to-[#06b6d4]" },
  { label: "Parent Progress Report", tone: "from-[#f97316] to-[#fb7185]" },
];

const badges = ["7-day streak", "Homework done", "Badge unlocked"];

export function SolaceHeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#60a5fa]/30 blur-3xl" />
      <div className="absolute right-0 top-14 h-44 w-44 rounded-full bg-[#a78bfa]/30 blur-3xl" />
      <div className="absolute bottom-6 left-18 h-36 w-36 rounded-full bg-[#fcd34d]/25 blur-3xl" />

      <div className="relative rounded-[2.2rem] border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.95)_0%,rgba(244,249,255,0.92)_45%,rgba(246,244,255,0.96)_100%)] p-4 shadow-[0_36px_90px_rgba(63,94,251,0.16)]">
        <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[1.9rem] bg-[linear-gradient(180deg,#3b82f6_0%,#4f46e5_52%,#7c3aed_100%)] p-5 text-white shadow-[0_24px_56px_rgba(79,70,229,0.28)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/68">
                  Student App
                </p>
                <h3 className="mt-2 text-2xl font-semibold">AI Study Buddy</h3>
              </div>
              <div className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                Live class tonight
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="max-w-[85%] rounded-[1.4rem] rounded-bl-md bg-white/18 px-4 py-3 text-sm leading-6 text-white/92">
                I keep missing algebra word problems. Can we practise 3 more?
              </div>
              <div className="ml-auto max-w-[82%] rounded-[1.4rem] rounded-br-md bg-white px-4 py-3 text-sm font-medium leading-6 text-[#2f3dff]">
                Sure. Let&apos;s revise the weak topic your tutor approved after class.
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["Weak topic", "Word Problems"],
                ["Homework", "2 tasks"],
                ["Reward", "+120 XP"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.25rem] bg-white/14 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/65">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className="rounded-full bg-white/16 px-3 py-2 text-xs font-semibold text-white"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.7rem] border border-[#dbe6ff] bg-white p-4 shadow-[0_18px_44px_rgba(16,24,40,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#3b82f6]">
                    Tutor Dashboard
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#10223e]">
                    Readiness before class
                  </p>
                </div>
                <div className="rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-semibold text-[#0369a1]">
                  3 students need support
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[72, 48, 88, 56, 64, 92].map((value, index) => (
                  <div key={`${value}-${index}`} className="rounded-[1.15rem] bg-[#f8fbff] p-3">
                    <div className="h-2 rounded-full bg-[#dbeafe]">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,#06b6d4_0%,#3b82f6_50%,#7c3aed_100%)]"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs font-medium text-[#52617d]">
                      Topic {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[0.92fr_1.08fr]">
              <div className="rounded-[1.7rem] border border-[#ffe2c7] bg-[linear-gradient(180deg,#fff7ed_0%,#fff1f2_100%)] p-4 shadow-[0_18px_44px_rgba(249,115,22,0.08)]">
                <p className="text-xs uppercase tracking-[0.22em] text-[#f97316]">
                  Parent Report
                </p>
                <p className="mt-2 text-lg font-semibold text-[#10223e]">
                  Weekly progress
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Attendance: 100%",
                    "Homework: 2/2 completed",
                    "Next focus: algebra translation",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.1rem] bg-white/86 px-3 py-3 text-sm font-medium text-[#5c4b3b]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-[#d9f99d] bg-[linear-gradient(180deg,#f7fee7_0%,#ecfeff_100%)] p-4 shadow-[0_18px_44px_rgba(14,165,233,0.08)]">
                <p className="text-xs uppercase tracking-[0.22em] text-[#0f766e]">
                  Homework & Rewards
                </p>
                <div className="mt-4 space-y-3">
                  {roleCards.map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-[1.2rem] bg-[linear-gradient(135deg,var(--tw-gradient-from),var(--tw-gradient-to))] px-4 py-4 text-sm font-semibold text-white ${item.tone}`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
