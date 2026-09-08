"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  CornerDownLeft,
  Heart,
  Home,
  Layers,
  Search,
  Send,
  SunMoon,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { searchTemplates } from "@/lib/catalog";
import { categories } from "@/data/taxonomy";
import { collections } from "@/data/collections";
import { useTheme } from "@/components/providers/theme-provider";
import { Kbd } from "@/components/ui/kbd";
import { useModifierKey } from "@/lib/platform";
import { cn, formatCount } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: LucideIcon;
  run: () => void;
}

interface PaletteContextValue {
  open: () => void;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

const POPULAR_QUERIES = ["SaaS", "Dashboard", "AI", "Portfolio", "E-commerce", "Dark"];

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [lastQuery, setLastQuery] = useState("");
  const router = useRouter();
  const { toggle: toggleTheme } = useTheme();
  const modifier = useModifierKey();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = overflow;
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  const items = useMemo<CommandItem[]>(() => {
    const go = (href: string) => () => {
      close();
      router.push(href);
    };

    const navigation: CommandItem[] = [
      { id: "nav-home", label: "Go home", group: "Navigation", icon: Home, run: go("/") },
      { id: "nav-templates", label: "Browse all templates", group: "Navigation", icon: Compass, run: go("/templates") },
      { id: "nav-collections", label: "Browse collections", group: "Navigation", icon: Layers, run: go("/collections") },
      { id: "nav-categories", label: "Browse categories", group: "Navigation", icon: Tag, run: go("/categories") },
      { id: "nav-favorites", label: "Open favorites", group: "Navigation", icon: Heart, run: go("/favorites") },
      { id: "nav-submit", label: "Submit a template", group: "Navigation", icon: Send, run: go("/submit") },
      {
        id: "action-theme",
        label: "Toggle theme",
        hint: "Light / dark",
        group: "Actions",
        icon: SunMoon,
        run: () => {
          toggleTheme();
          close();
        },
      },
    ];

    const trimmed = query.trim();
    if (!trimmed) {
      const suggestions: CommandItem[] = POPULAR_QUERIES.map((term) => ({
        id: `suggestion-${term}`,
        label: term,
        hint: "Popular search",
        group: "Suggestions",
        icon: Search,
        run: go(`/search?q=${encodeURIComponent(term.toLowerCase())}`),
      }));
      return [...suggestions, ...navigation];
    }

    const templateResults: CommandItem[] = searchTemplates(trimmed, 6).map((template) => ({
      id: `template-${template.id}`,
      label: template.title,
      hint: `${template.tagline} · ${formatCount(template.copies)} copies`,
      group: "Templates",
      icon: Compass,
      run: go(`/templates/${template.slug}`),
    }));

    const lower = trimmed.toLowerCase();
    const categoryResults: CommandItem[] = categories
      .filter((c) => c.name.toLowerCase().includes(lower) || c.id.includes(lower))
      .slice(0, 3)
      .map((c) => ({
        id: `category-${c.id}`,
        label: `${c.name} templates`,
        hint: c.short,
        group: "Categories",
        icon: Tag,
        run: go(`/categories/${c.slug}`),
      }));

    const collectionResults: CommandItem[] = collections
      .filter((c) => c.title.toLowerCase().includes(lower))
      .slice(0, 3)
      .map((c) => ({
        id: `collection-${c.slug}`,
        label: c.title,
        hint: c.subtitle,
        group: "Collections",
        icon: Layers,
        run: go(`/collections/${c.slug}`),
      }));

    const fallback: CommandItem = {
      id: "search-all",
      label: `Search for “${trimmed}”`,
      hint: "See all results",
      group: "Search",
      icon: Search,
      run: go(`/search?q=${encodeURIComponent(trimmed)}`),
    };

    return [
      ...templateResults,
      ...categoryResults,
      ...collectionResults,
      fallback,
      ...navigation.filter((item) => item.label.toLowerCase().includes(lower)),
    ];
  }, [query, router, toggleTheme, close]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      items[active]?.run();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, { item: CommandItem; index: number }[]>();
    items.forEach((item, index) => {
      const list = map.get(item.group) ?? [];
      list.push({ item, index });
      map.set(item.group, list);
    });
    return [...map.entries()];
  }, [items]);

  // Reset the highlighted row when the query changes, during render rather
  // than in an effect — no extra commit, no flash of a stale selection.
  if (lastQuery !== query) {
    setLastQuery(query);
    setActive(0);
  }

  const value = useMemo(() => ({ open }), [open]);

  return (
    <PaletteContext.Provider value={value}>
      {children}
      {isOpen ? (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]">
          <div className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-[2px] animate-fade-in" onClick={close} aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-float animate-scale-in"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-faint" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search templates, categories, actions…"
                aria-label="Search templates, categories and actions"
                aria-controls="command-results"
                className="h-13 w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-faint"
              />
              <Kbd className="hidden sm:inline-flex">Esc</Kbd>
            </div>
            <div
              id="command-results"
              ref={listRef}
              role="listbox"
              aria-label="Results"
              className="min-h-0 flex-1 overflow-y-auto scrollbar-slim p-2"
            >
              {items.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted">No matches. Try a different term.</p>
              ) : (
                grouped.map(([group, entries]) => (
                  <div key={group} className="mb-1 last:mb-0">
                    <div className="px-3 py-1.5 text-2xs font-medium uppercase tracking-[0.12em] text-faint">
                      {group}
                    </div>
                    {entries.map(({ item, index }) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={index === active}
                          data-index={index}
                          onMouseMove={() => setActive(index)}
                          onClick={item.run}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                            index === active ? "bg-surface-2 text-ink" : "text-muted",
                          )}
                        >
                          <Icon className="size-4 shrink-0 text-faint" aria-hidden />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.hint ? (
                            <span className="hidden max-w-[46%] truncate text-xs text-faint sm:block">{item.hint}</span>
                          ) : null}
                          {index === active ? <CornerDownLeft className="size-3.5 shrink-0 text-faint" aria-hidden /> : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 text-2xs text-faint">
              <span className="flex items-center gap-2">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                to navigate
              </span>
              <span className="flex items-center gap-2">
                <Kbd>↵</Kbd>
                to select
              </span>
              <span className="hidden items-center gap-2 sm:flex">
                <Kbd>{modifier} K</Kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </PaletteContext.Provider>
  );
}

export function useCommandPalette(): PaletteContextValue {
  const context = useContext(PaletteContext);
  if (!context) throw new Error("useCommandPalette must be used inside CommandPaletteProvider");
  return context;
}
