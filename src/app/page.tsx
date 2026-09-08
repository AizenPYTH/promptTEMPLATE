import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { CategoryStrip } from "@/components/home/category-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { CtaBand } from "@/components/home/cta-band";
import { TemplateGrid } from "@/components/templates/template-grid";
import { CollectionCard } from "@/components/collections/collection-card";
import { featuredTemplates, newestTemplates } from "@/lib/catalog";
import { collections } from "@/data/collections";

export default function HomePage() {
  const featured = featuredTemplates(6);
  const newest = newestTemplates(4);
  const featuredCollections = collections.slice(0, 3);

  return (
    <>
      <Hero />
      <Stats />

      <section className="py-16 sm:py-20">
        <Container size="wide">
          <SectionHeading
            title="Featured templates"
            description="Hand-picked builds where the design holds up and the prompt is detailed enough to reproduce it."
            action={
              <Link
                href="/templates"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
              >
                All templates
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            }
          />
          <TemplateGrid templates={featured} />
        </Container>
      </section>

      <HowItWorks />

      <section className="border-t border-line py-16 sm:py-20">
        <Container size="wide">
          <SectionHeading
            title="Collections"
            description="Curated groupings for when you know the mood but not the template."
            action={
              <Link
                href="/collections"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
              >
                All collections
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {featuredCollections.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} size="compact" />
            ))}
          </div>
        </Container>
      </section>

      <CategoryStrip />

      <section className="border-t border-line py-16 sm:py-20">
        <Container size="wide">
          <SectionHeading
            title="Recently added"
            description="The four newest additions to the catalogue."
            action={
              <Link
                href="/templates?sort=newest"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
              >
                Sort by newest
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            }
          />
          <TemplateGrid templates={newest} columns={4} variant="compact" />
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
