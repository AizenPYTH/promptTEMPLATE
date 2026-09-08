"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/client-store";
import { agentStore } from "@/lib/preferences";
import { Check, Copy, Download, Link2, Share2 } from "lucide-react";
import type { AgentId } from "@/types/template";
import { agents } from "@/data/site";
import { buildPrompt, promptFilename } from "@/data/prompts";
import { getTemplate } from "@/data/templates";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FavoriteButton } from "@/components/templates/favorite-button";
import { useToast } from "@/components/providers/toast-provider";
import { copyText, downloadText } from "@/lib/clipboard";

export function TemplateActions({ slug }: { slug: string }) {
  const template = getTemplate(slug);
  const stored = useStore(agentStore, "claude-code");
  const agent: AgentId = agents.some((a) => a.id === stored) ? stored : "claude-code";
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrlValue, setShareUrlValue] = useState("");
  const { toast } = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const agentName = agents.find((a) => a.id === agent)?.name ?? "Claude Code";

  if (!template) return null;

  const handleCopy = async () => {
    const ok = await copyText(buildPrompt(template, agent));
    setCopied(ok);
    toast({
      title: ok ? "Prompt copied to clipboard" : "Could not copy the prompt",
      description: ok ? `${template.title} · ${agentName}` : "Try the download button instead.",
      tone: ok ? "success" : "warning",
    });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2400);
  };

  const handleDownload = () => {
    downloadText(promptFilename(template, agent), buildPrompt(template, agent));
    toast({ title: "Prompt downloaded", description: promptFilename(template, agent), tone: "info" });
  };

  const handleShare = async () => {
    const url = window.location.href;
    setShareUrlValue(url);
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: `${template.title} — Promptly`, text: template.description, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setShareOpen(true);
  };

  const copyLink = async () => {
    const ok = await copyText(shareUrlValue);
    toast({
      title: ok ? "Link copied" : "Could not copy the link",
      description: ok ? shareUrlValue : undefined,
      tone: ok ? "success" : "warning",
    });
    if (ok) setShareOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="md" onClick={handleCopy}>
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copied" : "Copy prompt"}
        </Button>
        <Button variant="outline" size="md" onClick={handleDownload}>
          <Download className="size-4" aria-hidden />
          Download
        </Button>
        <FavoriteButton slug={template.slug} title={template.title} variant="button" size="md" />
        <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share this template">
          <Share2 className="size-4" aria-hidden />
        </Button>
      </div>

      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share this template"
        description="Anyone with the link can view the template and copy its prompt."
      >
        <div className="p-5">
          <div className="flex items-center gap-2 rounded-md border border-line bg-surface-2 p-2">
            <Link2 className="ml-1 size-4 shrink-0 text-faint" aria-hidden />
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">{shareUrlValue}</span>
            <Button size="sm" onClick={copyLink}>
              Copy link
            </Button>
          </div>
          <p className="mt-3 text-xs text-faint">
            Sharing uses your device&apos;s share sheet when one is available; otherwise the link is copied here.
          </p>
        </div>
      </Modal>
    </>
  );
}
