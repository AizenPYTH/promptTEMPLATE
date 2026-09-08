import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/data/site";
import { catalogTotals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why prompts matter more than screenshots, how Promptly works, and what to do with a template once you have found one.",
  alternates: { canonical: "/about" },
};

const loop = [
  {
    n: "01",
    title: "Discover",
    body: "Browse by category, style or technology. Every template is a complete idea — not a hero section with three cards underneath it — and the detail page tells you what it is made of before you copy anything.",
  },
  {
    n: "02",
    title: "Copy",
    body: "Take the prompt for the agent you already use: Claude Code, Cursor or Codex. It is the full brief — art direction, routes, components, tokens, responsive rules, interactions and an explicit list of what not to do.",
  },
  {
    n: "03",
    title: "Build",
    body: "Paste it in and let the agent do the typing. What comes back is ordinary code in a stack you know, so you change the palette, cut the sections you do not need and wire it to your own data.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container size="narrow" className="py-14 sm:py-20">
          <p className="text-2xs font-medium uppercase tracking-[0.14em] text-faint">About</p>
          <h1 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-[-0.035em] sm:text-[2.6rem]">
            Instead of searching for code, start from a design you already love.
          </h1>
          <p className="mt-6 text-[17px] leading-8 text-muted">
            There is no shortage of places to look at beautiful websites. Design galleries are full of
            them. What they never give you is the part that matters when you sit down to work: the
            specification. The colour values. The type scale. The reason the pricing table has a sticky
            header at 1024px and cards below it.
          </p>
          <p className="mt-5 text-[17px] leading-8 text-muted">
            {site.name} exists because coding agents changed what a design reference is worth. An agent
            given a screenshot produces an approximation. An agent given a brief — routes, components,
            tokens, motion rules, constraints, a definition of done — produces something you can ship.
            So every template here carries that brief, written out in full.
          </p>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container size="narrow" className="py-14">
          <h2 className="text-xl font-semibold tracking-[-0.025em]">Screenshots inspire. Prompts build.</h2>
          <div className="mt-6 space-y-5 text-[15px] leading-7 text-muted">
            <p>
              A template you download is frozen. It was built for someone else&apos;s content, someone
              else&apos;s brand and someone else&apos;s stack, and adapting it usually costs more than
              starting over. A prompt is not frozen. Change one line — &ldquo;use a serif display face&rdquo;,
              &ldquo;drop the testimonials section&rdquo;, &ldquo;make it Vue&rdquo; — and the output changes with it.
            </p>
            <p>
              That only works if the prompt is specific. &ldquo;Build a beautiful SaaS landing page&rdquo; produces
              the same four generic sections every time. The prompts here run to several hundred lines
              because that is what it takes to describe a design precisely enough that two different
              agents produce recognisably the same thing.
            </p>
            <p>
              Every prompt is compiled from a structured brief attached to the template, which is why the
              Claude Code, Cursor and Codex variants never drift apart: they are three renderings of one
              source of truth.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container size="narrow" className="py-14">
          <h2 className="text-xl font-semibold tracking-[-0.025em]">Discover, copy, build</h2>
          <p className="mt-3 text-[15px] leading-7 text-muted">
            The whole product is one loop, and it takes about ninety seconds.
          </p>
          <ol className="mt-8 space-y-8">
            {loop.map((step) => (
              <li key={step.n} className="flex gap-5">
                <span className="font-mono text-[13px] text-accent">{step.n}</span>
                <div>
                  <h3 className="text-[15px] font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-7 text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-line" id="community">
        <Container size="narrow" className="py-14">
          <h2 className="text-xl font-semibold tracking-[-0.025em]">Submitting your own work</h2>
          <p className="mt-4 text-[15px] leading-7 text-muted">
            The catalogue is {catalogTotals.templates} templates from {catalogTotals.creators} designers
            and engineers. If you have built something worth rebuilding, send it in. Accepted templates
            get a full brief written for them and are credited on the template page, with a link back to
            you.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-muted">
            What gets accepted: finished work, originally yours, describable as a system, and accessible.
            What does not: recreations of existing products, unfinished concepts, and anything that only
            works at one screen size.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/submit">
              Submit a template
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/templates" variant="outline">
              Browse the catalogue
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section id="legal">
        <Container size="narrow" className="py-14">
          <h2 className="text-xl font-semibold tracking-[-0.025em]">The honest technical note</h2>
          <div className="mt-4 space-y-4 text-[14px] leading-7 text-muted">
            <p>
              {site.name} is a front-end demonstration. There is no server, no database and no account
              system. The catalogue is a set of typed local modules, favorites live in your browser&apos;s
              local storage, and the submission form validates your input and then deliberately does
              nothing with it.
            </p>
            <p>
              Nothing is tracked. There are no analytics scripts, no cookies beyond the theme and
              favorites you set yourself, and no third-party requests other than the web fonts.
            </p>
            <p>
              The template names, authors, ratings and copy counts are fictional, written to demonstrate
              the interface at a realistic scale. The design briefs themselves are genuine: each one
              would produce a working project if you handed it to an agent.
            </p>
            <p>
              Find us at{" "}
              <Link href="/changelog" className="text-accent underline-offset-2 hover:underline">
                the changelog
              </Link>{" "}
              for what has shipped recently.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
