import { Label, Mesh } from "./shared";

/**
 * canvas — Flux.
 * Silhouette at 320px: nodes joined by curved dashed edges.
 */
const NODES = [
  { kind: "Trigger", title: "New form entry", x: 40, y: 168, pulse: false },
  { kind: "Transform", title: "Classify intent", x: 400, y: 268, pulse: true },
  { kind: "Output", title: "Post to Slack", x: 760, y: 372, pulse: false },
];

export function CanvasPreview() {
  return (
    <div className="relative flex size-full flex-col">
      <header className="relative z-10 flex items-center justify-between border-b border-[var(--rule)] px-8 py-5">
        <span className="font-display text-[18px] font-semibold text-[var(--ink)]">Flux</span>
        <Label>Run · 3 nodes</Label>
      </header>

      <div
        className="relative flex-1"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1.1px, transparent 1.1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <Mesh
          className="-bottom-[18%] right-[4%] size-[380px]"
          style={{ background: "var(--tpl-accent)", opacity: 0.35, animation: "mesh-b 24s var(--ease-inout) infinite" }}
        />

        <svg viewBox="0 0 1120 520" className="absolute inset-0 size-full" aria-hidden>
          {["M232 208 C 330 208, 320 300, 424 300", "M592 308 C 700 308, 690 404, 784 404"].map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="var(--tpl-accent)"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              opacity="0.75"
              data-motion
              style={{ animation: "dash-flow 1.4s linear infinite" }}
            />
          ))}
        </svg>

        {NODES.map((n) => (
          <div key={n.kind} className="absolute" style={{ left: n.x, top: n.y }}>
            {n.pulse ? (
              <span
                className="absolute -inset-3 rounded-[16px] border-2"
                data-motion
                style={{ borderColor: "var(--tpl-accent)", animation: "ring-pulse 2.6s var(--ease-out) infinite" }}
              />
            ) : null}
            <div
              className="glass-inner relative w-[192px] rounded-[12px] px-4 py-3"
              style={{ borderColor: "color-mix(in srgb, var(--tpl-accent) 45%, transparent)" }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{ color: "var(--tpl-accent)" }}
              >
                {n.kind}
              </span>
              <p className="mt-1.5 text-[13.5px] text-[var(--ink)]">{n.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
