import Link from "next/link";
import { ArrowUpRight, Copy } from "lucide-react";
import type { Template } from "@/types/template";
import { TemplateVisual } from "@/components/visuals/template-visual";
import { FavoriteButton } from "@/components/templates/favorite-button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { categoryMap, technologyMap } from "@/data/taxonomy";
import { cn, formatCount, formatPrice } from "@/lib/utils";

export type TemplateCardVariant = "grid" | "compact" | "featured" | "horizontal";

function Badges({ template }: { template: Template }) {
  return (
    <>
      {template.featured ? <Badge tone="accent">Featured</Badge> : null}
      {template.isNew ? <Badge tone="outline">New</Badge> : null}
      {!template.featured && !template.isNew && template.popular ? <Badge tone="outline">Popular</Badge> : null}
    </>
  );
}

export function TemplateCard({
  template,
  variant = "grid",
  priority = false,
  className,
}: {
  template: Template;
  variant?: TemplateCardVariant;
  priority?: boolean;
  className?: string;
}) {
  const category = categoryMap.get(template.category);
  const href = `/templates/${template.slug}`;

  if (variant === "horizontal") {
    return (
      <article
        className={cn(
          "group relative flex gap-4 rounded-lg border border-line bg-surface p-3 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-card",
          className,
        )}
      >
        <div className="relative w-32 shrink-0 overflow-hidden rounded-md border border-line bg-surface-2 sm:w-44">
          <TemplateVisual
            kind={template.visual}
            accent={template.accent}
            seed={template.slug}
            label={`${template.title} preview`}
            className="aspect-[16/10] w-full"
          />
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-[15px] font-semibold tracking-[-0.015em]">
              <Link href={href} className="after:absolute after:inset-0 after:content-['']">
                {template.title}
              </Link>
            </h3>
            <span className="shrink-0 text-[13px] font-medium tabular-nums">{formatPrice(template.price)}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-muted">{template.description}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-faint">
            <span>{category?.name}</span>
            <span aria-hidden>·</span>
            <Rating value={template.rating} />
            <span aria-hidden>·</span>
            <span className="tabular-nums">{formatCount(template.copies)} copies</span>
          </div>
        </div>
        <FavoriteButton slug={template.slug} title={template.title} variant="inline" className="relative z-10 self-start" />
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article
        className={cn(
          "group relative overflow-hidden rounded-lg border border-line bg-surface transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-card",
          className,
        )}
      >
        <div className="overflow-hidden border-b border-line bg-surface-2">
          <TemplateVisual
            kind={template.visual}
            accent={template.accent}
            seed={template.slug}
            label={`${template.title} preview`}
            className="aspect-[16/10] w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="min-w-0">
            <h3 className="truncate text-[13.5px] font-semibold">
              <Link href={href} className="after:absolute after:inset-0 after:content-['']">
                {template.title}
              </Link>
            </h3>
            <p className="truncate text-xs text-muted">{template.tagline}</p>
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums text-muted">{formatPrice(template.price)}</span>
        </div>
      </article>
    );
  }

  const featured = variant === "featured";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card",
        className,
      )}
    >
      <div className="relative overflow-hidden border-b border-line bg-surface-2">
        <TemplateVisual
          kind={template.visual}
          accent={template.accent}
          seed={template.slug}
          label={`${template.title} — ${template.tagline}`}
          className={cn(
            "w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]",
            featured ? "aspect-[16/9]" : "aspect-[16/10]",
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color-mix(in_srgb,var(--surface)_75%,transparent)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badges template={template} />
        </div>
        <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-150 focus-within:opacity-100 group-hover:opacity-100 max-md:opacity-100">
          <FavoriteButton slug={template.slug} title={template.title} />
        </div>
        <span className="pointer-events-none absolute bottom-3 right-3 z-10 inline-flex translate-y-1 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs font-medium opacity-0 shadow-soft transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          View template
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className={cn("font-semibold tracking-[-0.015em]", featured ? "text-base" : "text-[15px]")}>
            <Link href={href} className="rounded-sm after:absolute after:inset-0 after:content-['']">
              {template.title}
            </Link>
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-sm px-1.5 py-0.5 text-xs font-medium tabular-nums",
              template.price === 0 ? "bg-surface-2 text-positive" : "text-ink",
            )}
          >
            {formatPrice(template.price)}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-muted">{template.description}</p>

        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-sm border border-line px-1.5 py-0.5 text-2xs font-medium text-muted">
            {category?.name}
          </span>
          {template.technologies.slice(0, priority ? 4 : 3).map((tech) => (
            <span key={tech} className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-2xs text-faint">
              {technologyMap.get(tech)?.short ?? tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3.5 text-xs text-faint">
          <span className="truncate">{template.author.name}</span>
          <span className="flex shrink-0 items-center gap-3">
            <Rating value={template.rating} />
            <span className="flex items-center gap-1 tabular-nums" title={`${template.copies} prompt copies`}>
              <Copy className="size-3" aria-hidden />
              {formatCount(template.copies)}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
