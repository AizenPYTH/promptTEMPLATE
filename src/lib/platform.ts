"use client";

import { useHydrated } from "@/lib/client-store";

/**
 * The modifier label for keyboard hints. Rendered as Ctrl until hydration so
 * the server and client markup agree, then corrected on Apple platforms.
 */
export function useModifierKey(): string {
  const hydrated = useHydrated();
  if (!hydrated || typeof navigator === "undefined") return "Ctrl";
  const platform = navigator.platform || navigator.userAgent;
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? "⌘" : "Ctrl";
}
