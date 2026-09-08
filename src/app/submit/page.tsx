import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/container";
import { SubmitForm } from "@/components/forms/submit-form";

export const metadata: Metadata = {
  title: "Submit a template",
  description: "Share a template with the catalogue. A front-end demonstration — nothing is transmitted.",
  alternates: { canonical: "/submit" },
};

const criteria = [
  {
    title: "It has to be finished",
    body: "Real content, real states, working responsive behaviour. Half-built concepts do not survive being turned into a prompt.",
  },
  {
    title: "It has to be yours",
    body: "Original work, or work you have the rights to publish. Recreations of existing products are not accepted.",
  },
  {
    title: "It has to be describable",
    body: "If the design cannot be written down as tokens, components and constraints, an agent cannot rebuild it — and that is the entire point.",
  },
  {
    title: "It has to be accessible",
    body: "Keyboard operable, sensible contrast, no meaning carried by colour alone. This is checked during review.",
  },
];

export default function SubmitPage() {
  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Contribute"
        title="Submit a template"
        description="Made something worth rebuilding? Send it over. Accepted templates get a full prompt written for them and are credited to you on the template page."
      />

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
        <div className="min-w-0">
          <SubmitForm />
        </div>

        <aside className="lg:pt-1">
          <h2 className="text-2xs font-medium uppercase tracking-[0.12em] text-faint">What we look for</h2>
          <ul className="mt-4 space-y-5">
            {criteria.map((item) => (
              <li key={item.title}>
                <h3 className="text-[13.5px] font-medium">{item.title}</h3>
                <p className="mt-1 text-[13px] leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Container>
  );
}
