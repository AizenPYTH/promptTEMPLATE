import { Label } from "./shared";

/**
 * data grid — Finora.
 * Silhouette at 320px: dense ruled rows with one lit band.
 */
const ROWS = [
  ["Aureus Trading", "£412,900", "09:14", "cleared"],
  ["Northwind Ltd", "£88,140", "09:22", "cleared"],
  ["Kestrel Capital", "£1,204,000", "—", "pending"],
  ["Meridian FX", "£63,020", "10:03", "cleared"],
  ["Halden & Co", "£297,500", "10:41", "cleared"],
  ["Vale Partners", "£19,880", "11:07", "cleared"],
];

export function DataGridPreview() {
  return (
    <div className="flex size-full flex-col p-8">
      <div className="flex flex-1 flex-col overflow-hidden rounded-[10px] border border-[var(--rule)]" style={{ background: "var(--ground-2)" }}>
        <header className="flex items-center justify-between border-b border-[var(--rule)] px-6 py-5">
          <span className="font-display text-[19px] font-semibold text-[var(--ink)]">Finora</span>
          <Label className="tracking-[0.16em]">Ledger · Sep 2026</Label>
        </header>

        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr] border-b border-[var(--rule)] px-6 py-3">
          {["Counterparty", "Amount", "Settled", "Status"].map((h) => (
            <Label key={h}>{h}</Label>
          ))}
        </div>

        <div className="relative flex-1">
          <span
            className="absolute inset-x-0 top-0 h-[46px]"
            data-motion
            style={{
              background: "color-mix(in srgb, var(--tpl-accent) 16%, transparent)",
              borderTop: "1px solid color-mix(in srgb, var(--tpl-accent) 45%, transparent)",
              borderBottom: "1px solid color-mix(in srgb, var(--tpl-accent) 45%, transparent)",
              ["--scan-distance" as string]: "230px",
              animation: "scan-band 5500ms var(--ease-inout) infinite",
            }}
          />
          {ROWS.map((r) => (
            <div
              key={r[0]}
              className="relative grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr] items-center border-b border-[var(--rule)] px-6 py-[13px] font-mono text-[13px]"
            >
              <span className="text-[var(--ink-2)]">{r[0]}</span>
              <span className="tabular text-[var(--ink)]">{r[1]}</span>
              <span className="tabular text-[var(--ink-3)]">{r[2]}</span>
              <span style={{ color: r[3] === "pending" ? "var(--ink-3)" : "var(--tpl-accent)" }}>{r[3]}</span>
            </div>
          ))}
        </div>

        <footer className="flex items-center justify-between px-6 py-4">
          <Label>6 of 1,284 rows</Label>
          <span className="tabular font-mono text-[13px]" style={{ color: "var(--tpl-accent)" }}>
            net £2.09m
          </span>
        </footer>
      </div>
    </div>
  );
}
