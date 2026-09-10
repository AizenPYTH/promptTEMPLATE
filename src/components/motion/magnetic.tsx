"use client";

import { useRef } from "react";

/**
 * Effect 9: the button drifts toward the pointer, up to 6px across and 4px
 * down, and springs back on leave. Written to a transform on the node — no
 * state, so a moving pointer costs nothing.
 */
export function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = node.getBoundingClientRect();
    const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
    node.style.transform = `translate(${Math.max(-1, Math.min(1, dx)) * 6}px, ${Math.max(-1, Math.min(1, dy)) * 4}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ display: "inline-block", transition: "transform 350ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </span>
  );
}
