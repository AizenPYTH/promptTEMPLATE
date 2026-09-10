"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, Search, SearchX, X } from "lucide-react";
import { searchTemplates } from "@/lib/catalog";
import { categories } from "@/data/taxonomy";
import { collections } from "@/data/collections";
import { TemplateGrid } from "@/components/templates/template-grid";
import { TemplateGridSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { createLocalStore, useStore } from "@/lib/client-store";
import { storageKeys } from "@/lib/storage";
import { pluralise } from "@/lib/utils";

const EMPTY: string[] = [];
const recentStore = createLocalStore<string[]>(storageKeys.recentSearches, EMPTY);

const POPULAR = ["dashboard", "saas", "ai", "portfolio", "e-commerce", "dark", "next.js", "landing"];

export function SearchResults() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";

  const [input, setInput] = useState(initial);
  const [query, setQuery] = useState(initial);
  const [lastInitial, setLastInitial] = useState(initial);
  const recent = useStore(recentStore, EMPTY);

  // A new ?q= arrived (a link, or the back button): adopt it during render.
  if (lastInitial !== initial) {
    setLastInitial(initial);
    setInput(initial);
    setQuery(initial);
  }

  // While the debounce is outstanding the results on screen are stale.
  const pending = input !== query;

  // Debounce typing into the query, and mirror it into the URL.
  useEffect(() => {
    if (input === query) return;
    const timer = setTimeout(() => {
      setQuery(input);
      const trimmed = input.trim();
      router.replace(trimmed ? `${pathname}?q=${encodeURIComponent(trimmed)}` : pathname, { scroll: false });
    }, 260);
    return () => clearTimeout(timer);
  }, [input, query, pathname, router]);

  // Remember what was actually searched for, not every keystroke.
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;
    const timer = setTimeout(() => {
      const current = recentStore.get();
      recentStore.set([trimmed, ...current.filter((item) => item !== trimmed)].slice(0, 6));
    }, 900);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => (query.trim() ? searchTemplates(query) : []), [query]);
  const trimmed = query.trim();

  const relatedCategories = useMemo(() => {
    if (!trimmed) return [];
    const lower = trimmed.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(lower) || c.id.includes(lower)).slice(0, 4);
  }, [trimmed]);

  const relatedCollections = useMemo(() => {
    if (!trimmed) return [];
    const lower = trimmed.toLowerCase();
    return collections
      .filter((c) => c.title.toLowerCase().includes(lower) || c.description.toLowerCase().includes(lower))
      .slice(0, 3);
  }, [trimmed]);

  const clearRecent = () => recentStore.set([]);

  return (
    <div>
      <div className="relative max-w-2xl">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-soft" aria-hidden />
        <input
          type="search"
          autoFocus
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search templates, tags, technologies or authors…"
          aria-label="Search templates"
          className="h-12 w-full rounded-card border border-line bg-surface-2 pl-11 pr-4 text-[15px] placeholder:text-soft transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
        />
      </div>

      {trimmed ? (
        <p className="mt-5 text-sm text-muted" aria-live="polite">
          {pending ? "Searching…" : <>{pluralise(results.length, "result")} for “{trimmed}”</>}
        </p>
      ) : null}

      <div className="mt-6">
        {!trimmed ? (
          <div className="space-y-10">
            {recent.length > 0 ? (
              <section>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Recent searches</h2>
                  <button type="button" onClick={clearRecent} className="text-xs text-soft transition-colors hover:text-ink">
                    Clear
                  </button>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        onClick={() => setInput(term)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                      >
                        <Clock className="size-3 text-soft" aria-hidden />
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h2 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Popular searches</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => setInput(term)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      <Search className="size-3 text-soft" aria-hidden />
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Or jump to a category</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      <span className="size-1.5 rounded-full" style={{ background: category.accent }} aria-hidden />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : pending ? (
          <TemplateGridSkeleton count={6} />
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={`Nothing matches “${trimmed}”`}
            description="Check the spelling, try a shorter term, or search by technology — “next.js”, “astro”, “tailwind” all work."
            action={
              <>
                <ButtonLink href="/templates" variant="outline">
                  Browse all templates
                </ButtonLink>
                {POPULAR.slice(0, 3).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setInput(term)}
                    className="inline-flex h-9.5 items-center rounded-control border border-line px-4 text-sm font-medium text-muted transition-colors hover:text-ink"
                  >
                    Try “{term}”
                  </button>
                ))}
              </>
            }
          />
        ) : (
          <div className="space-y-12">
            <TemplateGrid templates={results} />

            {relatedCategories.length > 0 || relatedCollections.length > 0 ? (
              <section className="border-t border-line pt-8">
                <h2 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Related pages</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {relatedCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                      >
                        <span className="size-1.5 rounded-full" style={{ background: category.accent }} aria-hidden />
                        {category.name} templates
                      </Link>
                    </li>
                  ))}
                  {relatedCollections.map((collection) => (
                    <li key={collection.slug}>
                      <Link
                        href={`/collections/${collection.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                      >
                        {collection.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </div>

      {trimmed && !pending ? (
        <button
          type="button"
          onClick={() => setInput("")}
          className="mt-10 inline-flex items-center gap-1.5 text-[13px] text-soft transition-colors hover:text-ink"
        >
          <X className="size-3.5" aria-hidden />
          Clear search
        </button>
      ) : null}
    </div>
  );
}
