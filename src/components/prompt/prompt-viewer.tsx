"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy, Download, Expand, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A deliberately small prompt renderer. The prompts are structured markdown,
 * so a handful of line-level rules give useful colour without pulling in a
 * highlighting runtime or an editor.
 */
type LineKind = "heading" | "subheading" | "bullet" | "numbered" | "token" | "fence" | "checkbox" | "text";

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

const COLLAPSED_LINES = 26;

export function PromptViewer({
  prompt,
  onCopy,
  onDownload,
  onExpand,
  copied,
  fullHeight = false,
  className,
}: {
  prompt: string;
  onCopy?: () => void;
  onDownload?: () => void;
  onExpand?: () => void;
  copied?: boolean;
  fullHeight?: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(fullHeight);
  const [showNumbers, setShowNumbers] = useState(true);

  const lines = useMemo(() => prompt.split("\n"), [prompt]);
  const visible = expanded ? lines : lines.slice(0, COLLAPSED_LINES);
  const words = useMemo(() => prompt.trim().split(/\s+/).length, [prompt]);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-surface", className)}>
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-3 py-2">
        <span className="font-mono text-2xs text-faint">
          {lines.length} lines · {words} words
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowNumbers((v) => !v)}
            aria-pressed={showNumbers}
            title="Toggle line numbers"
            className={cn(
              "flex size-7 items-center justify-center rounded-sm transition-colors",
              showNumbers ? "text-muted" : "text-faint hover:text-muted",
            )}
          >
            <Hash className="size-3.5" aria-hidden />
            <span className="sr-only">Toggle line numbers</span>
          </button>
          {onExpand ? (
            <button
              type="button"
              onClick={onExpand}
              title="Open full screen"
              className="flex size-7 items-center justify-center rounded-sm text-faint transition-colors hover:text-ink"
            >
              <Expand className="size-3.5" aria-hidden />
              <span className="sr-only">Open prompt full screen</span>
            </button>
          ) : null}
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-line bg-surface px-2 text-2xs font-medium text-muted transition-colors hover:text-ink"
            >
              <Download className="size-3" aria-hidden />
              <span className="hidden sm:inline">Download</span>
              <span className="sr-only">Download prompt as a text file</span>
            </button>
          ) : null}
          {onCopy ? (
            <button
              type="button"
              onClick={onCopy}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-2xs font-medium transition-colors",
                copied ? "bg-accent-soft text-accent" : "bg-accent text-accent-ink hover:bg-accent-hover",
              )}
            >
              {copied ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
              {copied ? "Copied" : "Copy prompt"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "overflow-auto scrollbar-slim px-3 py-3.5 font-mono text-[11.5px] leading-[1.75] sm:px-4 sm:text-xs",
            fullHeight ? "max-h-[calc(90vh-8rem)]" : expanded ? "max-h-[560px]" : "max-h-none",
          )}
        >
          {visible.map((line, index) => {
            const kind = classify(line);
            return (
              <div key={index} className="flex gap-3">
                {showNumbers ? (
                  <span className="w-7 shrink-0 select-none text-right text-faint/50 tabular-nums" aria-hidden>
                    {index + 1}
                  </span>
                ) : null}
                <span className={cn("whitespace-pre", lineClasses[kind])}>{line || " "}</span>
              </div>
            );
          })}
        </div>

        {!expanded && lines.length > COLLAPSED_LINES ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" aria-hidden />
        ) : null}
      </div>

      {lines.length > COLLAPSED_LINES && !fullHeight ? (
        <div className="border-t border-line px-3 py-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            {expanded ? <ChevronUp className="size-3.5" aria-hidden /> : <ChevronDown className="size-3.5" aria-hidden />}
            {expanded ? "Collapse prompt" : `Expand full prompt (${lines.length} lines)`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
