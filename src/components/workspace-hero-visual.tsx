import Image from "next/image";

type WorkspaceHeroVisualProps = {
  role: "student" | "parent" | "tutor" | "admin";
};

const roleConfig = {
  student: {
    image:
      "https://images.pexels.com/photos/4261790/pexels-photo-4261790.jpeg?cs=srgb&dl=pexels-august-de-richelieu-4261790.jpg&fm=jpg",
    alt: "Student studying on a laptop during an online tuition session",
    label: "Student workspace",
    cardTitle: "AI Study Buddy",
    cardText: "Revise algebra in 10 minutes.",
    chipA: "Homework open",
    chipB: "7-day streak",
    glow: "from-[#3B6CFF]/25 via-[#12CFF3]/20 to-white/0",
    accent: "text-[#3B6CFF]",
  },
  parent: {
    image:
      "https://images.pexels.com/photos/27178163/pexels-photo-27178163.jpeg?cs=srgb&dl=pexels-helenalopes-27178163.jpg&fm=jpg",
    alt: "Parent checking a learning report on a laptop at home",
    label: "Parent portal",
    cardTitle: "Progress Report",
    cardText: "Homework done · Progress +18%",
    chipA: "Weekly summary",
    chipB: "Attendance ready",
    glow: "from-[#20C997]/20 via-[#12CFF3]/18 to-white/0",
    accent: "text-[#20C997]",
  },
  tutor: {
    image:
      "https://images.pexels.com/photos/5212655/pexels-photo-5212655.jpeg?cs=srgb&dl=pexels-max-fischer-5212655.jpg&fm=jpg",
    alt: "Tutor guiding a student through a laptop lesson",
    label: "Tutor workspace",
    cardTitle: "Teacher Insight",
    cardText: "Weak topic detected: fractions",
    chipA: "Live class tools",
    chipB: "Follow-up queue",
    glow: "from-[#7C5CFF]/24 via-[#3B6CFF]/18 to-white/0",
    accent: "text-[#7C5CFF]",
  },
  admin: {
    image:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?cs=srgb&dl=pexels-fauxels-3183150.jpg&fm=jpg",
    alt: "Operations team reviewing data together on laptops",
    label: "Admin workspace",
    cardTitle: "Operations View",
    cardText: "Intake, enrolment, and approvals in one place.",
    chipA: "Enrolment queue",
    chipB: "Centre oversight",
    glow: "from-[#111827]/18 via-[#3B6CFF]/16 to-white/0",
    accent: "text-[#223465]",
  },
} as const;

export function WorkspaceHeroVisual({ role }: WorkspaceHeroVisualProps) {
  const config = roleConfig[role];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#dbe7ff] bg-white/88 p-3 shadow-[0_20px_52px_rgba(59,108,255,0.12)]">
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(18,207,243,0.16),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(124,92,255,0.14),transparent_24%),linear-gradient(180deg,#fbfdff_0%,#eef6ff_100%)]`}
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${config.glow}`} />
      <div className="relative overflow-hidden rounded-[1.6rem] border border-[#e6ecf5]">
        <div className="relative h-[280px] bg-[#eef5ff] sm:h-[320px]">
          <Image
            src={config.image}
            alt={config.alt}
            fill
            sizes="(min-width: 1024px) 32vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(15,23,42,0.16)_100%)]" />

          <div className="solace-hero-glow float-soft absolute left-4 top-4 rounded-full border border-white/80 bg-white/92 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
            {config.label}
          </div>

          <div className="solace-hero-glow float-soft absolute right-4 top-16 max-w-[14rem] rounded-[1.2rem] border border-white/80 bg-white/94 px-4 py-3">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${config.accent}`}>
              {config.cardTitle}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#111827]">
              {config.cardText}
            </p>
          </div>

          <div className="solace-hero-glow float-soft absolute left-4 bottom-4 rounded-[1.2rem] border border-white/80 bg-white/94 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
              Quick signal
            </p>
            <p className="mt-2 text-sm font-semibold text-[#111827]">{config.chipA}</p>
          </div>

          <div className="solace-hero-glow float-soft absolute right-4 bottom-4 rounded-[1.2rem] border border-white/80 bg-white/94 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF6B6B]">
              Focus
            </p>
            <p className="mt-2 text-sm font-semibold text-[#111827]">{config.chipB}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
