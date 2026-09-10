import { Label } from "./shared";

/**
 * commerce — Arcadia.
 * Silhouette at 320px: a 2×2 grid over a crawling strip.
 */
const PRODUCTS = [
  { name: "Oak stool", price: "£180", lit: true },
  { name: "Linen throw", price: "£95", lit: false },
  { name: "Brass lamp", price: "£240", lit: false },
  { name: "Ash bench", price: "£420", lit: true },
];

export function CommercePreview() {
  return (
    <div className="flex size-full flex-col">
      <header className="flex items-center justify-between border-b border-[var(--rule)] px-10 py-6">
        <span className="font-display text-[19px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)]">
          Arcadia
        </span>
        <Label>Cart · 2</Label>
      </header>

      <div className="grid flex-1 grid-cols-2 gap-4 p-10">
        {PRODUCTS.map((p, i) => (
          <div
            key={p.name}
            className="relative overflow-hidden rounded-[10px] border border-[var(--rule)]"
            data-motion={p.lit ? "" : undefined}
            style={
              p.lit
                ? { background: "linear-gradient(150deg, var(--tpl-accent), var(--stop))", animation: `lift-pulse 6s var(--ease-out) ${i * 1.2}s infinite` }
                : { background: "var(--ground-2)" }
            }
          >
            <div className="absolute inset-x-4 bottom-3 flex items-baseline justify-between">
              <span className="text-[13px] text-[var(--ink)]">{p.name}</span>
              <span className="tabular font-mono text-[13px] text-[var(--ink-2)]">{p.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="marquee-host overflow-hidden border-t border-[var(--rule)] py-5">
        <div className="marquee-track gap-16" data-motion style={{ animation: "marquee 26s linear infinite" }}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-16 pr-16">
              {["Free returns", "Repairs for life", "Made in small runs", "Delivered in 3 days"].map((t) => (
                <Label key={t} className="whitespace-nowrap">
                  {t}
                </Label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
