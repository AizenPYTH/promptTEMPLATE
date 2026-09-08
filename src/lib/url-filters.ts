import type {
  CategoryId,
  PriceFilter,
  SortId,
  StyleId,
  TechnologyId,
  TemplateFilters,
} from "@/types/template";
import { categories, styles, technologies } from "@/data/taxonomy";
import { defaultFilters } from "@/lib/catalog";

/**
 * Filters live in the URL so any view can be shared:
 *   /templates?category=saas,ai&style=dark&tech=nextjs&price=free&sort=newest
 */

const categoryIds = new Set(categories.map((c) => c.id));
const styleIds = new Set(styles.map((s) => s.id));
const techIds = new Set(technologies.map((t) => t.id));
const sortIds = new Set<SortId>(["popular", "newest", "most-copied", "top-rated"]);

function list(value: string | null): string[] {
  return value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];
}

export function parseFilters(params: URLSearchParams): TemplateFilters {
  const rating = Number(params.get("rating") ?? "0");
  const sort = params.get("sort") as SortId | null;
  return {
    query: params.get("q") ?? "",
    categories: list(params.get("category")).filter((v): v is CategoryId =>
      categoryIds.has(v as CategoryId),
    ),
    styles: list(params.get("style")).filter((v): v is StyleId => styleIds.has(v as StyleId)),
    technologies: list(params.get("tech")).filter((v): v is TechnologyId =>
      techIds.has(v as TechnologyId),
    ),
    price: list(params.get("price")).filter((v): v is PriceFilter => v === "free" || v === "premium"),
    minRating: Number.isFinite(rating) && rating > 0 ? Math.min(rating, 5) : 0,
    sort: sort && sortIds.has(sort) ? sort : defaultFilters.sort,
  };
}

export function serialiseFilters(filters: TemplateFilters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.styles.length) params.set("style", filters.styles.join(","));
  if (filters.technologies.length) params.set("tech", filters.technologies.join(","));
  if (filters.price.length) params.set("price", filters.price.join(","));
  if (filters.minRating) params.set("rating", String(filters.minRating));
  if (filters.sort !== defaultFilters.sort) params.set("sort", filters.sort);
  return params.toString();
}

export function activeFilterCount(filters: TemplateFilters): number {
  return (
    filters.categories.length +
    filters.styles.length +
    filters.technologies.length +
    filters.price.length +
    (filters.minRating ? 1 : 0)
  );
}

export function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}
