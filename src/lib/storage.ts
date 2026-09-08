"use client";

/**
 * Thin, defensive localStorage helpers. Storage throws in private windows and
 * in some embedded browsers, so every access is wrapped.
 */

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded or storage blocked — the feature degrades, nothing breaks */
  }
}

export const storageKeys = {
  favorites: "promptly:favorites",
  theme: "promptly:theme",
  agent: "promptly:preferred-agent",
  recentSearches: "promptly:recent-searches",
  layout: "promptly:template-layout",
} as const;
