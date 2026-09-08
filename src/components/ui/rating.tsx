import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  reviews,
  size = "sm",
  className,
}: {
  value: number;
  reviews?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const rounded = Math.round(value);
  const starSize = size === "md" ? "size-3.5" : "size-3";
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rated ${value} out of 5${reviews ? ` from ${reviews} reviews` : ""}`}
    >
      <span className="flex items-center gap-px" aria-hidden>
        {[1, 2, 3, 4, 5].map((step) => (
          <Star
            key={step}
            className={cn(
              starSize,
              step <= rounded ? "fill-accent text-accent" : "fill-transparent text-line-strong",
            )}
            strokeWidth={1.5}
          />
        ))}
      </span>
      <span className={cn("tabular-nums font-medium", size === "md" ? "text-sm" : "text-xs")} aria-hidden>
        {value.toFixed(1)}
      </span>
      {reviews ? (
        <span className={cn("text-muted", size === "md" ? "text-sm" : "text-xs")} aria-hidden>
          ({reviews})
        </span>
      ) : null}
    </span>
  );
}
