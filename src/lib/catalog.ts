import { templates } from "@/data/templates";
import { collections } from "@/data/collections";
import { categories } from "@/data/taxonomy";
import type {
  CategoryId,
  Collection,
  PriceFilter,
  SortId,
  StyleId,
  Template,
  TemplateFilters,
  TechnologyId,
} from "@/types/template";

/**
 * The only module that knows where catalogue records come from.
 * Swap the imports above for fetch calls and the rest of the app is unchanged.
 */

export const defaultFilters: TemplateFilters = {
  query: "",
  categories: [],
  styles: [],
  technologies: [],
  price: [],
  minRating: 0,
  sort: "popular",
};

export const sortOptions: { id: SortId; label: string }[] = [
  { id: "popular", label: "Most popular" },
  { id: "newest", label: "Newest" },
  { id: "most-copied", label: "Most copied" },
  { id: "top-rated", label: "Highest rated" },
];

function haystack(template: Template): string {
  return [
    template.title,
    template.tagline,
    template.description,
    template.category,
    template.style,
    template.author.name,
    template.author.handle,
    ...template.tags,
    ...template.technologies,
  ]
    .join(" ")
    .toLowerCase();
}

const searchIndex = new Map(templates.map((t) => [t.id, haystack(t)]));

export function matchesQuery(template: Template, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const index = searchIndex.get(template.id) ?? haystack(template);
  return q.split(/\s+/).every((term) => index.includes(term));
}

/** Relevance score, highest first. Title matches beat tag matches. */
export function scoreTemplate(template: Template, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return template.copies;
  let score = 0;
  const title = template.title.toLowerCase();
  if (title === q) score += 1000;
  if (title.startsWith(q)) score += 400;
  if (title.includes(q)) score += 200;
  if (template.tagline.toLowerCase().includes(q)) score += 90;
  if (template.description.toLowerCase().includes(q)) score += 50;
  if (template.tags.some((tag) => tag.includes(q))) score += 70;
  if (template.technologies.some((tech) => tech.includes(q))) score += 60;
  if (template.category.includes(q)) score += 80;
  if (template.author.name.toLowerCase().includes(q)) score += 40;
  return score + template.copies / 1000;
}

export function sortTemplates(list: Template[], sort: SortId): Template[] {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "most-copied":
      return sorted.sort((a, b) => b.copies - a.copies);
    case "top-rated":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "popular":
    default:
      return sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          b.copies * b.rating - a.copies * a.rating,
      );
  }
}

export function filterTemplates(filters: TemplateFilters, source: Template[] = templates): Template[] {
  const result = source.filter((template) => {
    if (!matchesQuery(template, filters.query)) return false;
    if (filters.categories.length && !filters.categories.includes(template.category)) return false;
    if (filters.styles.length && !filters.styles.includes(template.style)) return false;
    if (
      filters.technologies.length &&
      !filters.technologies.some((tech) => template.technologies.includes(tech))
    )
      return false;
    if (filters.price.length) {
      const bucket: PriceFilter = template.price === 0 ? "free" : "premium";
      if (!filters.price.includes(bucket)) return false;
    }
    if (filters.minRating && template.rating < filters.minRating) return false;
    return true;
  });

  if (filters.query.trim() && filters.sort === "popular") {
    return result.sort((a, b) => scoreTemplate(b, filters.query) - scoreTemplate(a, filters.query));
  }
  return sortTemplates(result, filters.sort);
}

export function searchTemplates(query: string, limit?: number): Template[] {
  const matches = templates.filter((t) => matchesQuery(t, query));
  const sorted = matches.sort((a, b) => scoreTemplate(b, query) - scoreTemplate(a, query));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function featuredTemplates(limit = 6): Template[] {
  return sortTemplates(templates.filter((t) => t.featured), "popular").slice(0, limit);
}

export function templatesByCategory(category: CategoryId): Template[] {
  return sortTemplates(templates.filter((t) => t.category === category), "popular");
}

export function categoryStats(category: CategoryId) {
  const list = templatesByCategory(category);
  return {
    total: list.length,
    free: list.filter((t) => t.price === 0).length,
    premium: list.filter((t) => t.price > 0).length,
    averageRating: list.length
      ? Number((list.reduce((sum, t) => sum + t.rating, 0) / list.length).toFixed(1))
      : 0,
  };
}

/** Same category first, then shared technologies, then anything popular. */
export function similarTemplates(template: Template, limit = 3): Template[] {
  return templates
    .filter((t) => t.id !== template.id)
    .map((t) => {
      let score = 0;
      if (t.category === template.category) score += 40;
      if (t.style === template.style) score += 25;
      score += t.technologies.filter((tech) => template.technologies.includes(tech)).length * 8;
      score += t.tags.filter((tag) => template.tags.includes(tag)).length * 6;
      return { template: t, score: score + t.rating };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.template);
}

export function collectionsForTemplate(slug: string): Collection[] {
  return collections.filter((c) => c.templateSlugs.includes(slug));
}

export const catalogTotals = {
  templates: templates.length,
  free: templates.filter((t) => t.price === 0).length,
  categories: categories.length,
  collections: collections.length,
  creators: new Set(templates.map((t) => t.author.handle)).size,
};

export type { Template, CategoryId, StyleId, TechnologyId };
