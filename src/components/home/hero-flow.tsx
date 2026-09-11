"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { AgentId } from "@/types/template";
import { getTemplates } from "@/data/templates";
import { buildPrompt } from "@/data/prompts";
import { TemplatePreviewFrame } from "@/components/preview/preview-frame";
import { useToast } from "@/components/providers/toast-provider";
import { useStore } from "@/lib/client-store";
import { agentStore } from "@/lib/preferences";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

const STEPS = ["Discover", "Preview", "Copy", "Build"] as const;
const STEP_MS = 3000;
const SLUGS = ["nova-ai", "orbit-analytics", "studio-27-portfolio", "arcadia-ecommerce"];

/**
 * The hero loop object — decoration and content at once (handoff exception 2).
 * It exists to explain DISCOVER → PREVIEW → COPY → BUILD, which is why it earns
 * a 12s infinite loop where nothing else on the page gets one.
 */
export function HeroFlow() {
  const templates = getTemplates(SLUGS);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [copied, setCopied] = useState(false);
  const storedAgent = useStore(agentStore, "claude-code");
  const { toast } = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(id);
  }, [step, paused, reduced]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // Effect 5: the glow follows the pointer through a custom property, no state.
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - box.top}px`);
  };

  const active = templates[step] ?? templates[0];

  const onCopy = async () => {
    const ok = await copyText(buildPrompt(active, storedAgent as AgentId));
    setCopied(ok);
    toast({
      title: ok ? "Prompt copied" : "Could not copy the prompt",
      description: ok ? active.title : "Your browser blocked clipboard access.",
      tone: ok ? "success" : "warning",
    });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div
      className="group/hero relative"
      onPointerMove={onPointerMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <span
        className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-300 group-hover/hero:opacity-100 motion-reduce:hidden"
        aria-hidden
        style={{
          background:
            "radial-gradient(620px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), color-mix(in srgb, var(--accent) 16%, transparent), transparent 62%)",
        }}
      />

      <div className="glass-panel sheen relative rounded-glass p-5">
        <div role="tablist" aria-label="How Promptly works" className="flex gap-1">
          {STEPS.map((label, i) => (
            <button
              key={label}
              role="tab"
              type="button"
              aria-selected={i === step}
              tabIndex={i === step ? 0 : -1}
              onClick={() => setStep(i)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") setStep((i + 1) % STEPS.length);
                if (event.key === "ArrowLeft") setStep((i - 1 + STEPS.length) % STEPS.length);
              }}
              className={cn(
                "flex-1 rounded-control px-3 py-2.5 font-mono text-label uppercase tracking-[0.14em] transition-colors",
                i === step ? "text-fill-fg" : "text-soft hover:text-ink",
              )}
              style={i === step ? { background: "var(--fill-bg)" } : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {templates.map((template, i) => (
            <div
              key={template.id}
              className={cn(
                "overflow-hidden rounded-card border transition-[border-color,transform,opacity] duration-500",
                i === step ? "border-select-line" : "border-line opacity-60",
              )}
              style={i === step ? { transform: "translateY(-4px)" } : undefined}
            >
              <TemplatePreviewFrame
                template={template}
                size="small"
                playing={i === step && !reduced}
                className="aspect-[16/10] w-full"
              />
              <div className="flex items-center justify-between gap-2 bg-surface-3 px-3 py-2">
                <span className="truncate text-caption font-medium">{template.title}</span>
                {i === step ? (
                  <span className="font-mono text-label uppercase tracking-[0.14em] text-select-fg">
                    {STEPS[step]}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="min-w-0 flex-1 truncate text-caption text-soft">
            {step === 0 && "Browse finished designs, not screenshots of them."}
            {step === 1 && `Open ${active.title} and look at it running.`}
            {step === 2 && "Copy the prompt that rebuilds it."}
            {step === 3 && "Paste it into your agent and get the repository."}
          </p>
          <button
            type="button"
            onClick={onCopy}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-control px-3.5 text-caption font-semibold transition-colors",
              copied
                ? "bg-surface-3 text-accent ring-1 ring-inset ring-[var(--accent)]"
                : "bg-accent text-accent-ink hover:bg-accent-hover",
            )}
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? "Copied" : "Copy prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}
