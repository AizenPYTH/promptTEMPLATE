import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/container";
import { TemplateExplorer } from "@/components/templates/template-explorer";
import { TemplateGridSkeleton } from "@/components/ui/skeleton";
import { catalogTotals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Explore templates",
  description:
    "Browse every template in the catalogue. Filter by category, style, technology, price and rating — every view is shareable.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "Explore templates · Promptly",
    description: "Filter production-ready templates by category, style, technology and price.",
    url: "/templates",
  },
};

export default function TemplatesPage() {
  return (
    <Container size="wide" className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Catalogue"
        title="Explore templates"
        description={`${catalogTotals.templates} templates across ${catalogTotals.categories} categories. Every one ships with a prompt detailed enough to rebuild it — filters and search update the URL, so you can share exactly what you're looking at.`}
      />
      <div className="mt-10">
        <Suspense fallback={<TemplateGridSkeleton count={9} />}>
          <TemplateExplorer />
        </Suspense>
      </div>
    </Container>
  );
}
