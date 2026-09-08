/**
 * Branding + global copy. Change the name of the product here and it
 * propagates through the navigation, metadata, footer and prompts.
 */
export const site = {
  name: "Promptly",
  tagline: "Find the design. Copy the prompt. Build it with AI.",
  description:
    "Discover production-ready website templates and copy the exact prompts that recreate them with Claude Code, Cursor or Codex.",
  url: "https://promptly.design",
  locale: "en_US",
  twitter: "@promptlydesign",
  email: "hello@promptly.design",
  founded: 2024,
  nav: [
    { label: "Templates", href: "/templates" },
    { label: "Categories", href: "/categories" },
    { label: "Collections", href: "/collections" },
    { label: "Pricing", href: "/pricing" },
  ],
  footer: [
    {
      title: "Product",
      links: [
        { label: "Templates", href: "/templates" },
        { label: "Collections", href: "/collections" },
        { label: "Categories", href: "/categories" },
        { label: "Pricing", href: "/pricing" },
        { label: "Favorites", href: "/favorites" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Changelog", href: "/changelog" },
        { label: "About", href: "/about" },
        { label: "Submit a template", href: "/submit" },
        { label: "Search", href: "/search" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "X", href: "/about#community" },
        { label: "GitHub", href: "/about#community" },
        { label: "Discord", href: "/about#community" },
        { label: "Newsletter", href: "/about#community" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/about#legal" },
        { label: "Terms", href: "/about#legal" },
        { label: "Licence", href: "/about#legal" },
      ],
    },
  ],
  stats: [
    { value: "10,000+", label: "Templates explored" },
    { value: "250+", label: "Contributing creators" },
    { value: "50,000+", label: "Prompts copied" },
    { value: "4.9/5", label: "Average template rating" },
  ],
} as const;

export const agents = [
  {
    id: "claude-code",
    name: "Claude Code",
    description: "Terminal-first agent. Give it the brief, let it scaffold the whole repo.",
    fileSuffix: "claude-code",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Editor agent. Works best with an explicit file plan and step order.",
    fileSuffix: "cursor",
  },
  {
    id: "codex",
    name: "Codex",
    description: "Task-oriented agent. Prefers numbered requirements and acceptance criteria.",
    fileSuffix: "codex",
  },
] as const;
