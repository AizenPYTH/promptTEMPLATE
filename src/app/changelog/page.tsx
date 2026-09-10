import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { changelog } from "@/data/changelog";
import { formatDate, relativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What has shipped on Promptly, newest first.",
  alternates: { canonical: "/changelog" },
};

const tones = {
  release: "accent",
  feature: "neutral",
  improvement: "outline",
} as const;

export default function ChangelogPage() {
  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Product"
        title="Changelog"
        description="Everything that has shipped, newest first. Small releases, written by the people who made them."
      />

      <ol className="mt-12 space-y-0">
        {changelog.map((entry, index) => (
          <li key={entry.version} className="relative grid gap-4 pb-12 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-8">
            <div className="sm:text-right">
              <div className="flex items-center gap-2.5 sm:flex-row-reverse">
                <span className="font-mono text-[13px] font-medium">v{entry.version}</span>
                <span className="hidden size-2 rounded-full border-2 border-accent bg-canvas sm:block" aria-hidden />
              </div>
              <time dateTime={entry.date} className="mt-1 block text-xs text-soft">
                {formatDate(entry.date)}
              </time>
              <span className="mt-0.5 block text-label text-soft/80">{relativeTime(entry.date)}</span>
            </div>

            <div className="relative sm:border-l sm:border-line sm:pl-8">
              {index < changelog.length - 1 ? (
                <span className="absolute -left-px bottom-0 top-0 hidden w-px sm:block" aria-hidden />
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold tracking-[-0.02em]">{entry.title}</h2>
                <Badge tone={tones[entry.tag]}>{entry.tag}</Badge>
              </div>
              <p className="mt-2 text-[14px] leading-7 text-muted">{entry.summary}</p>
              <ul className="mt-4 space-y-2">
                {entry.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[13.5px] leading-6 text-muted">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-line-strong" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Container>
  );
}
