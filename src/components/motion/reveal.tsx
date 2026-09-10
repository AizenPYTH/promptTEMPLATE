"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll entrance. Fires once, never on the way back up.
 *
 * The observer toggles a data attribute rather than React state, so a page with
 * forty revealed elements does not commit forty renders on the way down.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  distance = 18,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.shown = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — one ref type across the four allowed tags
      ref={ref}
      data-shown="false"
      style={
        {
          "--reveal-distance": `${distance}px`,
          transitionDelay: `${delay}ms`,
        } as React.CSSProperties
      }
      className={cn(
        "translate-y-[var(--reveal-distance)] opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
