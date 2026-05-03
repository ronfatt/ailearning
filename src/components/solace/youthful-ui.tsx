type GlowBadgeProps = {
  label: string;
  tone?: "blue" | "purple" | "mint" | "yellow" | "coral";
};

const toneClasses: Record<NonNullable<GlowBadgeProps["tone"]>, string> = {
  blue: "border-[#bfdbfe] bg-[#eef4ff] text-[#2f5bff]",
  purple: "border-[#ddd6fe] bg-[#f5f3ff] text-[#7c5cff]",
  mint: "border-[#bbf7d0] bg-[#ecfdf5] text-[#0f9f75]",
  yellow: "border-[#fde68a] bg-[#fffbeb] text-[#ca8a04]",
  coral: "border-[#fecdd3] bg-[#fff1f2] text-[#e11d48]",
};

export function GlowBadge({ label, tone = "blue" }: GlowBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

export function MiniStat({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: string;
  tone?: "blue" | "purple" | "mint" | "yellow" | "coral";
}) {
  const accent =
    tone === "blue"
      ? "from-[#3B6CFF] to-[#12CFF3]"
      : tone === "purple"
        ? "from-[#7C5CFF] to-[#A78BFA]"
        : tone === "mint"
          ? "from-[#20C997] to-[#12CFF3]"
          : tone === "yellow"
            ? "from-[#FFD166] to-[#FB923C]"
            : "from-[#FF6B6B] to-[#FB7185]";

  return (
    <div className="rounded-[1.2rem] border border-[#e6ecf5] bg-white/88 p-3 shadow-[0_10px_24px_rgba(59,108,255,0.08)]">
      <div className={`h-2 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#111827]">{value}</p>
    </div>
  );
}

export function PlayfulOrb({
  className,
  color,
}: {
  className: string;
  color: "blue" | "purple" | "mint" | "yellow" | "coral";
}) {
  const colorClass =
    color === "blue"
      ? "bg-[#3B6CFF]/18"
      : color === "purple"
        ? "bg-[#7C5CFF]/18"
        : color === "mint"
          ? "bg-[#20C997]/18"
          : color === "yellow"
            ? "bg-[#FFD166]/22"
            : "bg-[#FF6B6B]/18";

  return <div className={`absolute rounded-full blur-3xl ${colorClass} ${className}`} />;
}

export function DashboardSpark({
  bars,
  tone = "blue",
}: {
  bars: number[];
  tone?: "blue" | "purple" | "mint";
}) {
  const barClass =
    tone === "blue"
      ? "from-[#3B6CFF] to-[#12CFF3]"
      : tone === "purple"
        ? "from-[#7C5CFF] to-[#a78bfa]"
        : "from-[#20C997] to-[#12CFF3]";

  return (
    <div className="flex items-end gap-2 rounded-[1.4rem] border border-[#e6ecf5] bg-white/88 p-4 shadow-[0_10px_24px_rgba(59,108,255,0.08)]">
      {bars.map((bar, index) => (
        <div key={`${bar}-${index}`} className="flex-1 rounded-full bg-[#eef4ff]">
          <div
            className={`w-full rounded-full bg-gradient-to-t ${barClass}`}
            style={{ height: `${bar}px` }}
          />
        </div>
      ))}
    </div>
  );
}
