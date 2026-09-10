import { Label, Mesh, Sheen } from "./shared";

/**
 * portfolio — Studio 27.
 * Silhouette at 320px: oversized italic beside one tall image block.
 */
export function PortfolioPreview() {
  return (
    <div className="relative flex size-full gap-10 p-12">
      <div className="flex w-[520px] shrink-0 flex-col">
        <Label className="tracking-[0.18em]">Studio 27 · Stills &amp; motion</Label>
        <h3 className="relative mt-16 font-display text-[54px] font-normal italic leading-[1.06] tracking-[-0.02em] text-[var(--ink)]">
          Light,
          <br />
          held still
          <Sheen />
        </h3>
        <p className="mt-9 font-mono text-[12px] tracking-[0.06em] text-[var(--ink-3)]">
          Editorial · Product · Archive 2019–25
        </p>
        <div className="mt-auto flex gap-3">
          {[0.85, 0.6, 0.32].map((o, i) => (
            <span
              key={i}
              className="h-[72px] w-[72px] rounded-[4px]"
              style={{ background: `linear-gradient(150deg, var(--tpl-accent), var(--stop))`, opacity: o }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-[6px]" style={{ background: "var(--ground-2)" }}>
        <span
          className="absolute inset-0"
          style={{ background: "linear-gradient(165deg, var(--tpl-accent), var(--stop) 70%)", opacity: 0.9 }}
        />
        <Mesh
          className="left-[10%] top-[16%] size-[300px]"
          style={{ background: "rgba(255,255,255,0.5)", opacity: 0.25, animation: "mesh-c 16s var(--ease-inout) infinite" }}
        />
      </div>
    </div>
  );
}
