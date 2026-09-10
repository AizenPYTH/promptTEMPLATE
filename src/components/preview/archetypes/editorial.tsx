import { Label, Mesh, Rule, Sheen } from "./shared";

/**
 * editorial — Zenith.
 * Silhouette at 320px: one text measure with a large initial beside a tall panel.
 */
export function EditorialPreview() {
  return (
    <div className="flex size-full flex-col px-12 py-10">
      <div className="flex items-baseline justify-between">
        <Label className="tracking-[0.22em]">Zenith</Label>
        <Label className="tracking-[0.22em]">Issue 14</Label>
      </div>
      <Rule className="mt-4" />

      <div className="mt-9 flex flex-1 gap-12">
        <div className="flex w-[560px] shrink-0 flex-col">
          <h3
            className="relative font-display text-[34px] font-normal leading-[1.18] tracking-[-0.015em] text-[var(--ink)]"
          >
            The quiet return of the long page
          <Sheen />
          </h3>

          <div className="mt-7 flex gap-4">
            <span
              className="font-display text-[62px] font-normal leading-[0.8]"
              style={{ color: "var(--tpl-accent)" }}
            >
              F
            </span>
            <p className="text-[13px] leading-[1.7] text-[var(--ink-2)]">
              or a decade the answer to every brief was to cut. Fewer words, shorter pages, one idea per
              screen. The pendulum has started back: readers who arrive on purpose will read, and the
              format they are given decides how much.
            </p>
          </div>

          <Label className="mt-auto tracking-[0.18em]">1,840 words · 8 min</Label>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-[4px]" style={{ background: "var(--ground-2)" }}>
          <span
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, var(--tpl-accent), var(--stop))", opacity: 0.72 }}
          />
          <Mesh
            className="left-[-20%] top-[30%] size-[280px]"
            style={{ background: "rgba(255,255,255,0.6)", opacity: 0.2, animation: "mesh-c 18s var(--ease-inout) infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
