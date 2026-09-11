"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { AgentId } from "@/types/template";
import { agents } from "@/data/site";
import { buildPrompt } from "@/data/prompts";
import { getTemplate } from "@/data/templates";
import { useToast } from "@/components/providers/toast-provider";
import { useStore } from "@/lib/client-store";
import { agentStore } from "@/lib/preferences";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

/**
 * Copy a template's prompt without opening it. The whole card is a link, so
 * this sits above the link overlay and stops the click from navigating.
 */
export function CardCopyButton({
  slug,
  title,
  className,
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const stored = useStore(agentStore, "claude-code");
  const agent: AgentId = agents.some((a) => a.id === stored) ? stored : "claude-code";
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const agentName = agents.find((a) => a.id === agent)?.name ?? "Claude Code";

  const onClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const template = getTemplate(slug);
    if (!template) return;
    const ok = await copyText(buildPrompt(template, agent));
    setCopied(ok);
    toast({
      title: ok ? "Prompt copied" : "Could not copy the prompt",
      description: ok ? `${title} · ${agentName}` : "Open the template and use the download instead.",
      tone: ok ? "success" : "warning",
    });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-control border px-2 text-label font-medium shadow-e1 backdrop-blur-sm transition-colors",
        copied
          ? "border-select-line bg-select-bg text-select-fg"
          : "border-line bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-muted hover:text-ink",
        className,
      )}
    >
      {copied ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
      {copied ? "Copied" : "Copy prompt"}
      <span className="sr-only"> for {title}</span>
    </button>
  );
}
