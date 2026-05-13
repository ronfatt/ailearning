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
      className={`solace-lift relative overflow-hidden rounded-[1.9rem] p-6 ${
        highlight
          ? "border border-[#cfe0ff] bg-[radial-gradient(circle_at_top_right,rgba(124,92,255,0.16),transparent_38%),linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] shadow-[0_24px_58px_rgba(59,108,255,0.16)]"
          : "border border-[#e6ecf5] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_18px_42px_rgba(59,108,255,0.07)]"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-2 ${
          highlight
            ? "bg-[linear-gradient(90deg,#3B6CFF,#7C5CFF,#12CFF3)]"
            : "bg-[linear-gradient(90deg,#bfdbfe,#ddd6fe,#bbf7d0)]"
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#3B6CFF]">
            {name}
          </p>
          <p className="mt-4 text-4xl font-semibold text-[#111827]">
            {price}
          </p>
        </div>
        {highlight ? (
          <span className="rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            Most chosen
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-[#5B6472]">
        {description}
      </p>
      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="solace-soft-pill rounded-[1.2rem] border border-[#e6ecf5] bg-[#f8fbff] px-4 py-3 text-sm font-medium leading-7 text-[#111827]"
          >
            {feature}
          </div>
        ))}
      </div>
    </article>
  );
}
