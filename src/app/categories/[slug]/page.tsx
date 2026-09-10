import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, LayoutTemplate } from "lucide-react";
import { categories, categoryMap } from "@/data/taxonomy";
import { categoryStats, templatesByCategory } from "@/lib/catalog";
import { Container } from "@/components/layout/container";
import { TemplateGrid } from "@/components/templates/template-grid";
import { ArchetypeCover } from "@/components/preview/archetype-visual";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import type { CategoryId } from "@/types/template";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryMap.get(slug as CategoryId);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} templates`,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} templates · Promptly`,
      description: category.description,
      url: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const category = categoryMap.get(slug as CategoryId);
  if (!category) notFound();

  const list = templatesByCategory(category.id);
  const stats = categoryStats(category.id);
  const others = categories.filter((c) => c.id !== category.id);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute right-0 top-0 size-[420px] translate-x-1/3 -translate-y-1/3 rounded-full opacity-[0.14] blur-[110px]"
          style={{ background: category.accent }}
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
                <Link href="/categories" className="transition-colors hover:text-ink">Categories</Link>
              </li>
              <ChevronRight className="size-3 text-soft" aria-hidden />
              <li aria-current="page" className="text-ink">{category.name}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-label font-medium uppercase tracking-[0.14em] text-soft">
                <span className="size-2 rounded-full" style={{ background: category.accent }} aria-hidden />
                Category
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {category.name} templates
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-muted">{category.description}</p>

              <dl className="mt-8 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
                {[
                  { label: "Templates", value: stats.total },
                  { label: "Free", value: stats.free },
                  { label: "Premium", value: stats.premium },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-label uppercase tracking-[0.1em] text-soft">{stat.label}</dt>
                    <dd className="mt-1 text-xl font-semibold tabular-nums">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="overflow-hidden rounded-panel border border-line bg-surface-2 shadow-e2">
              <ArchetypeCover
                  archetype={category.archetype}
                  accent={category.accent}
                  label={category.name}
                  className="aspect-[16/8] w-full"
                />
            </div>
          </div>
        </Container>
      </section>

      <Container size="wide" className="py-12 sm:py-16">
        {list.length === 0 ? (
          <EmptyState
            icon={LayoutTemplate}
            title="Nothing here yet"
            description="No templates are filed under this category right now. Browse the full catalogue instead — something close is likely already there."
            action={<ButtonLink href="/templates">Browse all templates</ButtonLink>}
          />
        ) : (
          <TemplateGrid templates={list} />
        )}

        <div className="mt-16 border-t border-line pt-8">
          <h2 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Other categories</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/categories/${other.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  <span className="size-1.5 rounded-full" style={{ background: other.accent }} aria-hidden />
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
