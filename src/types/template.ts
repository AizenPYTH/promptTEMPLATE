/**
 * Domain types for the Promptly catalogue.
 *
 * Everything the UI renders is described here. The data layer (src/data)
 * is the only place that knows *where* the records come from, so swapping
 * the local files for a remote API later means changing `src/lib/catalog.ts`
 * and nothing else.
 */

export type CategoryId =
  | "saas"
  | "ecommerce"
  | "portfolio"
  | "agency"
  | "dashboard"
  | "landing-page"
  | "mobile"
  | "ai"
  | "fintech"
  | "developer-tools";

export type StyleId =
  | "minimal"
  | "dark"
  | "editorial"
  | "glass"
  | "brutalist"
  | "corporate"
  | "luxury"
  | "playful";

export type TechnologyId =
  | "nextjs"
  | "react"
  | "tailwind"
  | "vue"
  | "html-css"
  | "astro"
  | "typescript"
  | "framer-motion";

export type AgentId = "claude-code" | "cursor" | "codex";

/** Abstract UI scenes rendered as inline SVG — no external image dependency. */
export type VisualKind =
  | "landing"
  | "dashboard"
  | "analytics"
  | "commerce"
  | "portfolio"
  | "editorial"
  | "mobile"
  | "docs"
  | "pricing"
  | "checkout"
  | "auth"
  | "settings"
  | "chat"
  | "kanban"
  | "terminal"
  | "canvas"
  | "grid"
  | "gallery"
  | "invoice"
  | "map"
  | "timeline"
  | "report"
  | "archive"
  | "lookbook";

export interface Author {
  name: string;
  handle: string;
  role: string;
}

export interface Screenshot {
  id: string;
  label: string;
  caption: string;
  visual: VisualKind;
}

export interface Feature {
  title: string;
  description: string;
}

export interface PagePlan {
  route: string;
  purpose: string;
}

export interface Palette {
  background: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentContrast: string;
}

export interface Typography {
  display: string;
  body: string;
  mono: string;
  scale: string;
}

/**
 * The structured brief a template carries. `buildPrompt()` turns this into
 * the long-form, agent-specific prompts shown on the template page.
 */
export interface TemplateSpec {
  positioning: string;
  audience: string;
  /** The art direction, in prose. What this build should feel like and why. */
  designDirection: string;
  /** Shape language, borders, elevation, imagery, iconography, density. */
  visualLanguage: string[];
  /** Grid, container widths, header behaviour, the composition of key pages. */
  layout: string[];
  pages: PagePlan[];
  components: string[];
  palette: Palette;
  typography: Typography;
  spacing: string;
  radius: string;
  motion: string[];
  interactions: string[];
  /** Template-specific breakpoint behaviour, not generic advice. */
  responsive: string[];
  content: string[];
  /** Engineering requirements particular to this build. */
  technical: string[];
  constraints: string[];
  /** Explicit prohibitions — the fastest way to keep an agent on brief. */
  doNot: string[];
  fileTree: string[];
}

export interface Template {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: CategoryId;
  style: StyleId;
  tags: string[];
  technologies: TechnologyId[];
  author: Author;
  /** 0 means free. */
  price: number;
  rating: number;
  reviews: number;
  copies: number;
  featured: boolean;
  isNew: boolean;
  popular: boolean;
  accent: string;
  visual: VisualKind;
  screenshots: Screenshot[];
  demoUrl: string | null;
  features: Feature[];
  spec: TemplateSpec;
  createdAt: string;
}

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  short: string;
  description: string;
  accent: string;
  visual: VisualKind;
}

export interface Style {
  id: StyleId;
  name: string;
  description: string;
}

export interface Technology {
  id: TechnologyId;
  name: string;
  short: string;
}

export interface Collection {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  curator: string;
  accent: string;
  visual: VisualKind;
  templateSlugs: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  summary: string;
  tag: "release" | "feature" | "improvement";
  items: string[];
}

export type SortId = "popular" | "newest" | "most-copied" | "top-rated";
export type PriceFilter = "free" | "premium";

export interface TemplateFilters {
  query: string;
  categories: CategoryId[];
  styles: StyleId[];
  technologies: TechnologyId[];
  price: PriceFilter[];
  minRating: number;
  sort: SortId;
}
