import { Label } from "./shared";

/**
 * board — Cadence.
 * Silhouette at 320px: three ragged columns with one card mid-air.
 */
const COLUMNS: { name: string; count: number; cards: string[]; done?: boolean }[] = [
  { name: "Todo", count: 4, cards: ["Rate-limit copy API", "Audit focus rings"] },
  { name: "In progress", count: 2, cards: ["Preview kit, 6 left"] },
  { name: "Done", count: 9, cards: ["Token table", "Motion table"], done: true },
];

export function BoardPreview() {
  return (
    <div className="flex size-full flex-col">
      <header className="flex items-center justify-between border-b border-[var(--rule)] px-8 py-5">
        <span className="font-display text-[18px] font-semibold text-[var(--ink)]">Cadence</span>
        <Label>Sprint 42 · Day 6</Label>
      </header>

      <div className="relative grid flex-1 grid-cols-3 gap-5 p-8">
        {COLUMNS.map((col) => (
          <div key={col.name}>
            <div className="mb-4 flex items-center gap-2">
              <Label>{col.name}</Label>
              <span className="font-mono text-[11px] text-[var(--ink-3)]">· {col.count}</span>
            </div>
            <div className="space-y-3">
              {col.cards.map((c) => (
                <div
                  key={c}
                  className="rounded-[9px] border border-[var(--rule)] bg-white/[0.04] px-4 py-3 text-[13px]"
                  style={col.done ? { color: "var(--ink-3)", textDecoration: "line-through" } : { color: "var(--ink-2)" }}
                >
                  {c}
                </div>
              ))}
              {col.name === "In progress" ? (
                <div className="h-[46px] rounded-[9px] border border-dashed border-[var(--rule)]" />
              ) : null}
            </div>
          </div>
        ))}

        {/* The card in flight — the silhouette's whole point. */}
        <div
          className="absolute left-[32%] top-[104px] w-[29%] rounded-[9px] border px-4 py-3 text-[13px] text-[var(--ink)]"
          data-motion
          style={{
            background: "color-mix(in srgb, var(--tpl-accent) 22%, var(--ground-2))",
            borderColor: "color-mix(in srgb, var(--tpl-accent) 55%, transparent)",
            boxShadow: "0 18px 40px -18px rgba(0,0,0,0.8)",
            animation: "card-flight 7s var(--ease-inout) infinite",
          }}
        >
          Ship prompt diff view
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-[var(--rule)] px-8 py-5">
        <span className="h-[6px] flex-1 overflow-hidden rounded-full bg-white/10">
          <span
            className="block h-full rounded-full"
            data-motion
            style={{ background: "var(--tpl-accent)", width: "60%", transformOrigin: "left", animation: "bar-grow 3s var(--ease-inout) infinite alternate" }}
          />
        </span>
        <Label>60% burned</Label>
      </div>
    </div>
  );
}
