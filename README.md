# Promptly

A front-end platform for discovering website templates and copying the exact prompt that
recreates each one with a coding agent — Claude Code, Cursor or Codex.

> **Find the design. Copy the prompt. Build it with AI.**

Promptly is a **front-end only** project. There is no backend, no database, no
authentication and no payment provider. Every record is a typed local module, favourites
live in `localStorage`, and the submission form validates your input and then deliberately
does nothing with it. Everything you can click actually works.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Language | TypeScript, `strict` mode |
| Styling | Tailwind CSS v4 with CSS custom properties as design tokens |
| Icons | lucide-react |
| Imagery | Hand-drawn inline SVG scenes — no image files, no external requests |
| Persistence | `localStorage` for favourites, theme, layout and preferred agent |

Runtime dependencies: `next`, `react`, `react-dom`, `lucide-react`. That is the whole list.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also runs the type-checker)
npm run start      # serve the production build
npm run lint       # eslint, including the React Compiler rules
```

## Project structure

```
src/
├── app/                        # routes (App Router)
│   ├── layout.tsx              # providers, metadata, theme script
│   ├── page.tsx                # homepage
│   ├── templates/              # explorer + [slug] detail page
│   ├── categories/             # index + [slug]
│   ├── collections/            # index + [slug]
│   ├── search/  favorites/  pricing/  submit/  about/  changelog/
│   ├── not-found.tsx           # 404
│   ├── sitemap.ts  robots.ts   # generated from the catalogue
│   └── globals.css             # design tokens + base layer
├── components/
│   ├── layout/                 # navbar, footer, containers, logo
│   ├── templates/              # card, grid, explorer, filters, preview, actions
│   ├── prompt/                 # prompt viewer + prompt section
│   ├── search/                 # command palette, search results
│   ├── collections/  home/  pricing/  forms/  ui/
│   ├── visuals/                # the SVG scene system
│   └── providers/              # theme, toasts, favourites
├── data/                       # the entire content layer
│   ├── site.ts                 # branding, navigation, footer, agents
│   ├── templates.ts            # the catalogue (23 records)
│   ├── taxonomy.ts             # categories, styles, technologies
│   ├── collections.ts          # editorial groupings
│   ├── changelog.ts
│   └── prompts.ts              # compiles a template brief into agent prompts
├── lib/                        # catalog queries, URL filters, storage, clipboard
└── types/                      # domain types
```

## How the prompts work

Each template carries a structured brief in `template.spec`: routes, components, palette,
typography, spacing, radius, motion rules, interactions, content rules, constraints and a
file tree. `src/data/prompts.ts` compiles that brief into three agent-specific prompts:

| Agent | Shape |
| --- | --- |
| Claude Code | one narrative brief ending in a definition of done |
| Cursor | an ordered, file-by-file implementation plan |
| Codex | numbered requirements with explicit acceptance criteria |

Storing the brief once and compiling it means the three variants can never drift apart, and
adding a fourth agent is a single function.

### Adding a template

Append one object to the `templates` array in `src/data/templates.ts`. TypeScript will tell
you what is missing. Nothing else needs to change — the explorer, search, categories,
collections, sitemap, counts and the prompt compiler all read from that array.

```ts
{
  id: "tpl-aurora",
  slug: "aurora-reading-app",
  title: "Aurora",
  tagline: "Long-form reading interface",
  // ...
  visual: "editorial",          // which SVG scene represents it
  screenshots: [ /* 3-4 more scenes with captions */ ],
  spec: { /* the brief the prompt compiler consumes */ },
}
```

Two fields decide how a template looks without any image work:

- `accent` — a hex colour used throughout its previews and detail page.
- `visual` / `screenshots[].visual` — one of the scene kinds in
  `src/components/visuals/template-visual.tsx` (`landing`, `dashboard`, `analytics`,
  `commerce`, `portfolio`, `editorial`, `mobile`, `docs`, `pricing`, `checkout`, `auth`,
  `settings`). Scenes are varied deterministically by the template slug, so no two templates
  render identically.

### Changing the prompts

Edit `src/data/prompts.ts`. `claudeCodePrompt`, `cursorPrompt` and `codexPrompt` are plain
functions from a template to a string — change the wording, reorder the sections, or add a
new agent by extending `AgentId` in `src/types/template.ts` and adding an entry to `agents`
in `src/data/site.ts`.

### Changing the categories, styles or technologies

All three live in `src/data/taxonomy.ts`. Add an entry, add the matching id to the union in
`src/types/template.ts`, and the filters, category pages, counts and URL parsing pick it up
automatically.

### Changing the branding

`src/data/site.ts` holds the product name, tagline, description, URL, navigation and footer.
The mark itself is `LogoMark` in `src/components/layout/logo.tsx`. The colour system is in
`src/app/globals.css` — change `--accent` in the `:root` and `.dark` blocks and the whole
interface follows.

## Design system

Tokens are CSS custom properties defined once in `src/app/globals.css` and exposed to
Tailwind through `@theme inline`, so components use `bg-surface`, `text-muted`,
`border-line` rather than raw values.

- **Surfaces** `--canvas`, `--surface`, `--surface-2`, `--surface-3`
- **Lines** `--line`, `--line-strong`
- **Text** `--ink`, `--ink-muted`, `--ink-faint`
- **Accent** `--accent`, `--accent-hover`, `--accent-soft`, `--accent-line`
- **Radius** 4 / 6 / 8 / 12 / 16 / 20px
- **Shadows** three levels, used sparingly — borders carry most of the elevation

Dark is the primary theme; light is a full, deliberate second theme rather than an inversion.
The theme resolves from the system preference on first load, can be toggled from the navbar
or the command palette, and persists. An inline script in `<head>` applies the class before
first paint, so there is no flash.

## Features

- **Explorer** — filters for category, style, technology, price and rating, four sort orders,
  grid/list layouts, load-more pagination. Every filter is encoded in the URL, so any view is
  shareable and the back button behaves.
- **Search** — client-side across titles, descriptions, categories, tags, technologies and
  authors, with relevance ranking, debounce, recent searches and a real empty state.
- **Command palette** — `⌘K` / `Ctrl+K` anywhere, with template, category and collection
  results plus navigation and theme actions, fully keyboard driven.
- **Template detail** — device-switching preview (desktop / tablet / mobile), screenshot
  gallery with a keyboard-operable lightbox, the full design system, the page plan, and the
  prompt section with per-agent tabs, copy, download and full-screen.
- **Favourites** — `localStorage`, no account, with undo toasts and cross-tab sync.
- **Accessibility** — semantic landmarks, a skip link, focus traps and focus restoration in
  dialogs, `aria-live` result counts, visible focus rings, and full `prefers-reduced-motion`
  support.

## Verified

`npm run build` and `npm run lint` both pass with zero errors and zero warnings, TypeScript
is clean under `strict`, and an automated pass over the running site checks: 51 routes
crawled with no broken links; no page with a missing title, description, canonical or
`og:title`; no unlabelled control or image; no horizontal overflow at 390px or 768px; and no
console errors. The interaction suite covers the command palette, prompt copy and download,
prompt tabs, favourites persistence, URL filters, back-button behaviour, search states, theme
persistence, lightbox keyboard control, form validation and the 404.

## Adding a backend later

The front end is already shaped for it. `src/lib/catalog.ts` is the only module that knows
where records come from — everything else imports functions such as `filterTemplates`,
`searchTemplates` and `similarTemplates`. To move to an API:

1. Make the functions in `src/lib/catalog.ts` async and fetch instead of importing
   `src/data/templates.ts`.
2. Await them in the server components that already call them; the client explorer keeps its
   filter state in the URL, so it can call a route handler with the same query string.
3. Replace `src/lib/client-store.ts`'s favourites store with an authenticated endpoint —
   `FavoritesProvider` exposes the same interface either way.

No component reads local data directly, so none of them need to change.

## Notes on the content

Template names, authors, ratings, review counts and copy counts are fictional, written to
demonstrate the interface at a realistic scale. The design briefs are genuine: each one would
produce a working project if handed to a coding agent.
