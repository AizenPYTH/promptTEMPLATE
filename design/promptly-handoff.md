# Promptly — handoff contract (pass one, dark theme)

Target stack: Next.js, TypeScript, Tailwind v4. All values are literal — nothing here needs interpretation.

Identity rules this pass follows: the chrome is achromatic warm-dark with **one** accent (citron). Template palettes span violet, teal, brass, coral, blue, green — so the chrome never competes for colour. No purple→pink gradient, no glowing orbs, no rainbow text. Wordmark stays `Promptly`.

---

## 1. Token table

### 1.1 Colour — dark (shipped this pass)

| Token | Value | Use |
|---|---|---|
| `canvas` | `#08080A` | page background outside artboards |
| `canvas-raised` | `#0C0B0A` | page surface / artboard ground |
| `surface-1` | `rgba(255,255,255,0.03)` | quiet blocks, note strips |
| `surface-2` | `rgba(255,255,255,0.04)` | cards, inputs, rail items |
| `surface-3` | `rgba(255,255,255,0.06)` | hovered card, active segment |
| `border-1` | `rgba(255,255,255,0.08)` | default hairline |
| `border-2` | `rgba(255,255,255,0.14)` | emphasis, secondary button |
| `text-primary` | `#F4F2EF` | headlines, body |
| `text-secondary` | `#A8A39B` | subheads, descriptions |
| `text-muted` | `#8A857D` | mono eyebrows, meta, counts (5.3:1 on `canvas-raised`) |
| `text-faint` | `#3F3C38` | code gutter digits only |
| `accent` | `#D4F250` | primary CTA, active filter, focus ring |
| `accent-hover` | `#E4FF7E` | hover / link hover |
| `accent-contrast` | `#14180A` | text on accent (contrast 13.6:1) |
| `positive` | `#62D19A` | positive delta |
| `warning` | `#E8B04B` | negative-but-not-error delta |

Ambient mesh (three blobs, no others):

| Blob | Colour | Opacity | Blur | Loop |
|---|---|---|---|---|
| mesh-a | `#1F6F6A` teal | `0.34` | `120px` | 26s |
| mesh-b | `#4B3F8F` violet | `0.30` | `120px` | 34s |
| mesh-c | `#7A5A22` amber | `0.25` | `130px` | 41s |

### 1.2 Colour — light (pass two)

Not derived by inversion. Reserved values, to be designed against the same contrast standard: canvas `#F7F6F3`, surfaces `#FFFFFF` / `rgba(20,19,18,0.03)` / `rgba(20,19,18,0.06)`, borders `rgba(20,19,18,0.10)` / `rgba(20,19,18,0.18)`, text `#14130F` / `#5B564F` / `#6F6A63`, accent `#5F7A0E` on white (accent-contrast `#FFFFFF`) — citron at `#D4F250` fails on light and is replaced, not reused. Mesh opacities drop to `0.14 / 0.12 / 0.10`.

### 1.3 Typography

- **Display**: Familjen Grotesk (Google Fonts, self-hostable)
- **Body**: IBM Plex Sans
- **Mono**: IBM Plex Mono

| Step | Size | Weight | Tracking | Line height | Face |
|---|---|---|---|---|---|
| `label` | 11px | 500 | +0.14em, uppercase | 1.2 | mono |
| `label-lg` | 12px | 400 | +0.16em, uppercase | 1.3 | mono |
| `code` | 12.5–13px | 400 | 0 | 1.9 | mono |
| `caption` | 13px | 400 | 0 | 1.5 | body |
| `body-sm` | 13.5px | 400 | 0 | 1.55 | body |
| `body` | 15px | 400 | 0 | 1.6 | body |
| `body-lg` | 17px | 400 | 0 | 1.6 | body |
| `lead` | 19px | 400 | 0 | 1.55 | body |
| `h5` | 18px | 600 | −0.01em | 1.3 | display |
| `h4` | 24px | 600 | −0.01em | 1.25 | display |
| `h3` | 34px | 700 | −0.03em | 1.1 | display |
| `h2` | 44px | 700 | −0.03em | 1.05 | display |
| `h1` | 64px | 700 | −0.035em | 1.0 | display |
| `display` | 88px | 700 | −0.035em | 0.94 | display |

Numerals in dashboards and counters: `font-variant-numeric: tabular-nums`.

### 1.4 Spacing, containers, radii, elevation

Base unit **4px**. Section rhythm: desktop `56px` between bands, `80px` before a closing CTA; mobile `40px` / `56px`. Page gutter 40px desktop, 20px at 390. Container 1440 max, content column 1360.

| Radius | Value | Class |
|---|---|---|
| `r-control` | 8px | buttons, inputs, segments, chips-square |
| `r-card` | 14px | template card, KPI tile, thumbnail |
| `r-panel` | 20px | artboard shell, large preview |
| `r-glass` | 20px | glass panel |
| `r-modal` | 24px | command palette |
| `r-pill` | 999px | filter chips, marquee tags |

| Elevation | Value |
|---|---|
| `e1` | `0 1px 2px rgba(0,0,0,0.40)` |
| `e2` | `0 8px 24px -8px rgba(0,0,0,0.55)` |
| `e3` | `0 32px 64px -24px rgba(0,0,0,0.70)` |

Accent CTA carries `0 8px 24px -8px rgba(212,242,80,0.40)` instead of `e2`.

---

## 2. Glass spec (CSS-ready)

| Class | backdrop-filter | background (dark) | background (light) | border | inner highlight |
|---|---|---|---|---|---|
| `glass-panel` | `blur(24px) saturate(140%)` | `rgba(20,19,18,0.55)` | `rgba(255,255,255,0.62)` | `rgba(255,255,255,0.12)` | `inset 0 1px 0 rgba(255,255,255,0.14)` |
| `glass-inner` (inside a preview) | `blur(20px) saturate(140%)` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.14)` | `inset 0 1px 0 rgba(255,255,255,0.18)` |
| `glass-modal` | `blur(28px) saturate(160%)` | `rgba(20,19,18,0.72)` | `rgba(255,255,255,0.78)` | `rgba(255,255,255,0.14)` | `inset 0 1px 0 rgba(255,255,255,0.16)` |
| `glass-scrim` (card hover) | `blur(8px)` | `rgba(8,8,10,0.55)` | `rgba(255,255,255,0.55)` | none | none |

Rules:

- **Glass over flat colour is forbidden.** A glass surface must sit over ambient mesh, a gradient, or content that scrolls beneath it. Over flat `canvas` it reads as a grey box and must be `surface-2` + `border-1` instead.
- **Maximum four glass surfaces per viewport** (the brief's ceiling is five; we hold one in reserve for the modal). The palette counts as one and suppresses the others while open.
- Below **640px**: no `backdrop-filter`. Replace with `surface-3` + `border-2` + `e2`. The top-edge highlight stays — it costs nothing.
- Text on glass over moving mesh: ink is full-opacity `text-primary` or `text-secondary` — never alpha-muted. Contrast is measured against the brightest frame of the mesh loop (mesh-a at 0.34 over `#0C0B0A` = `#15201F`; `#A8A39B` on it = 5.9:1).

---

## 3. Motion table

Two curves only: **out** `cubic-bezier(.16,1,.3,1)` for anything entering or responding to a pointer, **inout** `cubic-bezier(.4,0,.2,1)` for anything looping. Duration bands: micro 120–200ms, UI 240–400ms, entrance 600–900ms, ambient 6–41s. Transform and opacity only (plus `clip-path`, `stroke-dashoffset`, `filter: blur` on the palette scrim). Entrances fire once.

| # | Effect | Trigger | Property | From → To | Duration | Easing | Repeats | Reduced motion |
|---|---|---|---|---|---|---|---|---|
| 1 | Headline word rise | in view | opacity, translateY, rotate | `0, 0.5em, 1.5deg` → `1, 0, 0` | 800ms, **60ms stagger per word** | out | no | final state, no delay |
| 2 | Block rise | in view | opacity, translateY | `0, 16px` → `1, 0` | 600–700ms, 100ms stagger | out | no | final state |
| 3 | Mask reveal (cards, images) | in view | clip-path | `inset(0 0 100% 0)` → `inset(0)` | 900ms, 80ms stagger | out | no | no clip |
| 4 | Mesh drift | always | translate, scale | ±11%, 0.92→1.15 | 26s / 34s / 41s | inout | infinite | **stopped** |
| 5 | Cursor glow | pointermove in hero | translate of 620px radial | follows pointer | 0 (rAF), opacity 300ms | — | — | not rendered |
| 6 | Card 3D tilt | pointerenter/move | perspective rotateX/Y, translateY | 0 → max **4°** each axis, lift 6px | 500ms spring-out | out | no | none; hover state = border + scrim only |
| 7 | Specular highlight | pointermove on card | radial-gradient position, opacity | follows pointer, 0 → 1 | 300ms | out | no | not rendered |
| 8 | Hover actions scrim | pointerenter on card | opacity, backdrop blur | `0` → `1`, `0 → 8px` | 280ms | out | no | instant, no blur |
| 9 | Magnetic button | pointermove within bounds | translate | 0 → max **6px x / 4px y** | 350ms | out | no | none |
| 10 | Glass light sweep | timer | translateX, skewX, opacity | `-120% → 320%`, skew −18°, 0→.5→0 | 26% of a 6–9s cycle | inout | every 6–9s | **stopped** |
| 11 | Counter roll-up | 40% in view | textContent 0 → target | ease-out cubic | 1400ms | — | once | final number printed |
| 12 | SVG path draw | in view / preview running | stroke-dashoffset | `900` → `0` | 2400–2800ms | inout | alternate while running | drawn state |
| 13 | Bar grow | preview running | scaleY | `0.15` → `1` | 1400–2200ms | inout | alternate | full bars |
| 14 | Type-out | sequence | width | `0` → `100%` steps | 2200–3000ms | steps | alternate / once | full text |
| 15 | Caret blink | always | opacity | 1 → 0 | 1s | step-end | infinite | hidden |
| 16 | Marquee | always | translateX | `0` → `-50%` | 26–38s | linear | infinite | **stopped**, first frame; pauses on hover/focus |
| 17 | Hero loop object | timer | opacity, translateY, scale | crossfade 3 states, 12s cycle | 12s | inout | infinite | shows COPY state statically |
| 18 | Step-rail indicator | same 12s clock | translateX | `0 → 300%` in 4 steps | steps(1) | — | infinite | first step marked |
| 19 | Tab indicator | click | translateX, width | measured per tab | 400ms | out | no | instant |
| 20 | Segment / filter change | click | translateX | measured | 400ms | out | no | instant |
| 21 | Palette entrance | ⌘K | opacity, translateY; page blur+scale | `0, 16px` → `1, 0`; page `0 → 12px`, `1 → 0.99` | 240ms modal / 300ms page | out | no | instant, blur only (no scale) |
| 22 | Cursor path in demo | timer | translate along 4 points | 12s | 12s | inout | infinite | cursor hidden |
| 23 | Product lift pulse | timer | translateY | `0 → -6px → 0` | 6s cycle | out | infinite | static |

Rendering budget: no more than **four** looping ambient effects per viewport, each on its own compositor layer (`will-change: transform` only while animating). Everything above holds 60fps at 1440 with the mesh, sweep, chart draw and marquee running together.

---

## 4. Per-screen notes

| Artboard | Components | Effects (by #) |
|---|---|---|
| **1a Homepage hero** | nav, glass search stub, badge, display headline, lead, primary + secondary CTA, stat row, glass loop object with step rail | 1, 2, 4, 5, 6, 7, 9, 10, 11, 14, 15, 17, 18, 22 |
| **1b Homepage full page** | featured 4-up, how-it-works 4 cards, prompt demo (glass + code), category marquee, stat band, closing CTA | 2, 3, 4, 9, 10, 11, 12, 16 |
| **1c Explorer** | filter rail (category list, style chips, tech chips, price segment, rating slider), search, sort, 3×3 card grid, card state row | 2, 6, 7, 8, 12, 20 + previews idle until hover |
| **1d Detail above fold** | breadcrumb, title block, author/rating/tags, glass action row, device switcher, large running preview, thumbnail strip | 3, 4, 9, 10, 12, 13, 14, 15 |
| **1e Prompt section** | glass editor shell, agent tabs, toolbar (wrap, lines, download, expand, copy), gutter code view, sections list, copied confirmation, palette swatches | 14, 15, 19 |
| **1f Command palette** | blurred page beneath, glass modal, query row, grouped results (templates / categories / actions), shortcut footer | 4, 15, 21 |
| **1g Preview kit** | four archetype specimens at large state + state/palette/type/silhouette notes | 3, 4, 10, 12, 13, 14, 16, 23 |

No screen uses more than five of the effects for its own chrome; the rest belong to previews, which are content.

---

## 5. Preview kit

Scope is now **ten templates, ten archetypes** — one preview per template, all ten built and running: `landing` (Nova AI) · `dashboard` (Orbit) · `portfolio` (Studio 27) · `commerce` (Arcadia) · `data grid` (Finora) · `board` (Cadence) · `docs` (Mono) · `canvas / node editor` (Flux) · `launch` (Launchpad) · `editorial` (Zenith). No archetype is reused, so no two previews share a silhouette or a motion.

Shared contract, every archetype:

- **Palette hooks** — exactly three: `canvas` (template's darkest), `accent` (template's hex), `gradient-stop` (accent at 18% lightness). Chrome greys, borders and text greys never change, so twenty-three previews read as one family without reading as one design.
- **Small state** — frame one only: mesh at 0%, charts drawn, marquees parked, no caret. Motion starts 120ms after hover or focus, stops on leave.
- **Large state** — everything runs, plus a Pause motion control.

| Archetype | Composition | Type treatment | Internal motion | Recognisable at 320px by |
|---|---|---|---|---|
| **landing** (Nova AI) | Nav row, 38–60px two-line headline left, glass terminal panel right, mesh blob top-left | Display grotesk 700 at −3.5%, mono for the terminal | Mesh drift 20s, light sweep every 6s, terminal line types | Glass panel pinned right of a two-line headline |
| **dashboard** (Orbit) | 132px left rail, three KPI tiles, one full-width area chart with a dashed comparison line | Mono figures (tabular), Plex Sans labels, no display face | Chart draws 2.8s alternate, counters roll once, KPI deltas fade in | Left rail + a single rising line |
| **portfolio** (Studio 27) | Copy column left, tall image column right (200px), thumbnail row bottom | Italic display 46px, mono eyebrow at +0.18em | Headline mask-reveals, image panel reveals then its highlight drifts 16s | Oversized italic beside one tall image block |
| **commerce** (Arcadia) | Header with cart count, 2×2 product grid with price rail, marquee strip footer | Wide-tracked caps wordmark, mono prices, body product names | One tile lifts 6px on a 6s cycle, marquee crawls 26s | 2×2 grid over a crawling strip |
| **data grid** (Finora) | Header, 4-column header row, six ledger rows, frozen first column, totals footer | Mono throughout, tabular figures, no display face | A highlight band scans down the rows on a 5.5s cycle | Dense ruled rows with one lit band |
| **board** (Cadence) | Three columns (todo / in progress / done), one card in flight, burn-down bar | Body copy on cards, mono column labels | A card slides column-to-column over 7s; the burn bar grows 3s alternate | Three ragged columns, one card mid-air |
| **docs** (Mono) | 120px nav, article measure, 116px ToC | Display 26px file name, mono code block, body prose | ToC marker walks four positions over 8s; one config line types | Three columns, the outer two narrow |
| **canvas** (Flux) | Dotted grid, three glass nodes, two bezier edges, violet bloom bottom-right | Mono node labels at +0.12em, body node titles | Edge dashes flow 1.4s linear; the middle node pulses a 8px ring every 2.6s | Nodes joined by curved dashed edges |
| **launch** (Launchpad) | Centred stack: eyebrow, 44px headline, four clock tiles, floating CTA | Display 700 headline, mono clock digits | Digits tick with staggered 200ms offsets; CTA floats ±8px on 4s | A row of four square tiles under centred type |
| **editorial** (Zenith) | Narrow measure with drop cap, wordmark/issue rule, tall image column right | Display 400 at 30px for the headline, 52px brass drop cap, 12px/1.7 prose | Headline wipes up 1.5s alternate; image column mask-reveals, highlight drifts 18s | One text measure with a large initial beside a tall panel |

Held in reserve if the catalogue grows past ten: **analytics** (multi-chart with a date brush), **mobile app** (phone frame + floating sheet), **chat / AI** (streaming reply with a tool-call chip), **gallery** (offset masonry, one item lifted).

Card the preview sits in:

| State | Border | Background | Transform | Extra |
|---|---|---|---|---|
| rest | `border-1` | `surface-2` | none | preview idle at frame one |
| hover | `rgba(255,255,255,0.20)` | `surface-3` | tilt ≤4°, lift 6px | scrim + Copy prompt / Preview / ♥, specular follows pointer, preview wakes |
| focus | `border-1` | `surface-2` | none | `outline: 2px #D4F250; outline-offset: 3px` + inner 1px dark; same three actions rendered, not hover-gated |

Large preview (detail page): 560px tall, `r-panel`, device switcher desktop/tablet/mobile (widths 1440 / 834 / 390 scaled to fit), full-screen mode, Pause motion. Thumbnail strip below: 180×104 tiles, `r-card`, active tile bordered `rgba(212,242,80,0.45)`, overflow collapses to `+N more`.

---

## 6. Component states

| Component | Rest | Hover | Focus | Active | Disabled | Loading |
|---|---|---|---|---|---|---|
| Primary button | `accent` bg, `accent-contrast` text, accent shadow | `accent-hover`, magnetic ≤6px | 2px `accent` ring, 3px offset, 1px dark inner | `translateY(1px)`, shadow → `e1` | `rgba(212,242,80,0.35)` bg, muted text, no shadow | label holds, 14px mono spinner replaces the arrow |
| Secondary button | `border-2`, `surface-2` | `surface-3`, border `rgba(255,255,255,0.22)` | same ring | `translateY(1px)` | 40% opacity | spinner left of label |
| Icon button (44px) | `border-2` | `surface-3` | same ring | scale 0.96 | 40% opacity | — |
| Input / search | `border-2`, `surface-2`, muted placeholder | border `rgba(255,255,255,0.20)` | 2px `accent` ring, border transparent | — | 40% opacity | trailing spinner |
| Filter chip | `border-1`, secondary text | `surface-3` | ring | `accent` bg tint `0.12` + border `0.40`, accent text | 40% opacity | — |
| Rail category | transparent | `surface-2` | ring inset | tint `0.12`, accent text | — | count → `–` |
| Segment (price) | track `surface-2` | thumb widens 2px | ring on track | thumb slides 400ms | — | — |
| Agent tab | mono, secondary text | primary text | ring | indicator under, primary text | — | — |
| Template card | see §5 | see §5 | see §5 | scale 0.995 | — | shimmer on preview only, no text skeleton |
| Copy action | `Copy prompt` + char count | `accent-hover` | ring | press 1px | greyed while prompt loads | — → success: accent tint panel, ✓, `Copied for Claude Code`, auto-clears 2.4s |
| Palette result row | transparent | `surface-2` | selected = tint `0.12` + border `0.35` + `↵ open` | — | — | skeleton rows 3× |

---

## 7. Exceptions

1. **Hero runs five ambient effects, not four.** Mesh (counts as one), sweep, loop crossfade, step rail, caret. The first screen is the argument for the whole product; every later screen stays at or below four.
2. **The hero loop object is decoration and content at once.** It exists to explain DISCOVER → PREVIEW → COPY → BUILD, so it earns a 12s infinite loop where nothing else on the page gets one.
3. **Accent on a dark canvas breaks the usual "accent = brand hue" habit.** Citron is deliberately outside the range of the twenty-three template palettes so chrome and content never fight. It is the only saturated element in the chrome.
4. **Card tilt is capped at 4°, not the genre's usual 10–14°.** At three cards per row and 180px previews, more tilt distorts the preview it is meant to show off.
5. **Type-out animations loop `alternate` in these artboards** so the effect is visible without scrubbing. In production they fire once per view.
6. **Preview specimen ink sits at `rgba(244,242,239,0.72–0.74)`, not full opacity.** A preview is a picture of another site, and its own muted text is part of that picture; 0.72 alpha on the archetype grounds still measures 5.1–5.6:1, so the rule holds while the preview keeps its own hierarchy. Below 0.72 is not permitted.
7. **The `data-faint` code-gutter grey (`#3F3C38`) is below 4.5:1 on purpose.** Line numbers are decorative; they are `aria-hidden` and `user-select: none`, and no information exists only there.
8. **Filter rail is 264px, wider than the 240px sidebar the dashboard archetype uses.** Five filter groups need the room; the two are not the same component.

## Still to do (pass two)

Light theme designed to this standard · mobile 390 (hero, explorer with filter sheet, detail above fold, prompt section) · remaining eight preview archetypes · collections index + one collection · category page · pricing · about, submit, favorites empty, 404 · responsive notes at 1280 / 1024 / 768 with per-effect survive/simplify/drop.
