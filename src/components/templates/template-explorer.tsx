"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, Rows3, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import type { TemplateFilters } from "@/types/template";
import { defaultFilters, filterTemplates, sortOptions } from "@/lib/catalog";
import { activeFilterCount, parseFilters, serialiseFilters } from "@/lib/url-filters";
import { categoryMap, styleMap, technologyMap } from "@/data/taxonomy";
import { FilterPanel } from "@/components/templates/filter-panel";
import { TemplateGrid } from "@/components/templates/template-grid";
import { TemplateGridSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/field";
import { createLocalStore, useStore } from "@/lib/client-store";
import { storageKeys } from "@/lib/storage";
import { cn, pluralise } from "@/lib/utils";

const PAGE_SIZE = 9;
type Layout = "grid" | "list";

const layoutStore = createLocalStore<Layout>(storageKeys.layout, "grid");

export function TemplateExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the single source of truth for the filter state, so back and
  // forward navigation works and any view can be shared as a link.
  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const [queryInput, setQueryInput] = useState(filters.query);
  const [lastQuery, setLastQuery] = useState(filters.query);
  const [lastFilters, setLastFilters] = useState(filters);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const layout = useStore(layoutStore, "grid");

  // Adjust derived state during render rather than in an effect: no extra
  // commit, and no flash of the previous results.
  if (lastQuery !== filters.query) {
    setLastQuery(filters.query);
    setQueryInput(filters.query);
  }

  if (lastFilters !== filters) {
    setLastFilters(filters);
    setPending(true);
    setVisible(PAGE_SIZE);
  }

  const update = useCallback(
    (next: TemplateFilters) => {
      const serialised = serialiseFilters(next);
      router.replace(serialised ? `${pathname}?${serialised}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  // Debounce the search box into the URL.
  useEffect(() => {
    if (queryInput === filters.query) return;
    const timer = setTimeout(() => update({ ...filters, query: queryInput }), 240);
    return () => clearTimeout(timer);
  }, [queryInput, filters, update]);

  // A short skeleton pass on every change — the catalogue is local, but the
  // interface should behave the way it would against an API.
  useEffect(() => {
    const timer = setTimeout(() => setPending(false), 180);
    return () => clearTimeout(timer);
  }, [filters]);

  const results = useMemo(() => filterTemplates(filters), [filters]);
  const shown = results.slice(0, visible);
  const activeCount = activeFilterCount(filters);

  const setLayoutPersisted = (next: Layout) => layoutStore.set(next);

  const chips = [
    ...filters.categories.map((id) => ({
      key: `c-${id}`,
      label: categoryMap.get(id)?.name ?? id,
      remove: () => update({ ...filters, categories: filters.categories.filter((v) => v !== id) }),
    })),
    ...filters.styles.map((id) => ({
      key: `s-${id}`,
      label: styleMap.get(id)?.name ?? id,
      remove: () => update({ ...filters, styles: filters.styles.filter((v) => v !== id) }),
    })),
    ...filters.technologies.map((id) => ({
      key: `t-${id}`,
      label: technologyMap.get(id)?.name ?? id,
      remove: () => update({ ...filters, technologies: filters.technologies.filter((v) => v !== id) }),
    })),
    ...filters.price.map((id) => ({
      key: `p-${id}`,
      label: id === "free" ? "Free" : "Premium",
      remove: () => update({ ...filters, price: filters.price.filter((v) => v !== id) }),
    })),
    ...(filters.minRating
      ? [{ key: "rating", label: `${filters.minRating.toFixed(1)}+ rating`, remove: () => update({ ...filters, minRating: 0 }) }]
      : []),
  ];

  const clearAll = () => {
    setQueryInput("");
    update({ ...defaultFilters, sort: filters.sort });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[228px_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold">Filters</h2>
            {activeCount > 0 ? (
              <button type="button" onClick={clearAll} className="text-xs text-muted transition-colors hover:text-ink">
                Clear all
              </button>
            ) : null}
          </div>
          <div className="max-h-[calc(100vh-9rem)] overflow-y-auto scrollbar-slim pr-1">
            <FilterPanel filters={filters} onChange={update} />
          </div>
        </div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
            <input
              type="search"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Search by name, tag, technology or author…"
              aria-label="Search templates"
              className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm placeholder:text-faint transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setSheetOpen(true)}
              className="lg:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filters
              {activeCount > 0 ? (
                <span className="rounded-full bg-accent px-1.5 text-2xs font-semibold text-accent-ink">{activeCount}</span>
              ) : null}
            </Button>

            <label className="sr-only" htmlFor="sort-templates">
              Sort templates
            </label>
            <Select
              id="sort-templates"
              value={filters.sort}
              onChange={(event) => update({ ...filters, sort: event.target.value as TemplateFilters["sort"] })}
              className="w-full sm:w-44"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>

            <div className="hidden items-center rounded-md border border-line p-0.5 sm:flex">
              {([
                { id: "grid" as const, icon: LayoutGrid, label: "Grid layout" },
                { id: "list" as const, icon: Rows3, label: "List layout" },
              ]).map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLayoutPersisted(option.id)}
                    aria-label={option.label}
                    aria-pressed={layout === option.id}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-sm transition-colors",
                      layout === option.id ? "bg-surface-2 text-ink" : "text-faint hover:text-muted",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {chips.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.remove}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                {chip.label}
                <X className="size-3" aria-hidden />
                <span className="sr-only">Remove filter</span>
              </button>
            ))}
            <button type="button" onClick={clearAll} className="text-xs text-faint underline-offset-2 hover:text-ink hover:underline">
              Clear all
            </button>
          </div>
        ) : null}

        <p className="mt-4 text-[13px] text-muted" aria-live="polite">
          {pending ? "Updating results…" : `${pluralise(results.length, "template")}`}
          {filters.query.trim() && !pending ? ` matching “${filters.query.trim()}”` : ""}
        </p>

        <div className="mt-5">
          {pending ? (
            <TemplateGridSkeleton count={6} />
          ) : results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No templates match those filters"
              description="Try removing a filter, widening the technology list, or searching for something broader like “dashboard” or “landing”."
              action={
                <Button variant="outline" onClick={clearAll}>
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <>
              <TemplateGrid templates={shown} variant={layout === "list" ? "horizontal" : "grid"} />
              {visible < results.length ? (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <Button variant="secondary" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load more templates
                  </Button>
                  <p className="text-xs text-faint tabular-nums">
                    Showing {shown.length} of {results.length}
                  </p>
                </div>
              ) : results.length > PAGE_SIZE ? (
                <p className="mt-10 text-center text-xs text-faint">That’s all {results.length} templates.</p>
              ) : null}
            </>
          )}
        </div>
      </div>

      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        description={`${results.length} templates match your current selection.`}
        footer={
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={clearAll} className="text-[13px] text-muted transition-colors hover:text-ink">
              Clear all
            </button>
            <Button onClick={() => setSheetOpen(false)}>Show {results.length} results</Button>
          </div>
        }
      >
        <div className="px-5 py-4">
          <FilterPanel filters={filters} onChange={update} />
        </div>
      </Modal>
    </div>
  );
}
