"use client";

import { Star } from "lucide-react";
import type { PriceFilter, TemplateFilters } from "@/types/template";
import { categories, styles, technologies } from "@/data/taxonomy";
import { templates } from "@/data/templates";
import { Checkbox } from "@/components/ui/field";
import { toggleValue } from "@/lib/url-filters";
import { cn } from "@/lib/utils";

const counts = {
  category: new Map(categories.map((c) => [c.id, templates.filter((t) => t.category === c.id).length])),
  style: new Map(styles.map((s) => [s.id, templates.filter((t) => t.style === s.id).length])),
  technology: new Map(
    technologies.map((t) => [t.id, templates.filter((tpl) => tpl.technologies.includes(t.id)).length]),
  ),
  price: new Map<PriceFilter, number>([
    ["free", templates.filter((t) => t.price === 0).length],
    ["premium", templates.filter((t) => t.price > 0).length],
  ]),
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-2 text-2xs font-medium uppercase tracking-[0.12em] text-faint">{title}</h3>
      <div className="-mx-0.5">{children}</div>
    </section>
  );
}

export function FilterPanel({
  filters,
  onChange,
  className,
}: {
  filters: TemplateFilters;
  onChange: (next: TemplateFilters) => void;
  className?: string;
}) {
  const ratings = [4.9, 4.8, 4.7];

  return (
    <div className={cn("text-sm", className)}>
      <Group title="Category">
        {categories.map((category) => (
          <Checkbox
            key={category.id}
            id={`filter-category-${category.id}`}
            label={category.name}
            count={counts.category.get(category.id)}
            checked={filters.categories.includes(category.id)}
            onChange={() => onChange({ ...filters, categories: toggleValue(filters.categories, category.id) })}
          />
        ))}
      </Group>

      <Group title="Style">
        {styles.map((style) => (
          <Checkbox
            key={style.id}
            id={`filter-style-${style.id}`}
            label={style.name}
            count={counts.style.get(style.id)}
            checked={filters.styles.includes(style.id)}
            onChange={() => onChange({ ...filters, styles: toggleValue(filters.styles, style.id) })}
          />
        ))}
      </Group>

      <Group title="Technology">
        {technologies.map((tech) => (
          <Checkbox
            key={tech.id}
            id={`filter-tech-${tech.id}`}
            label={tech.name}
            count={counts.technology.get(tech.id)}
            checked={filters.technologies.includes(tech.id)}
            onChange={() => onChange({ ...filters, technologies: toggleValue(filters.technologies, tech.id) })}
          />
        ))}
      </Group>

      <Group title="Price">
        {(["free", "premium"] as PriceFilter[]).map((bucket) => (
          <Checkbox
            key={bucket}
            id={`filter-price-${bucket}`}
            label={bucket === "free" ? "Free" : "Premium"}
            count={counts.price.get(bucket)}
            checked={filters.price.includes(bucket)}
            onChange={() => onChange({ ...filters, price: toggleValue(filters.price, bucket) })}
          />
        ))}
      </Group>

      <Group title="Rating">
        <div className="flex flex-col gap-1 pt-1">
          {ratings.map((rating) => {
            const active = filters.minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onChange({ ...filters, minRating: active ? 0 : rating })}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                  active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Star className={cn("size-3.5", active ? "fill-accent text-accent" : "text-line-strong")} aria-hidden />
                {rating.toFixed(1)} and above
              </button>
            );
          })}
        </div>
      </Group>
    </div>
  );
}
