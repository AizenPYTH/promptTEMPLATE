import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/container";
import { FavoritesList } from "@/components/templates/favorites-list";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Templates you have saved. Stored in your browser — no account, no sync, no tracking.",
  alternates: { canonical: "/favorites" },
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <Container size="wide" className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Saved"
        title="Your favorites"
        description="Everything you have saved, kept in this browser's local storage. No account needed — and nothing leaves your device."
      />
      <div className="mt-10">
        <FavoritesList />
      </div>
    </Container>
  );
}
