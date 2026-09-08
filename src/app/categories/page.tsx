import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/container";
import { TemplateVisual } from "@/components/visuals/template-visual";
import { categories } from "@/data/taxonomy";
import { categoryStats } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Ten categories of website template — SaaS, e-commerce, dashboards, portfolios, AI, fintech and more — each with a build-ready prompt.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return (
    <Container size="wide" className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Browse"
        title="Categories"
        description="Every template is filed under the job it does. Pick the one closest to what you're building — the prompts are written for that specific problem, not a generic layout."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const stats = categoryStats(category.id);
          return (
            <article
              key={category.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong"
            >
              <div className="relative overflow-hidden border-b border-line bg-surface-2">
                <TemplateVisual
                  kind={category.visual}
                  accent={category.accent}
                  seed={`category-${category.id}`}
                  label={`${category.name} category cover`}
                  className="aspect-[16/8] w-full transition-transform duration-500 group-hover:scale-[1.035]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[15px] font-semibold">
                    <Link href={`/categories/${category.slug}`} className="after:absolute after:inset-0 after:content-['']">
                      {category.name}
                    </Link>
                  </h2>
                  <ArrowUpRight className="size-4 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </div>
                <p className="mt-2 text-[13px] leading-6 text-muted">{category.short}</p>
                <dl className="mt-auto flex items-center gap-4 pt-5 text-2xs text-faint">
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Templates</dt>
                    <dd className="tabular-nums">{stats.total} templates</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Free</dt>
                    <dd className="tabular-nums">{stats.free} free</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Average rating</dt>
                    <dd className="tabular-nums">{stats.averageRating} avg</dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </Container>
  );
}
