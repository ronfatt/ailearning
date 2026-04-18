type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "teal" | "gold" | "coral";
};

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  teal: "bg-teal-soft text-teal",
  gold: "bg-gold-soft text-[#8b5a13]",
  coral: "bg-[#f8d2c7] text-coral",
};

export function MetricCard({
  label,
  value,
  detail,
  tone = "teal",
}: MetricCardProps) {
  return (
    <article className="glass-panel rounded-[1.75rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
          Live MVP
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-muted">{detail}</p>
    </article>
  );
}
