import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Layers } from "lucide-react";
import { templates, getTemplate } from "@/data/templates";
import { categoryMap, styleMap, technologyMap } from "@/data/taxonomy";
import { collectionsForTemplate, similarTemplates } from "@/lib/catalog";
import { site } from "@/data/site";
import { Container, SectionHeading } from "@/components/layout/container";
import { TemplatePreview } from "@/components/templates/template-preview";
import { TemplateActions } from "@/components/templates/template-actions";
import { PromptSection } from "@/components/prompt/prompt-section";
import { TemplateGrid } from "@/components/templates/template-grid";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { formatCount, formatDate, formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return templates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return { title: "Template not found" };

  const title = `${template.title} — ${template.tagline}`;
  const description = template.description;
  return {
    title,
    description,
    alternates: { canonical: `/templates/${template.slug}` },
    keywords: [...template.tags, ...template.technologies, template.category],
    openGraph: {
      type: "article",
      title: `${title} · ${site.name}`,
      description,
      url: `/templates/${template.slug}`,
      publishedTime: template.createdAt,
      authors: [template.author.name],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TemplatePage({ params }: PageProps<"/templates/[slug]">) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  const category = categoryMap.get(template.category);
  const style = styleMap.get(template.style);
  const similar = similarTemplates(template, 3);
  const inCollections = collectionsForTemplate(template.slug);

  const info: { label: string; value: React.ReactNode }[] = [
    { label: "Category", value: <Link href={`/categories/${category?.slug}`} className="hover:text-ink">{category?.name}</Link> },
    { label: "Visual style", value: style?.name },
    { label: "Licence", value: template.price === 0 ? "Free — MIT" : "Single commercial project" },
    { label: "Price", value: formatPrice(template.price) },
    { label: "Prompt copies", value: `${formatCount(template.copies)}` },
    { label: "Added", value: formatDate(template.createdAt) },
  ];

  return (
    <article>
      <Container size="wide" className="pb-16 pt-8 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">Home</Link>
            </li>
            <ChevronRight className="size-3 text-soft" aria-hidden />
            <li>
              <Link href="/templates" className="transition-colors hover:text-ink">Templates</Link>
            </li>
            <ChevronRight className="size-3 text-soft" aria-hidden />
            <li>
              <Link href={`/categories/${category?.slug}`} className="transition-colors hover:text-ink">
                {category?.name}
              </Link>
            </li>
            <ChevronRight className="size-3 text-soft" aria-hidden />
            <li aria-current="page" className="text-ink">{template.title}</li>
          </ol>
        </nav>

        <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {template.featured ? <Badge tone="accent">Featured</Badge> : null}
              {template.isNew ? <Badge tone="outline">New</Badge> : null}
              <Badge tone="neutral">{category?.name}</Badge>
              <Badge tone="neutral">{style?.name}</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{template.title}</h1>
            <p className="mt-1.5 text-lg text-muted">{template.tagline}</p>
            <p className="mt-4 text-[15px] leading-7 text-muted">{template.description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
              <span className="flex items-center gap-2">
                <span
                  className="flex size-6 items-center justify-center rounded-full text-label font-semibold text-accent-ink"
                  style={{ background: template.accent }}
                  aria-hidden
                >
                  {template.author.name.charAt(0)}
                </span>
                <span className="text-ink">{template.author.name}</span>
                <span className="text-soft">@{template.author.handle}</span>
              </span>
              <Rating value={template.rating} reviews={template.reviews} size="md" />
              <span className="tabular-nums">{formatCount(template.copies)} prompt copies</span>
            </div>
          </div>

          <div className="lg:pt-2">
            <TemplateActions slug={template.slug} />
            <p className="mt-3 max-w-xs text-xs leading-5 text-soft">
              The prompt is copied as plain text. Paste it into Claude Code, Cursor or Codex and the
              agent builds the project from scratch.
            </p>
          </div>
        </header>

        <div className="mt-10">
          <TemplatePreview slug={template.slug} />
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <div className="min-w-0 space-y-14">
            <section>
              <h2 className="text-xl font-semibold tracking-[-0.025em]">About this template</h2>
              <p className="mt-4 text-[15px] leading-7 text-muted">{template.longDescription}</p>

              <h3 className="mt-8 text-sm font-semibold">What&apos;s included</h3>
              <div className="mt-4 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
                {template.features.map((feature) => (
                  <div key={feature.title} className="bg-surface-2 p-5">
                    <h4 className="text-[14px] font-medium">{feature.title}</h4>
                    <p className="mt-1.5 text-[13px] leading-6 text-muted">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <PromptSection slug={template.slug} />

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.025em]">Pages in this build</h2>
              <p className="mt-2 text-sm text-muted">
                The prompt asks the agent for these routes, each with a defined purpose.
              </p>
              <ul className="mt-5 divide-y divide-[var(--line)] overflow-hidden rounded-panel border border-line">
                {template.spec.pages.map((page) => (
                  <li key={page.route} className="flex flex-col gap-1 bg-surface-2 p-4 sm:flex-row sm:items-baseline sm:gap-5">
                    <code className="shrink-0 font-mono text-[13px] text-accent">{page.route}</code>
                    <span className="text-[13px] leading-6 text-muted">{page.purpose}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.025em]">Design system</h2>
              <p className="mt-2 text-sm text-muted">
                The exact tokens the prompt hands to the agent — no interpretation required.
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-panel border border-line bg-surface-2 p-5">
                  <h3 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Palette</h3>
                  <ul className="mt-3 space-y-2.5">
                    {Object.entries(template.spec.palette).map(([key, value]) => (
                      <li key={key} className="flex items-center gap-3 text-xs">
                        <span
                          className="size-5 shrink-0 rounded-control border border-line"
                          style={{ background: value }}
                          aria-hidden
                        />
                        <span className="flex-1 capitalize text-muted">{key.replace(/([A-Z])/g, " $1")}</span>
                        <code className="font-mono text-soft">{value}</code>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-panel border border-line bg-surface-2 p-5">
                  <h3 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Typography &amp; rhythm</h3>
                  <dl className="mt-3 space-y-3 text-xs">
                    {[
                      ["Display", template.spec.typography.display],
                      ["Body", template.spec.typography.body],
                      ["Mono", template.spec.typography.mono],
                      ["Scale", template.spec.typography.scale],
                      ["Spacing", template.spec.spacing],
                      ["Radius", template.spec.radius],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-soft">{label}</dt>
                        <dd className="mt-0.5 leading-5 text-muted">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.025em]">Constraints the agent must respect</h2>
              <ul className="mt-5 space-y-2.5">
                {template.spec.constraints.map((constraint) => (
                  <li key={constraint} className="flex gap-3 text-[14px] leading-6 text-muted">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {constraint}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-panel border border-line bg-surface-2 p-5">
              <h2 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Template information</h2>
              <dl className="mt-4 space-y-3 text-[13px]">
                {info.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted">{row.label}</dt>
                    <dd className="text-right font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-panel border border-line bg-surface-2 p-5">
              <h2 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Technology stack</h2>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {template.technologies.map((tech) => (
                  <li key={tech}>
                    <Link
                      href={`/templates?tech=${tech}`}
                      className="inline-flex rounded-control border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      {technologyMap.get(tech)?.name ?? tech}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="mt-5 text-label font-medium uppercase tracking-[0.12em] text-soft">Tags</h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="inline-flex rounded-control bg-surface-3 px-2 py-1 text-xs text-soft transition-colors hover:text-ink"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {inCollections.length > 0 ? (
              <div className="rounded-panel border border-line bg-surface-2 p-5">
                <h2 className="text-label font-medium uppercase tracking-[0.12em] text-soft">Featured in</h2>
                <ul className="mt-3.5 space-y-2.5">
                  {inCollections.map((collection) => (
                    <li key={collection.slug}>
                      <Link
                        href={`/collections/${collection.slug}`}
                        className="group flex items-start gap-2.5 text-[13px] text-muted transition-colors hover:text-ink"
                      >
                        <Layers className="mt-0.5 size-3.5 shrink-0 text-soft" aria-hidden />
                        <span>
                          {collection.title}
                          <span className="block text-xs text-soft">{collection.subtitle}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>

      {similar.length > 0 ? (
        <section className="border-t border-line py-16">
          <Container size="wide">
            <SectionHeading
              title="Similar templates"
              description={`More ${category?.name.toLowerCase()} work and builds sharing the same stack.`}
              action={
                <Link
                  href={`/categories/${category?.slug}`}
                  className="text-[13px] font-medium text-muted transition-colors hover:text-ink"
                >
                  All {category?.name} templates
                </Link>
              }
            />
            <TemplateGrid templates={similar} />
          </Container>
        </section>
      ) : null}
    </article>
  );
}
