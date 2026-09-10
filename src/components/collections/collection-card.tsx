import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Collection } from "@/types/template";
import { ArchetypeCover } from "@/components/preview/archetype-visual";
import { cn, pluralise } from "@/lib/utils";

export function CollectionCard({
  collection,
  className,
  size = "default",
}: {
  collection: Collection;
  className?: string;
  size?: "default" | "compact";
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-panel border border-line bg-surface-2 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2",
        className,
      )}
    >
      <div className="relative overflow-hidden border-b border-line bg-surface-3">
        <ArchetypeCover
          archetype={collection.archetype}
          accent={collection.accent}
          label={collection.title}
          className={cn(
            "w-full",
            size === "compact" ? "aspect-[16/9]" : "aspect-[16/8]",
          )}
        />
        <span
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{ background: `linear-gradient(120deg, ${collection.accent}, transparent 65%)` }}
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold tracking-[-0.015em]">
            <Link href={`/collections/${collection.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {collection.title}
            </Link>
          </h3>
          <ArrowUpRight className="size-4 shrink-0 text-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-muted">{collection.subtitle}</p>
        <div className="mt-auto flex items-center gap-2 pt-4 text-label text-soft">
          <span>{pluralise(collection.templateSlugs.length, "template")}</span>
          <span aria-hidden>·</span>
          <span className="truncate">Curated by {collection.curator}</span>
        </div>
      </div>
    </article>
  );
}
