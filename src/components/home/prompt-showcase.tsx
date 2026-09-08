"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AgentId } from "@/types/template";
import { agents } from "@/data/site";
import { buildPrompt, promptFilename, promptStats } from "@/data/prompts";
import { getTemplates } from "@/data/templates";
import { PromptViewer } from "@/components/prompt/prompt-viewer";
import { TemplateVisual } from "@/components/visuals/template-visual";
import { Container, SectionHeading } from "@/components/layout/container";
import { useToast } from "@/components/providers/toast-provider";
import { useStore } from "@/lib/client-store";
import { agentStore } from "@/lib/preferences";
import { copyText, downloadText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

/**
 * The homepage argument, made rather than asserted: pick a template, read the
 * actual prompt it ships, copy it. Same viewer as the template page — this is
 * the product, not a screenshot of it.
 */
export function PromptShowcase({ slugs }: { slugs: string[] }) {
  const templates = getTemplates(slugs);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const stored = useStore(agentStore, "claude-code");
  const agent: AgentId = agents.some((a) => a.id === stored) ? stored : "claude-code";
  const { toast } = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const template = templates[index];
  const prompt = buildPrompt(template, agent);
  const filename = promptFilename(template, agent);
  const stats = promptStats(prompt);
  const agentName = agents.find((a) => a.id === agent)?.name ?? "Claude Code";

  const handleCopy = async () => {
    const ok = await copyText(prompt);
    setCopied(ok);
    toast({
      title: ok ? "Prompt copied" : "Could not copy the prompt",
      description: ok ? `${template.title} · ${agentName}` : "Your browser blocked clipboard access.",
      tone: ok ? "success" : "warning",
    });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2400);
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
                ? "border-line bg-surface text-ink"
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
    <section className="border-t border-line py-16 sm:py-20">
      <Container size="wide">
        <SectionHeading
          title="This is what you copy"
          description="Not a screenshot and not a one-line description — a brief with the art direction, the routes, the tokens, the responsive rules and an explicit list of what not to do. Pick a template and read the real thing."
        />

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
          <div className="flex gap-3 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
            {templates.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setCopied(false);
                }}
                aria-pressed={i === index}
                className={cn(
                  "group flex w-[240px] shrink-0 gap-3 rounded-lg border p-2.5 text-left transition-colors lg:w-full",
                  i === index
                    ? "border-accent-line bg-accent-soft"
                    : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <span className="w-20 shrink-0 overflow-hidden rounded-md border border-line bg-surface-2">
                  <TemplateVisual
                    kind={item.visual}
                    accent={item.accent}
                    seed={item.slug}
                    label={`${item.title} preview`}
                    className="aspect-[16/10] w-full"
                  />
                </span>
                <span className="min-w-0 flex-1 py-0.5">
                  <span className={cn("block truncate text-[13.5px] font-semibold", i === index && "text-accent")}>
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">{item.tagline}</span>
                </span>
              </button>
            ))}
            <Link
              href="/templates"
              className="hidden items-center justify-between gap-2 rounded-lg border border-dashed border-line px-3 py-2.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink lg:flex"
            >
              Browse all templates
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          <div className="min-w-0">
            <PromptViewer
              prompt={prompt}
              filename={filename}
              tabs={tabStrip}
              copied={copied}
              onCopy={handleCopy}
              onDownload={() => {
                downloadText(filename, prompt);
                toast({ title: "Prompt downloaded", description: filename, tone: "info" });
              }}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-faint">
              <p>
                {stats.lines.toLocaleString("en-GB")} lines · {stats.characters.toLocaleString("en-GB")} characters ·
                every template ships one of these for each agent.
              </p>
              <Link
                href={`/templates/${template.slug}#prompt`}
                className="inline-flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-ink"
              >
                Open {template.title}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
