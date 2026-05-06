type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "teal" | "gold" | "coral";
};

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  teal: "from-[#3B6CFF] to-[#12CFF3] text-white",
  gold: "from-[#FFD166] to-[#FF9F1C] text-[#111827]",
  coral: "from-[#FB7185] to-[#F97316] text-white",
};

const toneLabelClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  teal: "text-white/88",
  gold: "text-[#111827]/80",
  coral: "text-white/88",
};

export function MetricCard({
  label,
  value,
  detail,
  tone = "teal",
}: MetricCardProps) {
  return (
    <article className="solace-lift overflow-hidden rounded-[1.75rem] border border-[#dbe7ff] bg-white/96 shadow-[0_18px_42px_rgba(59,108,255,0.08)]">
      <div className={`bg-gradient-to-r ${toneClasses[tone]} p-5`}>
        <div>
          <p className={`text-sm font-medium ${toneLabelClasses[tone]}`}>{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-inherit">
            {value}
          </p>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <p className="text-sm leading-7 text-[#5B6472]">{detail}</p>
        <div className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#3B6CFF]">
          Live
        </div>
      </div>
    </article>
  );
}
