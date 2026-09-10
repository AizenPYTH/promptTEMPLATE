import { Mesh, TypeLine } from "./shared";

/**
 * landing — Nova AI.
 * Silhouette at 320px: a glass panel pinned right of a two-line headline.
 */
export function LandingPreview() {
  return (
    <div className="relative size-full overflow-hidden">
      <Mesh
        className="-left-[8%] -top-[26%] size-[560px]"
        style={{ background: "var(--tpl-accent)", opacity: 0.34, animation: "mesh-a 20s var(--ease-inout) infinite" }}
      />
      <Mesh
        className="-right-[14%] top-[30%] size-[420px]"
        style={{ background: "var(--stop)", opacity: 0.4, animation: "mesh-b 26s var(--ease-inout) infinite" }}
      />

      <div className="relative flex h-[68px] items-center justify-between px-12">
        <span className="font-mono text-[15px] lowercase tracking-[0.02em] text-[var(--ink-2)]">nova</span>
        <span
          className="rounded-[8px] px-4 py-[9px] text-[13px] font-semibold"
          style={{ background: "var(--tpl-accent)", color: "#0b0a0c" }}
        >
          Get API key
        </span>
      </div>

      <div className="relative flex items-start gap-14 px-12 pt-[74px]">
        <div className="w-[540px] shrink-0">
          <h3 className="font-display text-[56px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--ink)]">
            Ship the model,
            <br />
            not the marketing
          </h3>
          <p className="mt-7 text-[16px] leading-[1.6] text-[var(--ink-2)]">
            40ms first token. Open weights, your infrastructure.
          </p>
          <div className="mt-9 flex gap-3">
            <span className="rounded-[8px] px-5 py-3 text-[14px] font-semibold" style={{ background: "var(--tpl-accent)", color: "#0b0a0c" }}>
              Read the docs
            </span>
            <span className="rounded-[8px] border border-[var(--rule)] px-5 py-3 text-[14px] text-[var(--ink-2)]">
              Benchmarks
            </span>
          </div>
        </div>

        <div className="glass-inner sheen relative w-[400px] rounded-[16px] p-6 font-mono text-[13px] leading-[2]">
          <span className="text-[var(--ink-3)]">&gt; nova run</span>
          <br />
          <TypeLine duration={2800}>
            <span className="text-[var(--ink-2)]">
              ✓ 40ms · <span style={{ color: "var(--tpl-accent)" }}>nova-3-small</span>
            </span>
          </TypeLine>
          <div className="mt-5 space-y-2">
            {[62, 88, 44].map((w, i) => (
              <span key={i} className="block h-[7px] rounded-full bg-white/10" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-[68px] flex gap-3 px-12">
        {["Open weights", "40ms p50", "Self-host", "SOC 2"].map((t) => (
          <span key={t} className="rounded-full border border-[var(--rule)] px-4 py-2 text-[12px] text-[var(--ink-3)]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
