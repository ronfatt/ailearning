type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "teal" | "gold" | "coral";
};

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  teal: "bg-[#eef4ff] text-[#3B6CFF]",
  gold: "bg-[#fff4d6] text-[#c27b00]",
  coral: "bg-[#fff0f3] text-[#fb7185]",
};

export function MetricCard({
  label,
  value,
  detail,
  tone = "teal",
}: MetricCardProps) {
  return (
    <article className="solace-lift rounded-[1.75rem] border border-[#dbe7ff] bg-white/92 p-6 shadow-[0_18px_42px_rgba(59,108,255,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5B6472]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#111827]">
            {value}
          </p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
          Live data
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-[#5B6472]">{detail}</p>
    </article>
  );
}
