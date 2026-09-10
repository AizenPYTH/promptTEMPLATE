"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy } from "lucide-react";
import type { Template } from "@/types/template";
import { TemplatePreviewFrame } from "@/components/preview/preview-frame";
import { TiltShell } from "@/components/templates/tilt-shell";
import { FavoriteButton } from "@/components/templates/favorite-button";
import { CardCopyButton } from "@/components/templates/card-copy-button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { categoryMap, technologyMap } from "@/data/taxonomy";
import { cn, formatCount, formatPrice } from "@/lib/utils";

export type TemplateCardVariant = "grid" | "compact" | "featured" | "horizontal";

/**
 * The card is the product's shop window: it shows the template running, not a
 * picture of it. Motion inside the preview stays parked until the card is
 * hovered or focused, so a nine-card grid costs nothing at rest.
 */
export function TemplateCard({
  template,
  variant = "grid",
  className,
}: {
  template: Template;
  variant?: TemplateCardVariant;
  priority?: boolean;
  className?: string;
}) {
  const [awake, setAwake] = useState(false);
  const category = categoryMap.get(template.category);
  const href = `/templates/${template.slug}`;

  if (variant === "horizontal") {
    return (
      <article
        className={cn(
          "group preview-host relative flex gap-4 rounded-card border border-line bg-surface-2 p-3 transition-[border-color,background-color] hover:border-line-strong hover:bg-surface-3",
          className,
        )}
      >
        <div className="w-32 shrink-0 overflow-hidden rounded-control border border-line sm:w-44">
          <TemplatePreviewFrame template={template} className="aspect-[16/10] w-full" />
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate font-display text-h5 font-semibold tracking-[-0.01em]">
              <Link href={href} className="after:absolute after:inset-0 after:content-['']">
                {template.title}
              </Link>
            </h3>
            <span className="tabular shrink-0 text-body-sm font-medium">{formatPrice(template.price)}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-body-sm text-muted">{template.description}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-caption text-soft">
            <span>{category?.name}</span>
            <span aria-hidden>·</span>
            <Rating value={template.rating} />
            <span aria-hidden>·</span>
            <span className="tabular">{formatCount(template.copies)} copies</span>
          </div>
        </div>
        <FavoriteButton slug={template.slug} title={template.title} variant="inline" className="relative z-10 self-start" />
      </article>
    );
  }

  const compact = variant === "compact";

  return (
    <TiltShell onWake={setAwake} className={cn("preview-host h-full", className)}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-card border bg-surface-2 transition-[border-color,background-color] duration-300",
          "border-line hover:border-[rgba(255,255,255,0.20)] hover:bg-surface-3 focus-within:border-[rgba(255,255,255,0.20)]",
        )}
      >
        <div className="relative overflow-hidden border-b border-line">
          <TemplatePreviewFrame
            template={template}
            size="small"
            playing={awake}
            className="aspect-[16/10] w-full"
          />

          {/* Specular — follows the pointer across the face of the card. */}
          <span className="specular pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {template.featured ? <Badge tone="accent">Featured</Badge> : null}
            {template.isNew ? <Badge tone="outline">New</Badge> : null}
          </div>

          {/* Effect 8: the action scrim. Rendered, not hover-gated, when focused. */}
          <div
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center gap-2 opacity-0 backdrop-blur-0 transition-[opacity,backdrop-filter] duration-300",
              "group-hover:opacity-100 group-hover:backdrop-blur-[8px] focus-within:opacity-100 focus-within:backdrop-blur-[8px]",
            )}
            style={{ background: "color-mix(in srgb, var(--canvas) 55%, transparent)" }}
          >
            <CardCopyButton slug={template.slug} title={template.title} />
            <Link
              href={href}
              className="inline-flex h-7 items-center gap-1.5 rounded-control border border-line-strong bg-surface-3 px-2 text-label font-medium text-ink"
            >
              Preview
              <ArrowUpRight className="size-3" aria-hidden />
            </Link>
            <FavoriteButton slug={template.slug} title={template.title} />
          </div>
        </div>

        <div className={cn("flex flex-1 flex-col", compact ? "p-3.5" : "p-4")}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-h5 font-semibold tracking-[-0.01em]">
              <Link href={href} className="rounded-control after:absolute after:inset-0 after:content-['']">
                {template.title}
              </Link>
            </h3>
            <span
              className={cn(
                "tabular shrink-0 rounded-control px-1.5 py-0.5 text-caption font-medium",
                template.price === 0 ? "bg-surface-3 text-positive" : "text-ink",
              )}
            >
              {formatPrice(template.price)}
            </span>
          </div>

          <p className={cn("mt-1.5 text-body-sm text-muted", compact ? "line-clamp-1" : "line-clamp-2")}>
            {compact ? template.tagline : template.description}
          </p>

          {!compact ? (
            <>
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-control border border-line px-1.5 py-0.5 text-label font-medium text-muted">
                  {category?.name}
                </span>
                {template.technologies.slice(0, 4).map((tech) => (
                  <span key={tech} className="rounded-control bg-surface-3 px-1.5 py-0.5 text-label text-soft">
                    {technologyMap.get(tech)?.short ?? tech}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3.5 text-caption text-soft">
                <span className="truncate">{template.author.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <Rating value={template.rating} />
                  <span className="tabular flex items-center gap-1" title={`${template.copies} prompt copies`}>
                    <Copy className="size-3" aria-hidden />
                    {formatCount(template.copies)}
                  </span>
                </span>
              </div>
            </>
          ) : null}
        </div>
      </article>
    </TiltShell>
  );
}
