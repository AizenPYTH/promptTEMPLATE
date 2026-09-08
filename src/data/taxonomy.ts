import type { Category, Style, Technology } from "@/types/template";

export const categories: Category[] = [
  {
    id: "saas",
    slug: "saas",
    name: "SaaS",
    short: "Marketing sites for software products",
    description:
      "Conversion-focused marketing sites for software companies: hero, product tour, pricing, social proof and a documentation-grade footer.",
    accent: "#5b4ff0",
    visual: "pricing",
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    name: "E-commerce",
    short: "Storefronts, product pages and checkout",
    description:
      "Storefronts built around product discovery: collection grids, filterable catalogues, product detail pages and a checkout that does not lose people.",
    accent: "#d2603a",
    visual: "commerce",
  },
  {
    id: "portfolio",
    slug: "portfolio",
    name: "Portfolio",
    short: "Personal sites for designers and engineers",
    description:
      "Personal sites where the work is the interface. Restrained typography, generous whitespace and case studies that read like essays.",
    accent: "#3f8f6f",
    visual: "gallery",
  },
  {
    id: "agency",
    slug: "agency",
    name: "Agency",
    short: "Studio and creative agency sites",
    description:
      "Studio sites with an editorial backbone: manifesto hero, selected work, capabilities, team and a contact page that reads like an invitation.",
    accent: "#b8583f",
    visual: "archive",
  },
  {
    id: "dashboard",
    slug: "dashboard",
    name: "Dashboard",
    short: "Data-dense product interfaces",
    description:
      "Application shells with sidebars, dense tables, filters and charts. Built for people who live in the product all day.",
    accent: "#2f7ac9",
    visual: "dashboard",
  },
  {
    id: "landing-page",
    slug: "landing-page",
    name: "Landing page",
    short: "Single-page launches and campaigns",
    description:
      "One page, one message. Launch pages, waitlists and campaign sites where every section earns its scroll.",
    accent: "#7a4fd8",
    visual: "landing",
  },
  {
    id: "mobile",
    slug: "mobile",
    name: "Mobile",
    short: "App marketing and mobile-first UI",
    description:
      "App landing pages and mobile-first interfaces designed at 390px first, then scaled up rather than squeezed down.",
    accent: "#c2478c",
    visual: "mobile",
  },
  {
    id: "ai",
    slug: "ai",
    name: "AI",
    short: "AI products, agents and model tooling",
    description:
      "Interfaces for AI products: streaming chat surfaces, model playgrounds, evaluation dashboards and launch pages for research labs.",
    accent: "#6a5cf0",
    visual: "chat",
  },
  {
    id: "fintech",
    slug: "fintech",
    name: "Fintech",
    short: "Banking, payments and money movement",
    description:
      "Financial interfaces that have to look trustworthy from the first pixel: balances, ledgers, transfers and compliance-aware detail.",
    accent: "#1f7a63",
    visual: "invoice",
  },
  {
    id: "developer-tools",
    slug: "developer-tools",
    name: "Developer tools",
    short: "Docs, CLIs and infrastructure products",
    description:
      "Sites for products that developers evaluate in a terminal: documentation, quickstarts, API references and honest changelogs.",
    accent: "#4a5568",
    visual: "terminal",
  },
];

export const styles: Style[] = [
  { id: "minimal", name: "Minimal", description: "Restrained palette, generous whitespace, no ornament." },
  { id: "dark", name: "Dark", description: "Near-black canvas with a single luminous accent." },
  { id: "editorial", name: "Editorial", description: "Magazine typography, asymmetric grids, long-form rhythm." },
  { id: "glass", name: "Glass", description: "Layered translucency, soft blur, depth without noise." },
  { id: "brutalist", name: "Brutalist", description: "Hard borders, exposed structure, unapologetic type." },
  { id: "corporate", name: "Corporate", description: "Structured, legible and quietly confident." },
  { id: "luxury", name: "Luxury", description: "Slow pacing, serif display type, wide margins." },
  { id: "playful", name: "Playful", description: "Warm colour, rounded geometry, motion with personality." },
];

export const technologies: Technology[] = [
  { id: "nextjs", name: "Next.js", short: "Next" },
  { id: "react", name: "React", short: "React" },
  { id: "tailwind", name: "Tailwind CSS", short: "Tailwind" },
  { id: "typescript", name: "TypeScript", short: "TS" },
  { id: "vue", name: "Vue", short: "Vue" },
  { id: "astro", name: "Astro", short: "Astro" },
  { id: "html-css", name: "HTML / CSS", short: "HTML" },
  { id: "framer-motion", name: "Framer Motion", short: "Motion" },
];

export const categoryMap = new Map(categories.map((c) => [c.id, c]));
export const styleMap = new Map(styles.map((s) => [s.id, s]));
export const technologyMap = new Map(technologies.map((t) => [t.id, t]));
