"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Expand, Monitor, Pause, Play, Smartphone, Tablet, X } from "lucide-react";
import { getTemplate } from "@/data/templates";
import { TemplatePreviewFrame } from "@/components/preview/preview-frame";
import { cn } from "@/lib/utils";

type Viewport = "desktop" | "tablet" | "mobile";

const viewports: { id: Viewport; label: string; icon: typeof Monitor; width: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%", hint: "1440px" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "834px", hint: "834px" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "390px", hint: "390px" },
];

/**
 * The large preview. It runs the same markup as the card, at the same design
 * size — the device switcher only changes how wide the box is, and the
 * container query does the rest.
 */
export function TemplatePreview({ slug }: { slug: string }) {
  const template = getTemplate(slug);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [playing, setPlaying] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  if (!template) return null;
  const frameWidth = viewports.find((v) => v.id === viewport)?.width ?? "100%";

  return (
    <section aria-label={`${template.title} preview`}>
      <div className="overflow-hidden rounded-panel border border-line bg-surface-3">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <span className="min-w-0 flex-1 truncate font-mono text-label-lg uppercase text-soft">
            {template.demoUrl ?? `${template.slug}.promptly.design`}
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
                    "flex size-8 items-center justify-center rounded-control transition-colors",
                    viewport === option.id ? "bg-surface-3 text-ink" : "text-soft hover:text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  <span className="sr-only">{option.label} preview</span>
                </button>
              );
            })}
            <span className="mx-1 h-4 w-px bg-[var(--border-1)]" aria-hidden />
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              aria-pressed={!playing}
              className="flex h-8 items-center gap-1.5 rounded-control px-2 font-mono text-label uppercase tracking-[0.14em] text-soft transition-colors hover:text-ink"
            >
              {playing ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
              {playing ? "Pause" : "Play"}
              <span className="sr-only">motion</span>
            </button>
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="flex size-8 items-center justify-center rounded-control text-soft transition-colors hover:text-ink"
              aria-label="Open the preview full screen"
            >
              <Expand className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className={cn("bg-surface-2-1 transition-[padding] duration-300", viewport === "desktop" ? "p-0" : "p-6 sm:p-10")}>
          <div
            className={cn(
              "mx-auto overflow-hidden transition-[max-width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              viewport !== "desktop" && "rounded-card border border-line shadow-e2",
            )}
            style={{ maxWidth: frameWidth }}
          >
            <TemplatePreviewFrame
              template={template}
              size="large"
              playing={playing}
              className="aspect-[16/10] w-full"
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-caption text-soft">
        This is the template itself, running. Switch the viewport, pause the motion, or open it full
        screen — nothing here is a screenshot.
      </p>

      {fullscreen && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[95] flex flex-col bg-canvas">
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-h5 font-semibold">{template.title}</p>
                  <p className="truncate font-mono text-label uppercase tracking-[0.14em] text-soft">
                    {template.tagline}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaying((v) => !v)}
                    className="flex h-9 items-center gap-1.5 rounded-control border border-line-strong px-3 text-caption text-muted transition-colors hover:text-ink"
                  >
                    {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
                    {playing ? "Pause" : "Play"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFullscreen(false)}
                    aria-label="Close the preview"
                    autoFocus
                    className="flex size-9 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:text-ink"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-[1400px] overflow-hidden rounded-panel border border-line shadow-e3">
                  <TemplatePreviewFrame
                    template={template}
                    size="large"
                    playing={playing}
                    className="aspect-[16/10] w-full"
                  />
                </div>
              </div>
              <p className="pb-4 text-center font-mono text-label uppercase tracking-[0.14em] text-soft">
                Esc to close
              </p>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
