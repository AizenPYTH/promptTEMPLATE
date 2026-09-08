"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Layers, Sparkles, Terminal, Wand2 } from "lucide-react";
import type { Template } from "@/types/template";
import { TemplateVisual } from "@/components/visuals/template-visual";
import { copyText } from "@/lib/clipboard";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

const STEP_DURATION = 3400;

const steps = [
  { id: "design", label: "Design", icon: Layers, caption: "Pick one you'd ship." },
  { id: "prompt", label: "Prompt", icon: Wand2, caption: "Copy the full brief." },
  { id: "agent", label: "AI", icon: Terminal, caption: "Paste into your agent." },
  { id: "website", label: "Website", icon: Sparkles, caption: "A real codebase." },
] as const;

const promptLines = [
  { text: "You are a senior front-end engineer and product designer.", tone: "comment" },
  { text: "", tone: "plain" },
  { text: "# Objective", tone: "heading" },
  { text: "Build the Nova AI website — an AI startup launch site —", tone: "plain" },
  { text: "as a complete, runnable front-end project.", tone: "plain" },
  { text: "", tone: "plain" },
  { text: "# Design system", tone: "heading" },
  { text: "--background      #08080b", tone: "token" },
  { text: "--surface         #101014", tone: "token" },
  { text: "--accent          #7c6dff", tone: "token" },
  { text: "", tone: "plain" },
  { text: "# Motion", tone: "heading" },
  { text: "- Hero text streams at 28ms per character, skippable", tone: "plain" },
  { text: "- Sections fade in at 0.4s with a 24px rise, once only", tone: "plain" },
] as const;

const agentLines = [
  "› Reading brief — 14 requirements, 5 routes",
  "✓ app/layout.tsx",
  "✓ app/page.tsx",
  "✓ components/hero/streaming-message.tsx",
  "✓ components/benchmarks/benchmark-table.tsx",
  "✓ lib/canned-responses.ts",
  "› Running typecheck… 0 errors",
  "› Running lint… 0 warnings",
  "✓ Build complete in 6.2s",
] as const;

export function HeroFlow({ template, samplePrompt }: { template: Template; samplePrompt: string }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reduced, setReduced] = useState(false);
  const { toast } = useToast();
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP_DURATION);
    return () => clearTimeout(timer);
  }, [step, paused, reduced]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const onCopy = async () => {
    const ok = await copyText(samplePrompt);
    setCopied(ok);
    toast({
      title: ok ? "Prompt copied" : "Could not copy",
      description: ok ? `${template.title} · Claude Code prompt` : "Your browser blocked clipboard access.",
      tone: ok ? "success" : "warning",
    });
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Step rail */}
      <div role="tablist" aria-label="How Promptly works" className="mb-4 flex items-stretch gap-1.5 overflow-x-auto no-scrollbar">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === step;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              id={`flow-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls="flow-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setStep(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") setStep((index + 1) % steps.length);
                if (event.key === "ArrowLeft") setStep((index - 1 + steps.length) % steps.length);
              }}
              className={cn(
                "group relative flex min-w-0 flex-1 flex-col gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors",
                isActive ? "border-accent-line bg-accent-soft" : "border-line bg-surface hover:border-line-strong",
              )}
            >
              <span className={cn("flex items-center gap-1.5 text-2xs font-medium uppercase tracking-[0.1em]", isActive ? "text-accent" : "text-faint")}>
                <Icon className="size-3" aria-hidden />
                {item.label}
              </span>
              <span className={cn("truncate text-xs", isActive ? "text-ink" : "text-muted")}>{item.caption}</span>
              {!reduced ? (
                <span className="absolute inset-x-3 bottom-0 h-px overflow-hidden rounded-full bg-transparent" aria-hidden>
                  <span
                    className={cn("block h-full bg-accent transition-[width] ease-linear", isActive ? "w-full" : "w-0")}
                    style={{ transitionDuration: isActive && !paused ? `${STEP_DURATION}ms` : "0ms" }}
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        id="flow-panel"
        role="tabpanel"
        aria-labelledby={`flow-tab-${steps[step].id}`}
        className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-card"
      >
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-3.5 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full border border-line bg-surface-3" />
            <span className="size-2.5 rounded-full border border-line bg-surface-3" />
            <span className="size-2.5 rounded-full border border-line bg-surface-3" />
          </span>
          <span className="ml-1.5 truncate font-mono text-2xs text-faint">
            {step === 0 && `promptly.design/templates/${template.slug}`}
            {step === 1 && `${template.slug}-claude-code-prompt.txt`}
            {step === 2 && "~/projects/nova-ai — claude"}
            {step === 3 && "localhost:3000"}
          </span>
          {step === 1 ? (
            <button
              type="button"
              onClick={onCopy}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 text-2xs font-medium text-muted transition-colors hover:text-ink"
            >
              {copied ? <Check className="size-3 text-accent" aria-hidden /> : <Copy className="size-3" aria-hidden />}
              {copied ? "Copied" : "Copy"}
            </button>
          ) : null}
        </div>

        <div className="relative aspect-[16/10] w-full">
          {/* Design */}
          <div className={cn("absolute inset-0 transition-opacity duration-300", step === 0 ? "opacity-100" : "pointer-events-none opacity-0")}>
            <TemplateVisual
              kind={template.visual}
              accent={template.accent}
              seed={template.slug}
              label={`${template.title} preview`}
              className="size-full"
            />
          </div>

          {/* Prompt */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden bg-surface p-4 font-mono text-[11px] leading-[1.7] transition-opacity duration-300 sm:p-5 sm:text-xs",
              step === 1 ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {promptLines.map((line, index) => (
              <div key={index} className="flex gap-3">
                <span className="w-5 shrink-0 select-none text-right text-faint/60 tabular-nums">{index + 1}</span>
                <span
                  className={cn(
                    "truncate",
                    line.tone === "heading" && "font-semibold text-accent",
                    line.tone === "comment" && "text-muted",
                    line.tone === "token" && "text-positive",
                    line.tone === "plain" && "text-ink/80",
                  )}
                >
                  {line.text || " "}
                </span>
              </div>
            ))}
          </div>

          {/* Agent */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden bg-surface p-4 font-mono text-[11px] leading-[1.9] transition-opacity duration-300 sm:p-5 sm:text-xs",
              step === 2 ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {agentLines.map((line, index) => (
              <div
                key={line}
                className={cn(
                  "truncate",
                  line.startsWith("✓") ? "text-positive" : "text-muted",
                  step === 2 && !reduced && "animate-fade-in",
                )}
                style={step === 2 && !reduced ? { animationDelay: `${index * 110}ms` } : undefined}
              >
                {line}
              </div>
            ))}
            <div className="mt-2 flex items-center gap-2 text-ink">
              <span aria-hidden>›</span>
              <span className={cn("inline-block h-3.5 w-1.5 bg-accent", !reduced && "animate-flow")} aria-hidden />
            </div>
          </div>

          {/* Website */}
          <div className={cn("absolute inset-0 transition-opacity duration-300", step === 3 ? "opacity-100" : "pointer-events-none opacity-0")}>
            <TemplateVisual
              kind="docs"
              accent={template.accent}
              seed={`${template.slug}-built`}
              label="The generated website running locally"
              className="size-full"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5 text-2xs font-medium shadow-soft">
              <Check className="size-3 text-positive" aria-hidden />
              Shipped in one prompt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
