type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

export function PricingCard({
  name,
  price,
  description,
  features,
  highlight = false,
}: PricingCardProps) {
  return (
    <article
      className={`rounded-[1.8rem] p-6 ${
        highlight
          ? "border border-[rgba(183,154,102,0.28)] bg-[linear-gradient(180deg,#fffdf9_0%,#f7f1e8_100%)] shadow-[0_20px_50px_rgba(23,63,58,0.08)]"
          : "border border-[var(--solace-line)] bg-[var(--solace-surface-strong)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--solace-primary)]">
            {name}
          </p>
          <p className="mt-4 text-4xl font-semibold text-[var(--solace-ink)]">
            {price}
          </p>
        </div>
        {highlight ? (
          <span className="rounded-full bg-[rgba(183,154,102,0.16)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--solace-accent)]">
            Most chosen
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--solace-ink-soft)]">
        {description}
      </p>
      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="rounded-[1.2rem] border border-[var(--solace-line)] bg-white/72 px-4 py-3 text-sm font-medium leading-7 text-[var(--solace-ink)]"
          >
            {feature}
          </div>
        ))}
      </div>
    </article>
  );
}
