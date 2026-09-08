"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { createLocalStore, useHydrated, useStore } from "@/lib/client-store";
import { storageKeys } from "@/lib/storage";

interface FavoritesContextValue {
  favorites: string[];
  /** False until hydration completes, so server and client markup agree. */
  ready: boolean;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
  /** Replace the whole list — used by undo actions. */
  restore: (slugs: string[]) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const EMPTY: string[] = [];
const favoritesStore = createLocalStore<string[]>(storageKeys.favorites, EMPTY);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useStore(favoritesStore, EMPTY);
  const ready = useHydrated();

  const toggle = useCallback((slug: string) => {
    const current = favoritesStore.get();
    const exists = current.includes(slug);
    favoritesStore.set(exists ? current.filter((s) => s !== slug) : [slug, ...current]);
    return !exists;
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      ready,
      isFavorite: (slug) => favorites.includes(slug),
      toggle,
      remove: (slug) => favoritesStore.set(favoritesStore.get().filter((s) => s !== slug)),
      clear: () => favoritesStore.set([]),
      restore: (slugs) => favoritesStore.set(slugs),
    }),
    [favorites, ready, toggle],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
