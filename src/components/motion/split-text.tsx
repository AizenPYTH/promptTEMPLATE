"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Headline reveal, word by word. Each word is a masked span that rises into
 * place with a short stagger — the effect reads as the sentence assembling
 * rather than as forty separate animations.
 */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 42,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

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
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} data-shown="false" className={cn("group/split inline", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            style={{ transitionDelay: `${delay + i * stagger}ms` }}
            className={cn(
              "inline-block translate-y-[105%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-data-[shown=true]/split:translate-y-0",
              wordClassName,
            )}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
