"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { createLocalStore, createMediaStore, useStore } from "@/lib/client-store";
import { storageKeys } from "@/lib/storage";

export type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  preference: ThemePreference;
  theme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const preferenceStore = createLocalStore<ThemePreference>(storageKeys.theme, "system");
const lightMedia = createMediaStore("(prefers-color-scheme: light)");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useStore(preferenceStore, "system");
  const systemPrefersLight = useStore(lightMedia, false);
  const theme: ResolvedTheme = preference === "system" ? (systemPrefersLight ? "light" : "dark") : preference;

  // The only side effect: keep <html> in step with the resolved theme. The
  // inline script in the document head has already painted the right one, so
  // this is a no-op on first render.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.style.colorScheme = theme;
  }, [theme]);

  const setPreference = useCallback((next: ThemePreference) => preferenceStore.set(next), []);
  const toggle = useCallback(() => {
    preferenceStore.set(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const value = useMemo(
    () => ({ preference, theme, setPreference, toggle }),
    [preference, theme, setPreference, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}

/**
 * Runs before paint so the correct theme class is on <html> immediately.
 * Kept as a string because it must be inline in the document head.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('${storageKeys.theme}');var p=s?JSON.parse(s):'system';var m=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';var t=p==='system'?m:p;var r=document.documentElement;r.classList.add(t);r.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;
