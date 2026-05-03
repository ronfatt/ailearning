import Image from "next/image";

function FloatingCard({
  title,
  body,
  accent,
  className,
}: {
  title: string;
  body: string;
  accent: string;
  className: string;
}) {
  return (
    <div
      className={`absolute rounded-[1.35rem] border border-white/80 bg-white/94 px-4 py-3 shadow-[0_18px_42px_rgba(59,108,255,0.14)] backdrop-blur-sm ${className}`}
    >
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${accent}`}>
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#111827]">{body}</p>
    </div>
  );
}

function GlowChip({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div
      className={`absolute rounded-full border border-white/70 bg-white/92 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[#334155] shadow-[0_14px_30px_rgba(59,108,255,0.12)] backdrop-blur-sm ${className}`}
    >
      {label}
    </div>
  );
}

export function ProductHeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-[#12cff3]/20 blur-3xl" />
      <div className="absolute right-8 top-10 h-32 w-32 rounded-full bg-[#7c5cff]/12 blur-3xl" />
      <div className="absolute bottom-0 left-24 h-28 w-28 rounded-full bg-[#ffd166]/16 blur-3xl" />
      <div className="absolute right-20 bottom-2 h-24 w-24 rounded-full bg-[#20c997]/18 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2.4rem] border border-[#e6ecf5] bg-[radial-gradient(circle_at_20%_10%,rgba(18,207,243,0.12),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(124,92,255,0.1),transparent_26%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5 shadow-[0_34px_90px_rgba(59,108,255,0.16)]">
        <div className="relative min-h-[540px] overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_24%,rgba(59,108,255,0.10),transparent_28%),linear-gradient(180deg,#fbfdff_0%,#eef6ff_100%)]">
          <div className="absolute inset-0">
            <Image
              src="https://images.pexels.com/photos/4261790/pexels-photo-4261790.jpeg?cs=srgb&dl=pexels-august-de-richelieu-4261790.jpg&fm=jpg"
              alt="Student attending an online lesson and writing notes at a laptop"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,251,255,0.04)_0%,rgba(15,23,42,0.08)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(238,246,255,0.88)_100%)]" />
          </div>

          <GlowChip label="STUDENT AI BUDDY" className="left-1/2 top-5 -translate-x-1/2" />
          <GlowChip label="ONLINE + OFFLINE TUITION" className="left-8 top-[7.25rem]" />
          <GlowChip label="TUTOR-LED FOLLOW-UP" className="right-8 top-[5.5rem]" />

          <FloatingCard
            title="AI Study Buddy"
            body="Let’s revise algebra in 10 minutes."
            accent="text-[#3B6CFF]"
            className="left-5 top-24 max-w-[13.5rem]"
          />
          <FloatingCard
            title="Parent Report"
            body="Homework: Done · Progress: +18%"
            accent="text-[#20C997]"
            className="right-5 top-24 max-w-[13rem]"
          />
          <FloatingCard
            title="Teacher Insight"
            body="Weak topic detected: Fractions"
            accent="text-[#12CFF3]"
            className="left-6 bottom-24 max-w-[13rem]"
          />
          <FloatingCard
            title="Reward"
            body="7-day streak · 120 XP earned"
            accent="text-[#FF6B6B]"
            className="right-6 bottom-12 max-w-[13rem]"
          />
        </div>
      </div>
    </div>
  );
}
