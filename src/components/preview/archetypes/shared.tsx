import { cn } from "@/lib/utils";

/** Bits every archetype shares. Chrome greys are fixed; only the three palette hooks vary. */

export function Mesh({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cn("mesh-blob pointer-events-none absolute rounded-full blur-[90px]", className)}
      data-motion
      style={style}
      aria-hidden
    />
  );
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn("font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]", className)}
    >
      {children}
    </span>
  );
}

/** A light streak that crosses a headline. Rests as plain text. */
export function Sheen() {
  return (
    <span
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <span
        data-motion
        className="absolute inset-y-0 left-0 w-[40%]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
          animation: "text-sheen 6s var(--ease-inout) infinite",
        }}
      />
    </span>
  );
}

export function Rule({ className }: { className?: string }) {
  return <span className={cn("block h-px w-full bg-[var(--rule)]", className)} />;
}

/** A line of text that types itself out, with a blinking caret. Effects 14 + 15. */
export function TypeLine({
  children,
  duration = 2600,
  delay = 0,
  className,
  caret = true,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  caret?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap", className)}>
      <span
        data-motion
        className="inline-block overflow-hidden align-bottom"
        style={{
          animation: `type-out ${duration}ms steps(38, end) ${delay}ms infinite`,
          width: "100%",
        }}
      >
        {children}
      </span>
      {caret ? (
        <span
          data-motion
          data-caret
          className="ml-[3px] inline-block h-[1.05em] w-[6px] shrink-0 bg-[var(--tpl-accent)]"
          style={{ animation: "caret 1s step-end infinite" }}
        />
      ) : null}
    </span>
  );
}
