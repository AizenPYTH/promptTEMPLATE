"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Terminal, X } from "lucide-react";
import type { AgentId } from "@/types/template";
import { agents } from "@/data/site";
import { buildPrompt, promptFilename, promptStats } from "@/data/prompts";
import { getTemplate } from "@/data/templates";
import { PromptViewer } from "@/components/prompt/prompt-viewer";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/toast-provider";
import { useStore } from "@/lib/client-store";
import { agentStore } from "@/lib/preferences";
import { copyText, downloadText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

export function PromptSection({ slug }: { slug: string }) {
  const template = getTemplate(slug);
  const stored = useStore(agentStore, "claude-code");
  const agent: AgentId = agents.some((a) => a.id === stored) ? stored : "claude-code";
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { toast } = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  if (!template) return null;

  const prompt = buildPrompt(template, agent);
  const filename = promptFilename(template, agent);
  const stats = promptStats(prompt);
  const agentMeta = agents.find((a) => a.id === agent) ?? agents[0];

  const handleCopy = async () => {
    const ok = await copyText(prompt);
    setCopied(ok);
    toast({
      title: ok ? "Prompt copied" : "Could not copy the prompt",
      description: ok
        ? `${template.title} · ${agentMeta.name} · ${stats.characters.toLocaleString("en-GB")} characters`
        : "Your browser blocked clipboard access. Use the download instead.",
      tone: ok ? "success" : "warning",
    });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2600);
  };

  const handleDownload = () => {
    downloadText(filename, prompt);
    toast({ title: "Prompt downloaded", description: filename, tone: "info" });
  };

  const tabStrip = (
    <div role="tablist" aria-label="Choose a coding agent" className="flex gap-1">
      {agents.map((option) => {
        const active = agent === option.id;
        return (
          <button
            key={option.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => agentStore.set(option.id)}
            className={cn(
              "relative -mb-px rounded-t-md border border-b-0 px-3 py-1.5 text-[13px] font-medium transition-colors",
              active
                ? "border-line bg-surface-2 text-ink"
                : "border-transparent text-muted hover:bg-surface-3 hover:text-ink",
            )}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );

  return (
    <section id="prompt" className="scroll-mt-24">
      <div className="mb-5 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-2.5 py-1 text-label font-medium uppercase tracking-[0.1em] text-accent">
          <Terminal className="size-3" aria-hidden />
          Build it with AI
        </span>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
          Copy the prompt, recreate the template
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Paste this into your coding agent. It carries the art direction, the routes, the component
          list, the design tokens, the responsive rules, the interactions and an explicit list of
          what not to do — everything the agent needs to build {template.title} without guessing.
        </p>
      </div>

      <PromptViewer
        prompt={prompt}
        filename={filename}
        tabs={tabStrip}
        copied={copied}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onExpand={() => setFullscreen(true)}
      />

      <p className="mt-2.5 text-xs text-soft">{agentMeta.description}</p>

      <Modal
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        title={`${template.title} — ${agentMeta.name} prompt`}
        size="screen"
        header={
          <header className="flex shrink-0 items-center gap-3 border-b border-line bg-surface-3 px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">{template.title}</h2>
              <p className="truncate text-label text-soft">
                {agentMeta.name} · {stats.characters.toLocaleString("en-GB")} characters · ~
                {stats.tokens.toLocaleString("en-GB")} tokens
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex h-8 items-center gap-1.5 rounded-control border border-line bg-surface-2 px-2.5 text-xs font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Download className="size-3.5" aria-hidden />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-control px-3 text-xs font-semibold transition-colors",
                  copied
                    ? "bg-accent-soft text-accent ring-1 ring-inset ring-[var(--accent-line)]"
                    : "bg-accent text-accent-ink hover:bg-accent-hover",
                )}
              >
                {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                {copied ? "Prompt copied" : "Copy prompt"}
              </button>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Close the full screen prompt"
                className="flex size-8 items-center justify-center rounded-control text-soft transition-colors hover:bg-surface-3 hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          </header>
        }
      >
        <PromptViewer prompt={prompt} filename={filename} fullHeight />
      </Modal>
    </section>
  );
}
