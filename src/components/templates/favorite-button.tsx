"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  slug,
  title,
  size = "sm",
  variant = "floating",
  className,
}: {
  slug: string;
  title: string;
  size?: "sm" | "md";
  variant?: "floating" | "inline" | "button";
  className?: string;
}) {
  const { isFavorite, toggle, ready } = useFavorites();
  const { toast } = useToast();
  const active = ready && isFavorite(slug);

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const added = toggle(slug);
    toast({
      title: added ? "Added to favorites" : "Removed from favorites",
      description: title,
      tone: added ? "success" : "info",
      action: { label: "Undo", onClick: () => toggle(slug) },
    });
  };

  const iconSize = size === "md" ? "size-[18px]" : "size-4";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "inline-flex h-9.5 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors",
          active
            ? "border-accent-line bg-accent-soft text-accent"
            : "border-line text-ink hover:bg-surface-2 hover:border-line-strong",
          className,
        )}
      >
        <Heart className={cn(iconSize, active && "fill-current")} aria-hidden />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center rounded-md transition-all duration-150 active:scale-90",
        variant === "floating"
          ? "size-8 border border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-sm hover:border-line-strong"
          : "size-8 hover:bg-surface-2",
        active ? "text-accent" : "text-muted hover:text-ink",
        className,
      )}
    >
      <Heart className={cn(iconSize, active && "fill-current")} aria-hidden />
    </button>
  );
}
