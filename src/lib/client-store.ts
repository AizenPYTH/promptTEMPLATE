"use client";

import { useSyncExternalStore } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

/**
 * A tiny external store around localStorage.
 *
 * Reading persisted state inside an effect causes a cascading render on every
 * mount; `useSyncExternalStore` is the supported way to read from something
 * outside React, and it hydrates correctly because the server snapshot is
 * explicit.
 */

type Listener = () => void;

export interface ClientStore<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createLocalStore<T>(key: string, fallback: T): ClientStore<T> {
  let cache: T = fallback;
  let loaded = false;
  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((listener) => listener());

  if (typeof window !== "undefined") {
    // Another tab changed the value — invalidate and re-read lazily.
    window.addEventListener("storage", (event) => {
      if (event.key === key) {
        loaded = false;
        emit();
      }
    });
  }

  return {
    get() {
      if (typeof window === "undefined") return fallback;
      if (!loaded) {
        cache = readStorage<T>(key, fallback);
        loaded = true;
      }
      return cache;
    },
    set(value: T) {
      cache = value;
      loaded = true;
      writeStorage(key, value);
      emit();
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function useStore<T>(store: ClientStore<T>, serverValue: T): T {
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}

const neverChanges = () => () => {};
const alwaysTrue = () => true;
const alwaysFalse = () => false;

/** False on the server and during the hydration render, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(neverChanges, alwaysTrue, alwaysFalse);
}

/** Subscribe to a media query without a mount-time setState. */
export function createMediaStore(query: string): ClientStore<boolean> {
  const listeners = new Set<Listener>();
  let media: MediaQueryList | null = null;

  const ensure = () => {
    if (media || typeof window === "undefined") return media;
    media = window.matchMedia(query);
    media.addEventListener("change", () => listeners.forEach((listener) => listener()));
    return media;
  };

  return {
    get: () => ensure()?.matches ?? false,
    set: () => undefined,
    subscribe(listener) {
      ensure();
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** Subscribe to window scroll position crossing a threshold. */
export function createScrollStore(threshold: number): ClientStore<boolean> {
  const listeners = new Set<Listener>();
  let attached = false;

  const onScroll = () => listeners.forEach((listener) => listener());

  return {
    get: () => (typeof window === "undefined" ? false : window.scrollY > threshold),
    set: () => undefined,
    subscribe(listener) {
      listeners.add(listener);
      if (!attached && typeof window !== "undefined") {
        window.addEventListener("scroll", onScroll, { passive: true });
        attached = true;
      }
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
