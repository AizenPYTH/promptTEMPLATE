import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="border-t border-line">
      <Container size="wide" className="py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-panel border border-line bg-surface-2 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 grid-backdrop [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" aria-hidden />
          <div
            className="pointer-events-none absolute left-1/2 top-full size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[100px]"
            style={{ background: "var(--accent)" }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-xl">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Find the design. Copy the prompt. Build it with AI.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-muted">
              Start with a template that already looks finished, then let your agent do the typing.
              Everything is free to browse and copy.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/templates" size="lg">
                Explore templates
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/about" size="lg" variant="outline">
                How it works
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
