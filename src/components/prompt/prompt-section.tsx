"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/client-store";
import { agentStore } from "@/lib/preferences";
import { Terminal } from "lucide-react";
import type { AgentId, Template } from "@/types/template";
import { agents } from "@/data/site";
import { buildPrompt, promptFilename } from "@/data/prompts";
import { PromptViewer } from "@/components/prompt/prompt-viewer";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/toast-provider";
import { copyText, downloadText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

export function PromptSection({ template }: { template: Template }) {
  const stored = useStore(agentStore, "claude-code");
  const agent: AgentId = agents.some((a) => a.id === stored) ? stored : "claude-code";
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { toast } = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const prompt = buildPrompt(template, agent);
  const agentMeta = agents.find((a) => a.id === agent) ?? agents[0];

  const selectAgent = (next: AgentId) => agentStore.set(next);

  const handleCopy = async () => {
    const ok = await copyText(prompt);
    setCopied(ok);
    toast({
      title: ok ? "Prompt copied to clipboard" : "Could not copy the prompt",
      description: ok
        ? `${template.title} · ${agentMeta.name}`
        : "Your browser blocked clipboard access. Try the download instead.",
      tone: ok ? "success" : "warning",
    });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2400);
  };

  const handleDownload = () => {
    downloadText(promptFilename(template, agent), prompt);
    toast({
      title: "Prompt downloaded",
      description: promptFilename(template, agent),
      tone: "info",
    });
  };

  return (
    <section id="prompt" className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-2.5 py-1 text-2xs font-medium uppercase tracking-[0.1em] text-accent">
            <Terminal className="size-3" aria-hidden />
            Build it with AI
          </span>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
            Copy the prompt, recreate the template
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Paste this into your favourite coding agent. It carries the routes, the component list,
            the design tokens, the motion rules and the constraints — everything the agent needs to
            build {template.title} without guessing.
          </p>
        </div>
      </div>

      <div role="tablist" aria-label="Choose an agent" className="flex flex-wrap gap-1.5">
        {agents.map((option) => (
          <button
            key={option.id}
            role="tab"
            type="button"
            aria-selected={agent === option.id}
            onClick={() => selectAgent(option.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors",
              agent === option.id
                ? "border-accent-line bg-accent-soft text-accent"
                : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
            )}
          >
            {option.name}
          </button>
        ))}
      </div>

      <p className="mt-2.5 text-xs text-faint">{agentMeta.description}</p>

      <div className="mt-4">
        <PromptViewer
          prompt={prompt}
          copied={copied}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onExpand={() => setFullscreen(true)}
        />
      </div>

      <Modal
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        title={`${template.title} — ${agentMeta.name} prompt`}
        description="Scroll the full brief, or copy it straight from here."
        size="full"
      >
        <div className="p-4 sm:p-5">
          <PromptViewer
            prompt={prompt}
            copied={copied}
            onCopy={handleCopy}
            onDownload={handleDownload}
            fullHeight
          />
        </div>
      </Modal>
    </section>
  );
}
