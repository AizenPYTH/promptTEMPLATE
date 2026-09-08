import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/container";
import { CollectionCard } from "@/components/collections/collection-card";
import { collections } from "@/data/collections";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Hand-curated groupings of templates: best SaaS sites, AI startup launches, minimal portfolios, dark interfaces and more.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  const [firstLead, secondLead, ...rest] = collections;

  return (
    <Container size="wide" className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Curated"
        title="Collections"
        description="Groupings put together by hand, not generated from tags. Each one answers a question you might actually arrive with — what does a good dark interface look like, what should an AI launch page do."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[firstLead, secondLead].map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} size="compact" />
        ))}
      </div>
    </Container>
  );
}
