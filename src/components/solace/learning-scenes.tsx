import Image from "next/image";

function SceneCard({
  title,
  eyebrow,
  accent,
  children,
}: {
  title: string;
  eyebrow: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="solace-lift rounded-[1.9rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5 shadow-[0_18px_42px_rgba(59,108,255,0.1)]">
      <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent}`}>
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-[#111827]">{title}</h3>
      <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-[#e6ecf5] bg-[linear-gradient(180deg,#fbfdff_0%,#eef5ff_100%)]">
        {children}
      </div>
    </div>
  );
}

function OverlayPill({
  title,
  detail,
  tone,
  className,
}: {
  title: string;
  detail: string;
  tone: "blue" | "mint" | "purple" | "yellow" | "coral";
  className: string;
}) {
  const toneClass =
    tone === "blue"
      ? "text-[#3B6CFF]"
      : tone === "mint"
        ? "text-[#20C997]"
        : tone === "purple"
          ? "text-[#7C5CFF]"
          : tone === "yellow"
            ? "text-[#D97706]"
            : "text-[#FF6B6B]";

  return (
    <div
      className={`solace-hero-glow float-soft absolute rounded-[1.1rem] border border-white/80 bg-white/94 px-3 py-2 backdrop-blur-sm ${className}`}
    >
      <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${toneClass}`}>
        {title}
      </p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[#111827]">{detail}</p>
    </div>
  );
}

function PhotoScene({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-[240px] overflow-hidden bg-[#eef5ff]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(15,23,42,0.1)_100%)]" />
      {children}
    </div>
  );
}

export function AudienceSceneGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <SceneCard title="Student AI buddy" eyebrow="Students" accent="text-[#3B6CFF]">
        <PhotoScene
          src="https://images.pexels.com/photos/4261790/pexels-photo-4261790.jpeg?cs=srgb&dl=pexels-august-de-richelieu-4261790.jpg&fm=jpg"
          alt="Student studying on a laptop during an online lesson"
        >
          <OverlayPill
            title="AI Study Buddy"
            detail="Revise algebra in 10 min"
            tone="blue"
            className="left-4 top-4 max-w-[11rem]"
          />
          <OverlayPill
            title="Reward"
            detail="7-day streak"
            tone="coral"
            className="right-4 bottom-4 max-w-[8.5rem]"
          />
        </PhotoScene>
      </SceneCard>

      <SceneCard title="Parent report view" eyebrow="Parents" accent="text-[#20C997]">
        <PhotoScene
          src="https://images.pexels.com/photos/27178163/pexels-photo-27178163.jpeg?cs=srgb&dl=pexels-helenalopes-27178163.jpg&fm=jpg"
          alt="Parent reviewing a laptop at home with a child nearby"
        >
          <OverlayPill
            title="Parent Report"
            detail="Homework done · +18%"
            tone="mint"
            className="left-4 top-4 max-w-[11rem]"
          />
          <OverlayPill
            title="Next focus"
            detail="Fractions"
            tone="yellow"
            className="right-4 bottom-4 max-w-[8rem]"
          />
        </PhotoScene>
      </SceneCard>

      <SceneCard title="Tutor class tools" eyebrow="Tutors" accent="text-[#7C5CFF]">
        <PhotoScene
          src="https://images.pexels.com/photos/5212655/pexels-photo-5212655.jpeg?cs=srgb&dl=pexels-max-fischer-5212655.jpg&fm=jpg"
          alt="Tutor working with a student through a laptop lesson"
        >
          <OverlayPill
            title="Teacher Insight"
            detail="Weak topic: fractions"
            tone="purple"
            className="left-4 top-4 max-w-[11rem]"
          />
          <OverlayPill
            title="Live tools"
            detail="Quiz + prompts"
            tone="blue"
            className="right-4 bottom-4 max-w-[8.5rem]"
          />
        </PhotoScene>
      </SceneCard>
    </div>
  );
}

export function HorizontalLearningStory() {
  return (
    <section className="overflow-hidden rounded-[2.3rem] border border-[#dbe7ff] bg-[linear-gradient(135deg,#ffffff_0%,#eef5ff_46%,#f7fbff_100%)] p-6 shadow-[0_24px_60px_rgba(59,108,255,0.1)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:items-center">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#3B6CFF]">
            Learning flow
          </div>
          <h3 className="text-4xl font-semibold leading-[1.02] tracking-tight text-[#111827] sm:text-5xl">
            From class to practice to parent updates.
          </h3>
          <p className="max-w-xl text-base leading-7 text-[#5B6472]">
            One bright learning flow for students, tutors, and families. Real classes
            stay human. Revision, homework, and follow-up stay connected.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Student", "AI buddy + streaks"],
              ["Tutor", "Prep + faster follow-up"],
              ["Parent", "Clear weekly reports"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="solace-lift rounded-[1.4rem] border border-[#e6ecf5] bg-white/88 px-4 py-4 shadow-[0_12px_28px_rgba(59,108,255,0.06)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
                  {label}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#111827]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[#e6ecf5] bg-[radial-gradient(circle_at_20%_18%,rgba(18,207,243,0.16),transparent_24%),radial-gradient(circle_at_85%_16%,rgba(124,92,255,0.12),transparent_22%),linear-gradient(180deg,#fbfdff_0%,#eef6ff_100%)]">
          <Image
            src="https://images.pexels.com/photos/5212655/pexels-photo-5212655.jpeg?cs=srgb&dl=pexels-max-fischer-5212655.jpg&fm=jpg"
            alt="Tutor and student learning together through a laptop lesson"
            fill
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,251,255,0.06)_0%,rgba(15,23,42,0.12)_100%)]" />
          <div className="solace-hero-glow float-soft absolute left-5 top-5 rounded-full border border-white/80 bg-white/92 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
            LIVE CLASS TO AI REVISION
          </div>
          <div className="solace-hero-glow float-soft absolute right-5 top-16 rounded-[1.2rem] border border-white/80 bg-white/94 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#20C997]">
              Parent report
            </p>
            <p className="mt-2 text-sm font-semibold text-[#111827]">
              Homework done · Focus next: fractions
            </p>
          </div>
          <div className="solace-hero-glow float-soft absolute left-5 bottom-5 rounded-[1.2rem] border border-white/80 bg-white/94 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF6B6B]">
              Reward
            </p>
            <p className="mt-2 text-sm font-semibold text-[#111827]">
              7-day streak · +120 XP
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
