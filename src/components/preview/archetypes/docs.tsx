import { Label } from "./shared";

/**
 * docs — Mono.
 * Silhouette at 320px: three columns, the outer two narrow.
 */
const NAV = ["Install", "Configuration", "CLI reference", "Themes", "Deploy"];
const TOC = ["Theme", "Search", "Sidebar", "Redirects"];

export function DocsPreview() {
  return (
    <div className="flex size-full">
      <aside className="w-[132px] shrink-0 border-r border-[var(--rule)] p-6">
        <span className="font-mono text-[12px] text-[var(--ink-2)]">mono/docs</span>
        <nav className="mt-7 space-y-[14px]">
          {NAV.map((n, i) => (
            <span
              key={n}
              className="block text-[12.5px]"
              style={i === 1 ? { color: "var(--ink)", fontWeight: 600 } : { color: "var(--ink-3)" }}
            >
              {n}
            </span>
          ))}
        </nav>
      </aside>

      <div className="flex-1 px-9 py-7">
        <Label>Configuration</Label>
        <h3 className="mt-4 font-display text-[28px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
          mono.config.ts
        </h3>
        <p className="mt-4 max-w-[460px] text-[13.5px] leading-[1.65] text-[var(--ink-2)]">
          Every option is optional. Values below are the defaults applied when the key is absent.
        </p>

        <div className="mt-7 overflow-hidden rounded-[10px] border border-[var(--rule)] bg-black/30">
          <div className="flex gap-4 px-5 py-4 font-mono text-[13px] leading-[1.9]">
            <span className="select-none text-right text-[var(--ink-3)]/50">
              1<br />2<br />3<br />4
            </span>
            <span>
              <span className="text-[var(--ink-3)]">export default</span> <span className="text-[var(--ink-2)]">{"{"}</span>
              <br />
              <span className="pl-4 text-[var(--ink-2)]">theme: </span>
              <span style={{ color: "var(--tpl-accent)" }}>&quot;slate&quot;</span>
              <span className="text-[var(--ink-2)]">,</span>
              <br />
              <span className="pl-4 text-[var(--ink-2)]">search: {"{"} c</span>
              <br />
              <span className="text-[var(--ink-2)]">{"}"}</span>
            </span>
          </div>
        </div>
      </div>

      <aside className="relative w-[126px] shrink-0 border-l border-[var(--rule)] p-6">
        <Label className="text-[10px]">On this page</Label>
        <span
          className="absolute left-6 w-[2px] rounded-full"
          data-motion
          style={{ background: "var(--tpl-accent)", height: "18px", top: "64px", animation: "toc-walk 8s steps(1) infinite" }}
        />
        <nav className="mt-6 space-y-[14px] pl-3">
          {TOC.map((t) => (
            <span key={t} className="block text-[12px] text-[var(--ink-3)]">
              {t}
            </span>
          ))}
        </nav>
      </aside>
    </div>
  );
}
