import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";
import { categories } from "@/data/taxonomy";
import { categoryStats } from "@/lib/catalog";
import { pluralise } from "@/lib/utils";

export function CategoryStrip() {
  return (
    <section className="border-t border-line py-16 sm:py-20">
      <Container size="wide">
        <SectionHeading
          title="Browse by what you're building"
          description="Ten categories, each with templates chosen for that specific job — not repackaged from the same landing page."
          action={
            <Link href="/categories" className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink">
              All categories
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const stats = categoryStats(category.id);
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-line bg-surface p-4 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-line-strong"
              >
                <span
                  className="absolute -right-6 -top-6 size-16 rounded-full opacity-[0.16] blur-xl transition-opacity group-hover:opacity-30"
                  style={{ background: category.accent }}
                  aria-hidden
                />
                <span className="relative">
                  <span className="block size-2 rounded-full" style={{ background: category.accent }} aria-hidden />
                  <span className="mt-3 block text-sm font-medium">{category.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted">{category.short}</span>
                </span>
                <span className="relative mt-4 text-2xs text-faint">{pluralise(stats.total, "template")}</span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
