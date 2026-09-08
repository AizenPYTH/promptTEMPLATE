"use client";

import { Heart, Trash2 } from "lucide-react";
import { getTemplates } from "@/data/templates";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useToast } from "@/components/providers/toast-provider";
import { TemplateGrid } from "@/components/templates/template-grid";
import { TemplateGridSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button, ButtonLink } from "@/components/ui/button";
import { featuredTemplates } from "@/lib/catalog";
import { pluralise } from "@/lib/utils";

export function FavoritesList() {
  const { favorites, ready, clear, restore } = useFavorites();
  const { toast } = useToast();

  if (!ready) return <TemplateGridSkeleton count={3} />;

  const saved = getTemplates(favorites);

  if (saved.length === 0) {
    return (
      <div className="space-y-14">
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on any template to keep it here. Favorites live in this browser only — clearing site data clears them."
          action={
            <>
              <ButtonLink href="/templates">Browse templates</ButtonLink>
              <ButtonLink href="/collections" variant="outline">
                See collections
              </ButtonLink>
            </>
          }
        />
        <section>
          <h2 className="text-sm font-semibold">A good place to start</h2>
          <p className="mt-1.5 text-[13px] text-muted">The three most-copied templates in the catalogue.</p>
          <div className="mt-5">
            <TemplateGrid templates={featuredTemplates(3)} />
          </div>
        </section>
      </div>
    );
  }

  const handleClear = () => {
    const previous = [...favorites];
    clear();
    toast({
      title: "Favorites cleared",
      description: `${pluralise(previous.length, "template")} removed.`,
      tone: "info",
      action: { label: "Undo", onClick: () => restore(previous) },
    });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-[13px] text-muted">{pluralise(saved.length, "template")} saved</p>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <Trash2 className="size-3.5" aria-hidden />
          Clear all
        </Button>
      </div>
      <TemplateGrid templates={saved} />
    </div>
  );
}
