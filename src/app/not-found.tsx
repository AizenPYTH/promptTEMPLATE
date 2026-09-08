import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { featuredTemplates } from "@/lib/catalog";
import { TemplateGrid } from "@/components/templates/template-grid";

export default function NotFound() {
  return (
    <Container size="wide" className="py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 grid-backdrop [mask-image:radial-gradient(ellipse_60%_70%_at_50%_40%,black,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-lg">
          <p className="font-mono text-[13px] text-accent">404</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Looks like this page doesn&apos;t exist.
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-muted">
            The link may be out of date, or the template may have been renamed. The catalogue is a good
            place to pick the thread back up.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/" size="lg">
              Back home
            </ButtonLink>
            <ButtonLink href="/templates" size="lg" variant="outline">
              Browse templates
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs text-faint">
            Or press <kbd className="rounded-xs border border-line bg-surface-2 px-1 font-sans">Ctrl K</kbd>{" "}
            (<kbd className="rounded-xs border border-line bg-surface-2 px-1 font-sans">⌘ K</kbd> on a Mac) to
            search from anywhere.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-sm font-semibold">Popular right now</h2>
        <p className="mt-1.5 text-[13px] text-muted">Three templates people copy most.</p>
        <div className="mt-6">
          <TemplateGrid templates={featuredTemplates(3)} />
        </div>
        <p className="mt-8 text-xs text-faint">
          Still stuck?{" "}
          <Link href="/about" className="text-accent underline-offset-2 hover:underline">
            Read about how Promptly works
          </Link>
          .
        </p>
      </section>
    </Container>
  );
}
