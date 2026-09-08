import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "outline" | "solid" | "positive";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted border border-line",
  accent: "bg-accent-soft text-accent border border-accent-line",
  outline: "border border-line text-muted",
  solid: "bg-ink text-canvas border border-transparent",
  positive: "border border-line text-positive bg-surface-2",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-2xs font-medium uppercase tracking-[0.06em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Pill({
  children,
  className,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent-line bg-accent-soft text-accent"
          : "border-line bg-surface text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
