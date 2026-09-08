import type { AgentId, Template } from "@/types/template";
import { categoryMap, styleMap, technologyMap } from "@/data/taxonomy";

/**
 * Prompt compiler.
 *
 * Every template carries a structured brief (`template.spec`). Rather than
 * storing three near-identical walls of text per template, we compile the
 * brief into an agent-specific prompt. Each agent receives the same substance
 * in the shape it works best with:
 *
 *   claude-code — a full design brief, section by section, ending in a
 *                 definition of done
 *   cursor      — an ordered, file-by-file implementation plan with
 *                 verification steps
 *   codex       — numbered requirements, constraints and acceptance criteria
 *
 * The output has to read like something a person wrote for another person.
 * A prompt that reads as a configuration dump gets a result that looks like
 * one, so every section carries a sentence of intent before its list.
 */

const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");
const numbered = (items: readonly string[], start = 1) =>
  items.map((item, i) => `${i + start}. ${item}`).join("\n");

function techList(template: Template) {
  return template.technologies.map((t) => technologyMap.get(t)?.name ?? t).join(", ");
}

function routeLines(template: Template) {
  return template.spec.pages.map((p) => `- \`${p.route}\` — ${p.purpose}`).join("\n");
}

function colourSystem(template: Template) {
  const { palette } = template.spec;
  return `Define these once as CSS custom properties and reference them everywhere. No component may contain a raw hex value.

    --background        ${palette.background}
    --surface           ${palette.surface}
    --border            ${palette.border}
    --text              ${palette.text}
    --text-muted        ${palette.muted}
    --accent            ${palette.accent}
    --accent-contrast   ${palette.accentContrast}

Derive any hover, pressed, disabled and focus states from these seven values — mix with the background rather than introducing new hues. The accent is the scarcest resource on the page: if you find yourself using it a fourth time in one viewport, one of those uses is wrong.`;
}

function typographySection(template: Template) {
  const { typography } = template.spec;
  return `- Display: ${typography.display}
- Body: ${typography.body}
- Mono: ${typography.mono}
- Scale: ${typography.scale}

Set the scale as tokens and use only those steps. Headings carry tighter tracking as they grow; body copy never goes below the size specified above, including on mobile. Numbers that sit in columns or update in place use tabular figures.`;
}

const ENGINEERING_STANDARDS = [
  "TypeScript in strict mode. No `any`, no non-null assertions to silence the compiler.",
  "No placeholder copy anywhere. Every string is real, specific and written for this product — no lorem ipsum, no `Feature one`, no `Lorem`.",
  "All data lives in typed modules under a data directory, imported by the UI. Never inline a record inside a component.",
  "Semantic HTML first: landmarks, headings in order, labelled controls, alt text that carries meaning.",
  "Every interactive element is reachable by keyboard and shows a visible focus ring.",
  "Loading, empty and error states exist for every surface that renders a collection.",
  "No dead controls. If it looks clickable, it does something.",
  "The build, the type-checker and the linter all pass with zero errors and zero warnings.",
];

const IMPLEMENTATION_RULES = [
  "Build the design tokens before the first component, so nothing hard-codes a value it will need to unlearn.",
  "Build the data layer second: types, then typed modules with realistic records. The UI is written against real content from the first render.",
  "Build shared primitives (button, field, badge, dialog) before pages, so every screen composes from the same parts.",
  "Then build pages in the order listed under PAGES — the first one sets the patterns the rest reuse.",
  "Finish each page including its edge cases before starting the next. Do not leave a route stubbed to come back to.",
  "Do a deliberate responsive pass per breakpoint rather than trusting flex to resolve it.",
  "Finish with an accessibility pass: tab order, focus rings, labels, contrast, reduced motion.",
];

/* ------------------------------ Claude Code ------------------------------ */

function claudeCodePrompt(template: Template): string {
  const s = template.spec;
  const category = categoryMap.get(template.category)?.name ?? template.category;
  const style = styleMap.get(template.style)?.name ?? template.style;

  return `# ROLE

You are a senior front-end engineer and product designer. You have shipped interfaces that people use every day, and it shows in the details: type that sits on a scale, spacing with a rhythm, states that all exist, and keyboard access that was designed rather than retrofitted. You write production code, not demonstrations.

Work autonomously. Where this brief leaves a decision open, make the choice a careful designer would make, and note it in the README when you are done.

# OBJECTIVE

Build **${template.title}** — ${template.tagline.toLowerCase()} — as a complete, runnable front-end project.

${template.description}

# PROJECT CONTEXT

${template.longDescription}

- Category: ${category}
- Positioning: ${s.positioning}
- Primary audience: ${s.audience}
- Visual direction: ${style}

Everything is front-end. There is no backend, no database and no authentication: all records are local, typed mock data. Write them as though they came from a real system — realistic names, plausible numbers, believable edge cases.

# DESIGN DIRECTION

${s.designDirection}

# VISUAL LANGUAGE

${bullets(s.visualLanguage)}

# LAYOUT

${bullets(s.layout)}

# PAGES

Build every route below. Each is reachable from the primary navigation, and each is finished — not a placeholder with a heading.

${routeLines(template)}

# COMPONENTS

Build these as reusable, typed components rather than as markup repeated per page:

${bullets(s.components)}

# TYPOGRAPHY

${typographySection(template)}

# COLOR SYSTEM

${colourSystem(template)}

# SPACING

${s.spacing}

Radius: ${s.radius}

Elevation: reach for a border before a shadow. Two shadow levels for the whole build is the ceiling, and most surfaces should need neither.

# RESPONSIVE BEHAVIOR

Design at 390px first, then work up through 768px, 1024px, 1280px and 1440px. Mobile is a designed layout, not a narrowed desktop one. Specifically:

${bullets(s.responsive)}

Nothing may scroll horizontally except containers explicitly designed to — and those must show that they scroll.

# INTERACTIONS

${bullets(s.interactions)}

# ANIMATIONS

Motion is functional: it explains a change of state or the origin of a new surface. Nothing loops without a reason, and nothing exceeds 300ms unless it is a deliberate page-level transition.

${bullets(s.motion)}

Every animation above is disabled under \`prefers-reduced-motion: reduce\` — not shortened, disabled, with the end state rendered immediately.

# ACCESSIBILITY

- WCAG 2.2 AA: at least 4.5:1 for body text, 3:1 for large text and interface boundaries.
- Colour is never the only carrier of meaning. Pair it with a glyph, a label or a pattern.
- Dialogs trap focus, close on Escape, and return focus to the element that opened them.
- Asynchronous changes — result counts, form errors, copy confirmations — are announced through a live region.
- The whole interface is operable by keyboard alone in a sensible tab order.
- Respect \`prefers-reduced-motion\` and \`prefers-color-scheme\` where a theme exists.

# CONTENT

The copy is part of the build, not a placeholder to fill later:

${bullets(s.content)}

# TECHNICAL REQUIREMENTS

Stack: ${techList(template)}, with strict TypeScript.

${bullets(s.technical)}

${bullets(ENGINEERING_STANDARDS)}

# FILE STRUCTURE

\`\`\`
${s.fileTree.join("\n")}
\`\`\`

# IMPLEMENTATION RULES

${numbered(IMPLEMENTATION_RULES)}

# DO NOT

${bullets(s.doNot)}

Also, across the whole build:

${bullets(s.constraints)}

# DEFINITION OF DONE

1. The project installs and runs with a single command, with no manual setup.
2. Every route under PAGES exists, is linked from the navigation, and is finished.
3. Every interaction under INTERACTIONS works. There are no non-functional controls.
4. Loading, empty and error states exist for every list, grid or table.
5. The layout is correct at 390px, 768px, 1024px, 1280px and 1440px, with no horizontal page scroll.
6. A keyboard-only walkthrough of every route succeeds, with a visible focus ring at each stop.
7. With \`prefers-reduced-motion: reduce\`, no entrance or looping animation plays.
8. Type-check, lint and build all pass with zero errors and zero warnings.
9. A README explains the structure, the design tokens, and how to change the content.

Build the whole thing before reporting back. When you finish, list the decisions you made that this brief left open.`;
}

/* --------------------------------- Cursor -------------------------------- */

function cursorPrompt(template: Template): string {
  const s = template.spec;
  const category = categoryMap.get(template.category)?.name ?? template.category;

  const steps = [
    `**Scaffold and configure.** Set up ${techList(template)} with strict TypeScript, path aliases and the lint script. Do this before writing any UI — configuration changes are cheap now and expensive later.`,
    `**Design tokens.** Create the colour, type, spacing and radius tokens from the DESIGN SYSTEM section as CSS custom properties, then map them to utility classes. From this step onward, no component contains a raw value.`,
    `**Data layer.** Define the types, then one typed module per entity, populated with realistic records. Write the content now: every screen after this is built against real copy.`,
    `**Layout shell.** Build the page shell described under LAYOUT — ${s.layout[0]}. Include the navigation and the responsive container behaviour.`,
    `**Shared primitives.** Build the button, field, badge and dialog primitives so every later screen composes from the same parts. Include focus and disabled states now, not later.`,
    ...s.pages.map(
      (page, i) =>
        `**Page ${i + 1}: \`${page.route}\`.** ${page.purpose} Finish it completely — including its empty and loading states — before moving on.`,
    ),
    `**Components pass.** Extract and finish the named components: ${s.components.join("; ")}.`,
    `**Interactions pass.** Wire the behaviour: ${s.interactions.join("; ")}.`,
    `**Motion pass.** Add only the animations listed under ANIMATIONS, and gate every one behind \`prefers-reduced-motion\`.`,
    `**Responsive pass.** Work each breakpoint deliberately — 390px, 768px, 1024px, 1280px, 1440px — applying the rules under RESPONSIVE.`,
    `**Accessibility pass.** Tab order, focus rings, labels, contrast, dialog focus traps, live regions for async changes.`,
    `**Verification.** Run the type-checker and the linter, fix everything they report, then re-read your own diff as if you were reviewing someone else's.`,
  ];

  return `# ${template.title} — implementation plan

You are working in this repository as a senior front-end engineer. Follow the plan in order. Finish each step completely, including its edge cases, before starting the next. Do not stub anything with the intention of returning to it.

## What we are building

**${template.title}** — ${template.tagline.toLowerCase()}. ${template.description}

${template.longDescription}

- Category: ${category}
- Positioning: ${s.positioning}
- Audience: ${s.audience}
- Stack: ${techList(template)}, strict TypeScript, no backend — all data is local and typed.

## Design direction

${s.designDirection}

**Visual language**

${bullets(s.visualLanguage)}

**Layout**

${bullets(s.layout)}

## Design system

### Colour

${colourSystem(template)}

### Typography

${typographySection(template)}

### Spacing and radius

${s.spacing}

Radius: ${s.radius}

## Files you will create

\`\`\`
${s.fileTree.join("\n")}
\`\`\`

## Implementation order

${numbered(steps)}

## Components

${bullets(s.components)}

## Interactions

${bullets(s.interactions)}

## Animations

${bullets(s.motion)}

All motion is disabled under \`prefers-reduced-motion: reduce\`.

## Responsive

${bullets(s.responsive)}

## Content rules

${bullets(s.content)}

## Technical requirements

${bullets(s.technical)}

${bullets(ENGINEERING_STANDARDS)}

## Do not

${bullets(s.doNot)}

${bullets(s.constraints)}

## Verification before you report back

- [ ] Every route in the plan renders and is linked from the navigation.
- [ ] Every interaction listed works; no control is inert.
- [ ] Loading, empty and error states exist for each collection surface.
- [ ] Open each page at 390px and confirm nothing overflows horizontally.
- [ ] Tab through each page from the top: everything reachable, focus always visible.
- [ ] With reduced motion enabled, no entrance or looping animation plays.
- [ ] \`lint\` and \`build\` both pass with zero errors and zero warnings.

Then summarise what you built and which open decisions you made.`;
}

/* --------------------------------- Codex --------------------------------- */

function codexPrompt(template: Template): string {
  const s = template.spec;
  const category = categoryMap.get(template.category)?.name ?? template.category;

  const requirements: { title: string; body: string }[] = [
    {
      title: "Stack and data",
      body: `${techList(template)} with strict TypeScript. No backend, no database, no authentication, no third-party data source. All records are local typed modules containing realistic content.`,
    },
    {
      title: "Design direction",
      body: `${s.designDirection}\n\nVisual language:\n\n${bullets(s.visualLanguage)}`,
    },
    {
      title: "Layout",
      body: bullets(s.layout),
    },
    {
      title: "Routes",
      body: `Implement exactly these routes, each reachable from the primary navigation and each complete:\n\n${routeLines(template)}`,
    },
    {
      title: "Components",
      body: `Implement the following as reusable, typed components:\n\n${bullets(s.components)}`,
    },
    {
      title: "Colour system",
      body: colourSystem(template),
    },
    {
      title: "Typography",
      body: typographySection(template),
    },
    {
      title: "Spacing and radius",
      body: `${s.spacing}\n\nRadius: ${s.radius}\n\nPrefer borders to shadows; two shadow levels maximum across the build.`,
    },
    {
      title: "Responsive behaviour",
      body: `Verified layouts at 390px, 768px, 1024px, 1280px and 1440px. Mobile is designed, not derived.\n\n${bullets(s.responsive)}`,
    },
    {
      title: "Interactions",
      body: bullets(s.interactions),
    },
    {
      title: "Animation",
      body: `${bullets(s.motion)}\n\nAll of the above are disabled entirely under \`prefers-reduced-motion: reduce\`, rendering the end state immediately.`,
    },
    {
      title: "Content",
      body: bullets(s.content),
    },
    {
      title: "Accessibility",
      body: `WCAG 2.2 AA. Contrast of at least 4.5:1 for body text and 3:1 for large text and interface boundaries. Colour is never the sole carrier of meaning. Dialogs trap focus, close on Escape and restore focus. Async changes are announced through live regions. Full keyboard operability in a sensible tab order.`,
    },
    {
      title: "Technical",
      body: `${bullets(s.technical)}\n\n${bullets(ENGINEERING_STANDARDS)}`,
    },
    {
      title: "Constraints",
      body: `The following are hard constraints, not preferences:\n\n${bullets(s.constraints)}`,
    },
    {
      title: "Prohibited",
      body: bullets(s.doNot),
    },
  ];

  return `# TASK

Build **${template.title}** — ${template.tagline.toLowerCase()} — as a complete front-end project.

## SUMMARY

${template.description}

${template.longDescription}

- Category: ${category}
- Positioning: ${s.positioning}
- Audience: ${s.audience}

## REQUIREMENTS

${requirements.map((r, i) => `### R${i + 1} — ${r.title}\n\n${r.body}`).join("\n\n")}

## FILE LAYOUT

\`\`\`
${s.fileTree.join("\n")}
\`\`\`

## IMPLEMENTATION ORDER

${numbered(IMPLEMENTATION_RULES)}

## ACCEPTANCE CRITERIA

- [ ] Install and dev commands run the project with no manual configuration.
- [ ] Every route in R4 renders, is linked from the navigation, and is complete.
- [ ] Every component in R5 exists as a reusable typed component.
- [ ] Colour, type, spacing and radius match R6 to R8 exactly; no raw values in components.
- [ ] Every interaction in R10 is implemented; there are no inert controls.
- [ ] Loading, empty and error states exist for every list, grid or table.
- [ ] Layouts verified at 390px, 768px, 1024px, 1280px and 1440px with no horizontal page scroll.
- [ ] Keyboard-only walkthrough of every route succeeds with a visible focus indicator at each stop.
- [ ] With \`prefers-reduced-motion: reduce\`, no entrance or looping animation plays.
- [ ] Type-check passes under strict mode with zero errors.
- [ ] Lint passes with zero errors and zero warnings.
- [ ] Nothing under R16 appears in the build.
- [ ] README documents the structure and how to change the content.

## VERIFICATION

Before reporting completion, run the type-checker, the linter and the production build, and open every route at 390px and 1440px. Report which acceptance criteria are met and flag any assumption you had to make.`;
}

const builders: Record<AgentId, (t: Template) => string> = {
  "claude-code": claudeCodePrompt,
  cursor: cursorPrompt,
  codex: codexPrompt,
};

/** Compile the prompt for a template + agent pair. */
export function buildPrompt(template: Template, agent: AgentId): string {
  return builders[agent](template);
}

export function promptFilename(template: Template, agent: AgentId): string {
  return `${template.slug}-${agent}.txt`;
}

/**
 * Rough size figures for the viewer. Token count is an estimate — roughly four
 * characters per token for English prose — and is labelled as such in the UI.
 */
export function promptStats(prompt: string) {
  return {
    characters: prompt.length,
    words: prompt.trim().split(/\s+/).length,
    lines: prompt.split("\n").length,
    tokens: Math.round(prompt.length / 4),
  };
}
