import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { HeroFlow } from "@/components/home/hero-flow";
import { MeshBackground } from "@/components/motion/mesh-background";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { catalogTotals } from "@/lib/catalog";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <MeshBackground intensity="vivid" />
      <Container size="wide" className="relative pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 font-mono text-label uppercase tracking-[0.14em] text-muted">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                {catalogTotals.templates} templates · {catalogTotals.categories} categories
              </span>
            </Reveal>

            <h1 className="mt-7 font-display text-[clamp(2.75rem,6vw,4rem)] font-bold leading-[1.0] tracking-[-0.035em]">
              <SplitText text="The design gallery" />
              <br />
              <SplitText text="that hands you" delay={120} />
              <br />
              <SplitText text="the prompt." delay={240} className="text-accent" />
            </h1>

            <Reveal delay={200}>
              <p className="mt-7 max-w-lg text-body-lg leading-[1.6] text-muted">
                Browse finished website designs. Open one, look at it properly, then copy the prompt
                that rebuilds it in Claude Code, Cursor or Codex. No signup, no export step.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <ButtonLink href="/templates" size="lg">
                    Browse {catalogTotals.templates} templates
                    <ArrowRight className="size-4" aria-hidden />
                  </ButtonLink>
                </Magnetic>
                <ButtonLink href="/about" size="lg" variant="secondary">
                  See how it works
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={380}>
              <dl className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-label uppercase tracking-[0.14em] text-soft">
                {[
                  { label: "prompts copied", value: "50,000+" },
                  { label: "free templates", value: String(catalogTotals.free) },
                  { label: "creators", value: String(catalogTotals.creators) },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-2">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="tabular text-h5 font-semibold text-ink">{stat.value}</dd>
                    <span aria-hidden>{stat.label}</span>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={160} className="lg:pl-4">
            <HeroFlow />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
