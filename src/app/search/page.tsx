import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/container";
import { SearchResults } from "@/components/search/search-results";
import { TemplateGridSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the catalogue by title, description, category, tag, technology or author.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Container size="wide" className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Search"
        title="Find a template"
        description="Search across titles, descriptions, categories, tags, technologies and authors. Results update as you type and the URL always reflects what you searched for."
      />
      <div className="mt-10">
        <Suspense fallback={<TemplateGridSkeleton count={6} />}>
          <SearchResults />
        </Suspense>
      </div>
    </Container>
  );
}
