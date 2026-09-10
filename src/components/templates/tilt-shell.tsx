"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Effects 6 and 7: pointer tilt capped at 4° with a specular that tracks the
 * same position, plus a 6px lift.
 *
 * Four degrees, not the genre's usual ten to fourteen — at three cards per row
 * more tilt distorts the preview the card exists to show off (handoff
 * exception 4). Everything is written to CSS custom properties on the node, so
 * moving the pointer never triggers a React render.
 */
const MAX_DEG = 4;

export function TiltShell({
  children,
  className,
  onWake,
}: {
  children: React.ReactNode;
  className?: string;
  /** Called when the card wakes, so the preview inside can start running. */
  onWake?: (playing: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useRef<boolean | null>(null);

  const isReduced = () => {
    if (reduced.current === null) {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return reduced.current;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || isReduced()) return;
    const box = node.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    node.style.setProperty("--tilt-y", `${(px - 0.5) * 2 * MAX_DEG}deg`);
    node.style.setProperty("--tilt-x", `${(0.5 - py) * 2 * MAX_DEG}deg`);
    node.style.setProperty("--pointer-x", `${px * 100}%`);
    node.style.setProperty("--pointer-y", `${py * 100}%`);
  };

  const wake = () => {
    const node = ref.current;
    if (node && !isReduced()) node.style.setProperty("--tilt-lift", "-6px");
    onWake?.(true);
  };

  const rest = () => {
    const node = ref.current;
    if (node) {
      node.style.setProperty("--tilt-x", "0deg");
      node.style.setProperty("--tilt-y", "0deg");
      node.style.setProperty("--tilt-lift", "0px");
    }
    onWake?.(false);
  };

  return (
    <div
      ref={ref}
      className={cn("tilt", className)}
      onPointerMove={onPointerMove}
      onPointerEnter={wake}
      onPointerLeave={rest}
      onFocusCapture={wake}
      onBlurCapture={rest}
    >
      {children}
    </div>
  );
}
