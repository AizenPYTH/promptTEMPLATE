import { Label } from "./shared";

/**
 * dashboard — Orbit.
 * Silhouette at 320px: a left rail and a single rising line.
 */
const POINTS = "0,150 70,138 140,146 210,112 280,120 350,86 420,96 490,58 560,66 630,34 700,44 770,18";
const GHOST = "0,176 70,172 140,178 210,166 280,170 350,158 420,162 490,150 560,154 630,142 700,146 770,134";

export function DashboardPreview() {
  return (
    <div className="flex size-full">
      <aside className="w-[132px] shrink-0 border-r border-[var(--rule)] bg-black/25 p-5">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: "var(--tpl-accent)" }}>
          Orbit
        </span>
        <span
          className="mt-6 block h-[30px] rounded-[7px] border"
          style={{ background: "color-mix(in srgb, var(--tpl-accent) 16%, transparent)", borderColor: "color-mix(in srgb, var(--tpl-accent) 40%, transparent)" }}
        />
        {[0, 1, 2].map((i) => (
          <span key={i} className="mt-3 block h-[30px] rounded-[7px] bg-white/[0.05]" />
        ))}
      </aside>

      <div className="flex-1 p-7">
        <div className="flex gap-4">
          {[
            { k: "MRR", v: "£248k", d: "+12.4%" },
            { k: "Active", v: "9,120", d: "+3.1%" },
            { k: "Churn", v: "1.8%", d: "+0.2%" },
          ].map((tile) => (
            <div key={tile.k} className="flex-1 rounded-[12px] border border-[var(--rule)] bg-white/[0.03] p-5">
              <Label>{tile.k}</Label>
              <p className="tabular mt-3 font-mono text-[30px] leading-none text-[var(--ink)]">{tile.v}</p>
              <p className="tabular mt-2 font-mono text-[12px]" style={{ color: "var(--tpl-accent)" }}>
                {tile.d}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[12px] border border-[var(--rule)] bg-white/[0.02] p-5">
          <Label>Activation · 30d</Label>
          <svg viewBox="0 0 780 200" className="mt-4 h-[300px] w-full" preserveAspectRatio="none">
            <polyline points={GHOST} fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
            <polyline
              points={POINTS}
              fill="none"
              stroke="var(--tpl-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-motion
              style={{ strokeDasharray: 1400, ["--draw-len" as string]: 1400, animation: "draw 2800ms var(--ease-inout) infinite alternate" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
