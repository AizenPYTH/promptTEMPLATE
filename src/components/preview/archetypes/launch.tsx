import { Label, Mesh } from "./shared";

/**
 * launch — Launchpad.
 * Silhouette at 320px: a row of four square tiles under centred type.
 */
const CLOCK = [
  { v: "02", u: "Days" },
  { v: "11", u: "Hrs" },
  { v: "48", u: "Min" },
  { v: "07", u: "Sec" },
];

export function LaunchPreview() {
  return (
    <div className="relative flex size-full flex-col items-center justify-center overflow-hidden px-12">
      <Mesh
        className="left-1/2 top-[-30%] size-[620px] -translate-x-1/2"
        style={{ background: "var(--tpl-accent)", opacity: 0.4, animation: "mesh-a 22s var(--ease-inout) infinite" }}
      />

      <Label className="relative tracking-[0.2em]">Friday · 09:00 GMT</Label>

      <h3 className="relative mt-6 text-center font-display text-[52px] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--ink)]">
        One page.
        <br />
        One deadline.
      </h3>

      <div className="relative mt-11 flex gap-4">
        {CLOCK.map((c, i) => (
          <div
            key={c.u}
            className="w-[86px] rounded-[12px] border border-[var(--rule)] bg-white/[0.04] py-4 text-center"
            data-motion
            style={{ animation: `tick 1200ms var(--ease-out) ${i * 200}ms infinite` }}
          >
            <p
              className="tabular font-mono text-[30px] leading-none"
              style={{ color: i === 3 ? "var(--tpl-accent)" : "var(--ink)" }}
            >
              {c.v}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">{c.u}</p>
          </div>
        ))}
      </div>

      <span
        className="relative mt-11 rounded-[999px] px-7 py-[13px] text-[14px] font-semibold"
        data-motion
        style={{ background: "var(--tpl-accent)", color: "#0b0a0c", animation: "float-y 4s var(--ease-inout) infinite" }}
      >
        Join the waitlist
      </span>
    </div>
  );
}
