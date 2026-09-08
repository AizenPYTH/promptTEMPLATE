import type { Collection } from "@/types/template";

/** Editorial groupings, curated by hand rather than generated from tags. */
export const collections: Collection[] = [
  {
    slug: "best-saas",
    title: "Best SaaS templates",
    subtitle: "Sites that sell software without shouting",
    description:
      "Six marketing sites where the product does the persuading: real interface surfaces, comparison-first pricing and security pages written for the person who actually signs.",
    curator: "Promptly editorial",
    accent: "#5b4ff0",
    visual: "landing",
    templateSlugs: [
      "finora-finance-saas",
      "looma-saas-landing",
      "cadence-project-management",
      "launchpad-startup-landing",
      "cove-app-landing",
    ],
  },
  {
    slug: "ai-startups",
    title: "AI startup websites",
    subtitle: "Launch pages for models and the tools around them",
    description:
      "Interfaces built for the first minute after a launch post: streaming demos, honest benchmarks, model cards and waitlists that confirm without a redirect.",
    curator: "Ada Okonkwo",
    accent: "#7c6dff",
    visual: "chat",
    templateSlugs: ["nova-ai", "vertex-ai-infrastructure", "nexus-developer-tools", "flux-automation"],
  },
  {
    slug: "minimal-portfolios",
    title: "Minimal portfolios",
    subtitle: "Personal sites where the work is the interface",
    description:
      "Restrained personal sites for designers, photographers and engineers. Almost no chrome, extremely deliberate typography, and content that carries itself.",
    curator: "Elias Berg",
    accent: "#4a5568",
    visual: "gallery",
    templateSlugs: ["mono-developer-portfolio", "studio-27-portfolio", "frame-design-studio", "lumio-creative-agency"],
  },
  {
    slug: "dark-interfaces",
    title: "Dark mode interfaces",
    subtitle: "Near-black canvases with exactly one accent",
    description:
      "Dark themes that survive daily use: controlled contrast, a single luminous accent and surfaces that stay legible when the room lights come on.",
    curator: "Nina Kovač",
    accent: "#22b8a6",
    visual: "kanban",
    templateSlugs: [
      "cadence-project-management",
      "orbit-analytics",
      "vault-banking",
      "nova-ai",
      "halo-fitness-app",
      "flux-automation",
    ],
  },
  {
    slug: "best-landing-pages",
    title: "Best landing pages",
    subtitle: "One page, one decision",
    description:
      "Single-page sites where every section earns its scroll. Feature switchers instead of feature stacks, and CTAs placed where the objection has just been answered.",
    curator: "Promptly editorial",
    accent: "#f0603c",
    visual: "lookbook",
    templateSlugs: ["looma-saas-landing", "launchpad-startup-landing", "nova-ai", "cove-app-landing"],
  },
  {
    slug: "developer-tools",
    title: "Tools for developers",
    subtitle: "Docs, grids, canvases and consoles",
    description:
      "Products engineers evaluate with a keyboard. Documentation that answers real questions, a data grid worth not building yourself, and an automation canvas whose logs debug themselves.",
    curator: "Ravi Menon",
    accent: "#2ea8c9",
    visual: "canvas",
    templateSlugs: ["nexus-developer-tools", "gridly-data-grid", "flux-automation", "cadence-project-management"],
  },
  {
    slug: "commerce-systems",
    title: "Commerce, front to back",
    subtitle: "Storefront, checkout and the console behind it",
    description:
      "The full retail surface: an editorial storefront, a booking flow that survives comparison shopping, and the operations console where the orders actually get handled.",
    curator: "Sofia Marchetti",
    accent: "#8a6d3b",
    visual: "commerce",
    templateSlugs: ["arcadia-ecommerce", "atlas-travel", "commerceos-admin", "ledger-invoicing"],
  },
  {
    slug: "data-heavy",
    title: "Data-heavy interfaces",
    subtitle: "Density done deliberately",
    description:
      "Screens that hold thousands of rows without becoming unreadable. Frozen columns, comparison-aware ranges, cohort grids and charts with table fallbacks.",
    curator: "Promptly editorial",
    accent: "#2f9e59",
    visual: "grid",
    templateSlugs: ["gridly-data-grid", "orbit-analytics", "commerceos-admin", "pulse-health-dashboard", "vault-banking"],
  },
];

export const collectionMap = new Map(collections.map((c) => [c.slug, c]));
