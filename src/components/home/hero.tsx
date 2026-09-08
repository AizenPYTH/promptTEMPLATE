import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { HeroFlow } from "@/components/home/hero-flow";
import { catalogTotals } from "@/lib/catalog";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 grid-backdrop [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-[-20%] size-[560px] -translate-x-1/2 rounded-full opacity-[0.13] blur-[120px]"
        style={{ background: "var(--accent)" }}
        aria-hidden
      />
      <Container size="wide" className="relative pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
              <Sparkles className="size-3.5 text-accent" aria-hidden />
              {catalogTotals.templates} templates, each with a build-ready prompt
            </span>

            <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[3.25rem] lg:text-[3.5rem]">
              Beautiful websites.
              <br />
              <span className="text-muted">Built from a prompt.</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted sm:text-base">
              Browse production-ready templates, then copy the exact prompt that recreates one with
              Claude Code, Cursor or Codex. No boilerplate to fork, no design files to reverse-engineer.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/templates" size="lg">
                Explore templates
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/submit" size="lg" variant="outline">
                Submit a template
              </ButtonLink>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                { label: "Templates", value: catalogTotals.templates },
                { label: "Free to copy", value: catalogTotals.free },
                { label: "Creators", value: catalogTotals.creators },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xs uppercase tracking-[0.1em] text-faint">{stat.label}</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:pl-4">
            <HeroFlow slug="nova-ai" />
          </div>
        </div>
      </Container>
    </section>
  );
}
