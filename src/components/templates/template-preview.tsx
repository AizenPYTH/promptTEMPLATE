"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Expand, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { createPortal } from "react-dom";
import { getTemplate } from "@/data/templates";
import { TemplateVisual } from "@/components/visuals/template-visual";
import { cn } from "@/lib/utils";

type Viewport = "desktop" | "tablet" | "mobile";

const viewports: { id: Viewport; label: string; icon: typeof Monitor; width: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%", hint: "1440px" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "768px", hint: "768px" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "390px", hint: "390px" },
];

export function TemplatePreview({ slug }: { slug: string }) {
  const template = getTemplate(slug);
  const frames = template
    ? [{ id: "main", label: "Overview", caption: template.tagline, visual: template.visual }, ...template.screenshots]
    : [];
  const [active, setActive] = useState(0);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [lightbox, setLightbox] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % frames.length), [frames.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + frames.length) % frames.length), [frames.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [lightbox, next, prev]);

  if (!template) return null;

  const current = frames[active];
  const frameWidth = viewports.find((v) => v.id === viewport)?.width ?? "100%";

  return (
    <section aria-label="Template preview">
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface-2 px-3 py-2.5">
          <span className="hidden gap-1.5 sm:flex" aria-hidden>
            <span className="size-2.5 rounded-full border border-line bg-surface-3" />
            <span className="size-2.5 rounded-full border border-line bg-surface-3" />
            <span className="size-2.5 rounded-full border border-line bg-surface-3" />
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-2xs text-faint">
            {template.demoUrl ?? `preview.promptly.design/${template.slug}`}
            <span className="ml-2 text-faint/70">· {current.label}</span>
          </span>

          <div className="flex items-center gap-1" role="group" aria-label="Preview viewport">
            {viewports.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setViewport(option.id)}
                  aria-pressed={viewport === option.id}
                  title={`${option.label} — ${option.hint}`}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-sm transition-colors",
                    viewport === option.id ? "bg-surface text-ink shadow-soft" : "text-faint hover:text-muted",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  <span className="sr-only">{option.label} preview</span>
                </button>
              );
            })}
            <span className="mx-1 h-4 w-px bg-line" aria-hidden />
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="flex size-7 items-center justify-center rounded-sm text-faint transition-colors hover:text-ink"
              aria-label="Open full screen preview"
            >
              <Expand className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>

        <div className={cn("bg-surface-2 transition-[padding] duration-200", viewport === "desktop" ? "p-0" : "p-4 sm:p-8")}>
          <div
            className={cn(
              "mx-auto overflow-hidden bg-surface transition-[max-width] duration-300 ease-out",
              viewport !== "desktop" && "rounded-lg border border-line shadow-card",
            )}
            style={{ maxWidth: frameWidth }}
          >
            <TemplateVisual
              kind={current.visual}
              accent={template.accent}
              seed={`${template.slug}-${current.id}`}
              label={`${template.title} — ${current.label}: ${current.caption}`}
              className={cn("w-full", viewport === "mobile" ? "aspect-[9/16]" : "aspect-[16/10]")}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="min-w-0 flex-1 truncate text-[13px] text-muted">
          <span className="font-medium text-ink">{current.label}.</span> {current.caption}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            Open demo
          </button>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5" aria-label="Screenshots">
        {frames.map((frame, index) => (
          <li key={frame.id}>
            <button
              type="button"
              onClick={() => {
                setActive(index);
                if (index !== active) return;
                setLightbox(true);
              }}
              aria-pressed={index === active}
              className={cn(
                "group block w-full overflow-hidden rounded-lg border bg-surface-2 text-left transition-[border-color,transform] hover:-translate-y-0.5",
                index === active ? "border-accent" : "border-line hover:border-line-strong",
              )}
            >
              <TemplateVisual
                kind={frame.visual}
                accent={template.accent}
                seed={`${template.slug}-${frame.id}`}
                label={`${frame.label} thumbnail`}
                className="aspect-[16/10] w-full"
              />
              <span className="block truncate px-2.5 py-2 text-2xs font-medium text-muted group-hover:text-ink">
                {frame.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {lightbox && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[95] flex flex-col bg-[var(--overlay)] backdrop-blur-sm animate-fade-in">
              <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {template.title} — {current.label}
                  </p>
                  <p className="truncate text-xs text-muted">{current.caption}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="mr-2 hidden text-xs tabular-nums text-muted sm:block">
                    {active + 1} / {frames.length}
                  </span>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous screenshot"
                    className="flex size-9 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next screenshot"
                    className="flex size-9 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink"
                  >
                    <ChevronRight className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightbox(false)}
                    aria-label="Close preview"
                    autoFocus
                    className="flex size-9 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-6xl overflow-hidden rounded-xl border border-line bg-surface shadow-float">
                  <TemplateVisual
                    kind={current.visual}
                    accent={template.accent}
                    seed={`${template.slug}-${current.id}`}
                    label={`${template.title} — ${current.label}`}
                    className="aspect-[16/10] w-full"
                  />
                </div>
              </div>
              <p className="pb-4 text-center text-2xs text-faint">
                Use ← and → to move between screenshots, Esc to close
              </p>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
