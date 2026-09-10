import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Layers } from "lucide-react";
import { collections, collectionMap } from "@/data/collections";
import { getTemplates } from "@/data/templates";
import { Container } from "@/components/layout/container";
import { TemplateGrid } from "@/components/templates/template-grid";
import { ArchetypeCover } from "@/components/preview/archetype-visual";
import { CollectionCard } from "@/components/collections/collection-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { pluralise } from "@/lib/utils";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = collectionMap.get(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.title} · Promptly`,
      description: collection.description,
      url: `/collections/${collection.slug}`,
    },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = collectionMap.get(slug);
  if (!collection) notFound();

  const list = getTemplates(collection.templateSlugs);
  const others = collections.filter((c) => c.slug !== collection.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.13] blur-[120px]"
          style={{ background: collection.accent }}
          aria-hidden
        />
        <Container size="wide" className="relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">Home</Link>
              </li>
              <ChevronRight className="size-3 text-soft" aria-hidden />
              <li>
                <Link href="/collections" className="transition-colors hover:text-ink">Collections</Link>
              </li>
              <ChevronRight className="size-3 text-soft" aria-hidden />
              <li aria-current="page" className="text-ink">{collection.title}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-label font-medium uppercase tracking-[0.14em] text-soft">
                <Layers className="size-3.5" aria-hidden />
                Collection
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{collection.title}</h1>
              <p className="mt-2 text-lg text-muted">{collection.subtitle}</p>
              <p className="mt-4 text-[15px] leading-7 text-muted">{collection.description}</p>
              <p className="mt-6 flex items-center gap-3 border-t border-line pt-5 text-[13px] text-soft">
                <span>{pluralise(list.length, "template")}</span>
                <span aria-hidden>·</span>
                <span>Curated by {collection.curator}</span>
              </p>
            </div>

            <div className="overflow-hidden rounded-panel border border-line bg-surface-2 shadow-e2">
              <ArchetypeCover
                archetype={collection.archetype}
                accent={collection.accent}
                label={collection.title}
                className="aspect-[16/10] w-full"
              />
            </div>
          </div>
        </Container>
      </section>

      <Container size="wide" className="py-12 sm:py-16">
        {list.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="This collection is empty"
            description="Nothing has been added to this collection yet. The full catalogue is a good place to start instead."
            action={<ButtonLink href="/templates">Browse all templates</ButtonLink>}
          />
        ) : (
          <TemplateGrid templates={list} />
        )}

        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-xl font-semibold tracking-[-0.025em]">More collections</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <CollectionCard key={other.slug} collection={other} size="compact" />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
