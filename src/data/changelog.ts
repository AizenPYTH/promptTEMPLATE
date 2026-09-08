import type { ChangelogEntry } from "@/types/template";

export const changelog: ChangelogEntry[] = [
  {
    version: "1.4",
    date: "2026-08-28",
    title: "A rebuilt template explorer",
    summary:
      "Filters now live in the URL, the grid keeps its scroll position, and every filter combination is shareable.",
    tag: "feature",
    items: [
      "Filters, sort and search are encoded in the URL so a view can be shared or bookmarked",
      "New rating and price filters, plus a combined active-filter bar with individual removal",
      "Load-more pagination replaces the infinite scroll that broke keyboard navigation",
      "Grid, compact and list layouts share one card component",
    ],
  },
  {
    version: "1.3",
    date: "2026-06-30",
    title: "Prompt tabs for three agents",
    summary:
      "Every template now ships a prompt tuned for Claude Code, Cursor and Codex, with downloads for each.",
    tag: "feature",
    items: [
      "Per-agent prompt tabs with the selected agent remembered between visits",
      "Download any prompt as a .txt file named after the template and agent",
      "Prompt viewer gained line numbers, word wrap and a full-screen mode",
      "Prompts now include an explicit file tree and acceptance criteria",
    ],
  },
  {
    version: "1.2",
    date: "2026-04-12",
    title: "Favorites, without an account",
    summary: "Save templates locally. No sign-up, no sync, no tracking.",
    tag: "feature",
    items: [
      "Favorite any template from a card or a detail page",
      "A dedicated /favorites page with an empty state that suggests where to start",
      "Favorites persist in localStorage and survive a refresh",
      "Toasts confirm every save and removal with an undo path",
    ],
  },
  {
    version: "1.1",
    date: "2026-02-20",
    title: "Collections",
    summary: "Hand-curated groupings for when you know the mood but not the template.",
    tag: "feature",
    items: [
      "Eight editorial collections with curator notes",
      "Collection covers generated from the same visual system as the templates",
      "Category pages gained stats and a proper description",
    ],
  },
  {
    version: "1.0.2",
    date: "2026-01-15",
    title: "Accessibility and motion pass",
    summary: "A full sweep across focus states, contrast and reduced motion.",
    tag: "improvement",
    items: [
      "Visible focus rings on every interactive element",
      "prefers-reduced-motion now disables all entrance and loop animations",
      "Command palette announces result counts to screen readers",
      "Contrast raised to at least 4.5:1 across both themes",
    ],
  },
  {
    version: "1.0",
    date: "2025-12-01",
    title: "Promptly is live",
    summary: "Twenty templates, each with a prompt detailed enough to actually build from.",
    tag: "release",
    items: [
      "Template explorer, detail pages and a working search",
      "Command palette on Cmd+K with navigation and theme actions",
      "Dark and light themes with system preference detection",
      "Prompts written as full briefs: architecture, design system, interactions and constraints",
    ],
  },
];
