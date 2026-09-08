import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { CategoryStrip } from "@/components/home/category-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { PromptShowcase } from "@/components/home/prompt-showcase";
import { CtaBand } from "@/components/home/cta-band";
import { TemplateGrid } from "@/components/templates/template-grid";
import { CollectionCard } from "@/components/collections/collection-card";
import { featuredTemplates, sortTemplates } from "@/lib/catalog";
import { templates } from "@/data/templates";
import { collections } from "@/data/collections";

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
    >
      {children}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

export default function HomePage() {
  const featured = featuredTemplates(6);
  const featuredIds = new Set(featured.map((t) => t.id));
  const popular = sortTemplates(
    templates.filter((t) => !featuredIds.has(t.id)),
    "most-copied",
  ).slice(0, 4);
  const showcaseSlugs = ["nova-ai", "arcadia-ecommerce", "cadence-project-management", "zenith-luxury-brand"];
  const featuredCollections = collections.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="border-t border-line py-16 sm:py-20">
        <Container size="wide">
          <SectionHeading
            title="Featured templates"
            description="Hand-picked builds where the design holds up under scrutiny and the prompt is detailed enough to reproduce it."
            action={<SectionLink href="/templates">All 23 templates</SectionLink>}
          />
          <TemplateGrid templates={featured} />
        </Container>
      </section>

      <HowItWorks />

      <PromptShowcase slugs={showcaseSlugs} />

      <section className="border-t border-line py-16 sm:py-20">
        <Container size="wide">
          <SectionHeading
            title="Most copied this month"
            description="What people are actually building. Ranked by how often the prompt has been taken."
            action={<SectionLink href="/templates?sort=newest">Recently added</SectionLink>}
          />
          <TemplateGrid templates={popular} columns={4} variant="compact" />
        </Container>
      </section>

      <CategoryStrip />

      <section className="border-t border-line py-16 sm:py-20">
        <Container size="wide">
          <SectionHeading
            title="Collections"
            description="Curated groupings for when you know the mood but not the template."
            action={<SectionLink href="/collections">All collections</SectionLink>}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {featuredCollections.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} size="compact" />
            ))}
          </div>
        </Container>
      </section>

      <Stats />
      <CtaBand />
    </>
  );
}
