# Promptly

The design gallery that hands you the prompt. Browse ten finished website designs, open one,
look at it running, then copy the prompt that rebuilds it in Claude Code, Cursor or Codex.

> **Discover → Preview → Copy → Build**

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
| Styling | Tailwind CSS v4, design tokens from the design handoff |
| Icons | lucide-react |
| Type | Familjen Grotesk (display), IBM Plex Sans, IBM Plex Mono |
| Imagery | None. Every preview is the template itself, rendered live in HTML |
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
│   ├── preview/                # the ten live archetypes + the scaling frame
│   ├── motion/                 # mesh, reveal, split-text, magnetic
│   └── providers/              # theme, toasts, favourites
├── data/                       # the entire content layer
│   ├── site.ts                 # branding, navigation, footer, agents
│   ├── templates.ts            # the catalogue (10 records)
│   ├── taxonomy.ts             # categories, styles, technologies
│   ├── collections.ts          # editorial groupings
│   ├── changelog.ts
│   └── prompts.ts              # compiles a template brief into agent prompts
├── lib/                        # catalog queries, URL filters, storage, clipboard
└── types/                      # domain types
```

## How the prompts work

The prompt is the product, so it gets the most structure. Each template carries a
structured brief in `template.spec`: positioning, audience, art direction, visual language,
layout, routes, components, palette, typography, spacing, radius, motion, interactions,
responsive rules, content rules, technical requirements, constraints, prohibitions and a
file tree. `src/data/prompts.ts` compiles that brief into three agent-specific prompts:

| Agent | Shape |
| --- | --- |
| Claude Code | a full design brief in 21 sections — ROLE, OBJECTIVE, PROJECT CONTEXT, DESIGN DIRECTION, VISUAL LANGUAGE, LAYOUT, PAGES, COMPONENTS, TYPOGRAPHY, COLOR SYSTEM, SPACING, RESPONSIVE BEHAVIOR, INTERACTIONS, ANIMATIONS, ACCESSIBILITY, CONTENT, TECHNICAL REQUIREMENTS, FILE STRUCTURE, IMPLEMENTATION RULES, DO NOT, DEFINITION OF DONE |
| Cursor | an ordered, file-by-file implementation plan with a verification checklist |
| Codex | numbered requirements (R1…R16) with explicit acceptance criteria |

Every prompt runs to roughly 10,000–12,000 characters (about 2,400–3,000 tokens) and all 69
are distinct — the art direction, the layout rules and the prohibitions are written per
template, not templated with the name swapped.

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

Two fields decide how a template looks, and neither involves an image:

- `accent` — the template's hex. The preview derives its ground and its gradient stop from it,
  so ten previews built from ten archetypes never read as one design recoloured.
- `archetype` — which of the ten live previews renders it: `landing`, `dashboard`, `portfolio`,
  `commerce`, `data-grid`, `board`, `docs`, `canvas`, `launch`, `editorial`. No archetype is
  reused, so no two templates share a silhouette or a motion.

A preview is a real page in `src/components/preview/archetypes/`, written at a 1120×700 design
size and scaled to whatever box it sits in by a container query — one line of CSS, no iframe and
no JavaScript. In a card its motion holds the finished frame until the card is hovered or
focused; on the detail page it runs, with a pause control and a device switcher.

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

Tokens are literal values from the design handoff, defined once in `src/app/globals.css` and
exposed to Tailwind through `@theme inline`. The chrome is achromatic warm-dark with a single
citron accent, deliberately outside the range of the template palettes so the interface never
competes for colour with the work it is showing.

- **Colour** `canvas` `canvas-raised` · `surface-1/2/3` · `border-1/2` · `text-primary/secondary/muted/faint` · `accent` `#D4F250`
- **Type** Familjen Grotesk for display, IBM Plex Sans for body, IBM Plex Mono for labels and code, on a fourteen-step scale
- **Radii** control 8 · card 14 · panel 20 · glass 20 · modal 24
- **Elevation** three levels, plus an accent shadow on the primary action
- **Glass** blur 24–28px at 140–160% saturation, never over flat colour, at most four surfaces per viewport, replaced by a solid surface below 640px
- **Motion** twenty-three specified effects on two easing curves, transform and opacity only, all ambient motion removed under `prefers-reduced-motion`

Dark is the primary theme. Light is designed against the same contrast standard rather than
inverted — citron fails on a light ground, so it is replaced by an olive that passes.

## Features

- **Explorer** — filters for category, style, technology, price and rating, four sort orders,
  grid/list layouts, load-more pagination. Every filter is encoded in the URL, so any view is
  shareable and the back button behaves.
- **Search** — client-side across titles, descriptions, categories, tags, technologies and
  authors, with relevance ranking, debounce, recent searches and a real empty state.
- **Command palette** — `⌘K` on Apple platforms, `Ctrl K` everywhere else (the hint shown in
  the navbar follows the platform), with template, category and collection results plus
  navigation and theme actions, fully keyboard driven.
- **Template detail** — device-switching preview (desktop / tablet / mobile), screenshot
  gallery with a keyboard-operable lightbox, the full design system, the page plan, and the
  prompt section.
- **Prompt viewer** — editor-style agent tabs, character and token counts, line numbers, a
  wrap / no-wrap toggle, copy with an explicit confirmation, `.txt` download named
  `<slug>-<agent>.txt`, and a true full-screen mode with its own fixed header.
- **Copy from anywhere** — the prompt can be copied from a card on hover, from the homepage
  demonstration, from the template header or from the viewer itself; all four use the same
  compiled string and the same agent preference.
- **Favourites** — `localStorage`, no account, with undo toasts and cross-tab sync.
- **Accessibility** — semantic landmarks, a skip link, focus traps and focus restoration in
  dialogs, `aria-live` result counts, visible focus rings, and full `prefers-reduced-motion`
  support.

## Verified

`npm run build` and `npm run lint` pass with zero errors and zero warnings; TypeScript is clean
under `strict`. Against the running build:

- 31 routes crawled, no broken links, every page carrying a title, description, canonical and `og:title`.
- No unlabelled control, image or form field; no horizontal overflow at 390px or 768px; no console errors.
- 44 interaction checks pass, including that the preview is live DOM rather than an image
  (29 elements, 0 `<img>`), that it scales to its container, that motion pauses, that the device
  switcher narrows the frame to 388px, and that the full-screen preview opens and closes on Escape.

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
