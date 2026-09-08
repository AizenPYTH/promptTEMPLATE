import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/container";
import { PricingPlans } from "@/components/pricing/pricing-plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free, Pro and Lifetime plans. Browsing and free-template prompts cost nothing.",
  alternates: { canonical: "/pricing" },
};

const faqs = [
  {
    q: "What do I actually get?",
    a: "A prompt. Every template ships with a long-form brief — routes, components, design tokens, motion rules, constraints and a definition of done — written so a coding agent can build the project without further instruction.",
  },
  {
    q: "Do I need an account?",
    a: "No. There is no sign-up on Promptly. Favorites and preferences are stored in your browser, and nothing is sent anywhere.",
  },
  {
    q: "Can I use the output commercially?",
    a: "Free templates are MIT-licensed, so yes. Premium templates would be licensed per commercial project under Pro — though since payments are not live, nothing is gated today.",
  },
  {
    q: "Which agent should I use?",
    a: "Whichever you already have. Each template ships three variants of the same brief: a narrative for Claude Code, an ordered file-by-file plan for Cursor, and numbered requirements with acceptance criteria for Codex.",
  },
  {
    q: "Do the prompts guarantee an identical result?",
    a: "No, and nothing that claims otherwise is being honest. Agents vary. The prompts fix the structure, the tokens and the constraints, which is what makes the output close enough to iterate on rather than start over.",
  },
];

export default function PricingPage() {
  return (
    <Container size="wide" className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <PageHeader
          eyebrow="Pricing"
          title="Simple, and mostly free"
          description="Browsing the catalogue and copying prompts for free templates costs nothing and always will. Premium plans would cover the templates that take a week to design rather than an afternoon."
          className="flex-col items-center text-center md:flex-col md:items-center"
        />
      </div>

      <PricingPlans />

      <section className="mx-auto mt-20 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-[-0.025em]">Questions</h2>
        <dl className="mt-6 divide-y divide-[var(--line)] border-y border-line">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-5">
              <dt className="text-[14px] font-medium">{faq.q}</dt>
              <dd className="mt-2 text-[13.5px] leading-6 text-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Container>
  );
}
