"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy, Download, Expand, Hash, WrapText } from "lucide-react";
import { promptStats } from "@/data/prompts";
import { cn } from "@/lib/utils";

/**
 * A deliberately small prompt renderer.
 *
 * The prompts are structured markdown, so a handful of line-level rules give
 * useful colour without pulling in a highlighting runtime or a code editor.
 * What the user copies is exactly the string passed in — the colouring is
 * presentational only and never touches the text.
 */
type LineKind =
  | "heading"
  | "subheading"
  | "bullet"
  | "numbered"
  | "token"
  | "fence"
  | "checkbox"
  | "text";

function classify(line: string): LineKind {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("# ")) return "heading";
  if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) return "subheading";
  if (trimmed.startsWith("```")) return "fence";
  if (trimmed.startsWith("- [ ]")) return "checkbox";
  if (trimmed.startsWith("- ")) return "bullet";
  if (/^\d+\.\s/.test(trimmed)) return "numbered";
  if (/^--[a-z-]+\s/.test(trimmed)) return "token";
  return "text";
}

const lineClasses: Record<LineKind, string> = {
  heading: "font-semibold text-accent",
  subheading: "font-semibold text-ink",
  bullet: "text-ink/80",
  numbered: "text-ink/80",
  token: "text-positive",
  fence: "text-faint",
  checkbox: "text-muted",
  text: "text-ink/75",
};

const COLLAPSED_LINES = 30;

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-2xs font-medium transition-colors",
        active ? "bg-surface-3 text-ink" : "text-faint hover:bg-surface-3 hover:text-muted",
      )}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function PromptViewer({
  prompt,
  filename,
  tabs,
  onCopy,
  onDownload,
  onExpand,
  copied,
  fullHeight = false,
  className,
}: {
  prompt: string;
  filename: string;
  /** Rendered in the panel head, above the toolbar — the agent tab strip. */
  tabs?: React.ReactNode;
  onCopy?: () => void;
  onDownload?: () => void;
  onExpand?: () => void;
  copied?: boolean;
  fullHeight?: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(fullHeight);
  const [showNumbers, setShowNumbers] = useState(true);
  const [wrap, setWrap] = useState(true);

  const lines = useMemo(() => prompt.split("\n"), [prompt]);
  const stats = useMemo(() => promptStats(prompt), [prompt]);
  const visible = expanded ? lines : lines.slice(0, COLLAPSED_LINES);
  const truncated = !expanded && lines.length > COLLAPSED_LINES;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-line bg-surface",
        fullHeight && "h-full rounded-none border-0",
        className,
      )}
    >
      {tabs ? <div className="border-b border-line bg-surface-2 px-2 pt-2">{tabs}</div> : null}

      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-3 py-2">
        <span className={cn("hidden min-w-0 items-center gap-2", fullHeight ? "lg:flex" : "sm:flex")}>
          <span className="truncate font-mono text-2xs text-muted">{filename}</span>
          <span className="text-faint" aria-hidden>
            ·
          </span>
        </span>
        <span className="shrink-0 whitespace-nowrap font-mono text-2xs text-faint tabular-nums">
          <span className="sm:hidden">{(stats.characters / 1000).toFixed(1)}k chars</span>
          <span className="hidden sm:inline">
            {stats.characters.toLocaleString("en-GB")} characters · ~{stats.tokens.toLocaleString("en-GB")} tokens
          </span>
        </span>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <ToolbarButton active={wrap} onClick={() => setWrap((v) => !v)} label={wrap ? "Disable line wrap" : "Enable line wrap"}>
            <WrapText className="size-3.5" aria-hidden />
            <span className="hidden not-sr-only md:inline">{wrap ? "Wrap" : "No wrap"}</span>
          </ToolbarButton>
          <ToolbarButton active={showNumbers} onClick={() => setShowNumbers((v) => !v)} label="Toggle line numbers">
            <Hash className="size-3.5" aria-hidden />
          </ToolbarButton>
          {onExpand ? (
            <ToolbarButton onClick={onExpand} label="Open the prompt full screen">
              <Expand className="size-3.5" aria-hidden />
            </ToolbarButton>
          ) : null}
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-line bg-surface px-2 text-2xs font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <Download className="size-3" aria-hidden />
              <span className="hidden sm:inline">Download</span>
              <span className="sr-only">Download the prompt as a text file</span>
            </button>
          ) : null}
          {onCopy ? (
            <button
              type="button"
              onClick={onCopy}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-2xs font-semibold transition-colors",
                copied
                  ? "bg-accent-soft text-accent ring-1 ring-inset ring-[var(--accent-line)]"
                  : "bg-accent text-accent-ink hover:bg-accent-hover",
              )}
            >
              {copied ? (
                <Check className="size-3 animate-scale-in" aria-hidden />
              ) : (
                <Copy className="size-3" aria-hidden />
              )}
              {copied ? "Prompt copied" : "Copy prompt"}
            </button>
          ) : null}
        </div>
      </div>

      <div className={cn("relative min-h-0", fullHeight && "flex-1")}>
        <div
          className={cn(
            "scrollbar-slim px-3 py-3.5 font-mono text-[11.5px] leading-[1.75] sm:px-4 sm:text-xs",
            wrap ? "overflow-y-auto" : "overflow-auto",
            fullHeight ? "h-full" : expanded ? "max-h-[620px] overflow-y-auto" : "",
          )}
        >
          <div className={cn(fullHeight && "mx-auto w-full max-w-[1080px]")}>
          {visible.map((line, index) => {
            const kind = classify(line);
            return (
              <div key={index} className="flex gap-3">
                {showNumbers ? (
                  <span
                    className="w-7 shrink-0 select-none text-right text-faint/50 tabular-nums"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "min-w-0",
                    wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
                    lineClasses[kind],
                  )}
                >
                  {line || " "}
                </span>
              </div>
            );
          })}
          </div>
        </div>

        {truncated ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface via-surface/80 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>

      {lines.length > COLLAPSED_LINES && !fullHeight ? (
        <div className="border-t border-line bg-surface-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            {expanded ? (
              <ChevronUp className="size-3.5" aria-hidden />
            ) : (
              <ChevronDown className="size-3.5" aria-hidden />
            )}
            {expanded ? "Collapse prompt" : `Show the full prompt — ${lines.length} lines`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
