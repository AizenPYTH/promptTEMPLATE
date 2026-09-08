import type { AgentId, Template } from "@/types/template";
import { categoryMap, styleMap, technologyMap } from "@/data/taxonomy";

/**
 * Prompt compiler.
 *
 * Every template carries a structured brief (`template.spec`). Rather than
 * storing three near-identical walls of text per template, we compile the
 * brief into an agent-specific prompt. Each agent gets the same substance in
 * the shape it works best with:
 *
 *   claude-code — a single narrative brief with a definition of done
 *   cursor      — an ordered, file-by-file implementation plan
 *   codex       — numbered requirements with explicit acceptance criteria
 */

const bullet = (items: readonly string[]) => items.map((i) => `- ${i}`).join("\n");
const numbered = (items: readonly string[], start = 1) =>
  items.map((item, i) => `${i + start}. ${item}`).join("\n");

function techList(template: Template) {
  return template.technologies.map((t) => technologyMap.get(t)?.name ?? t).join(", ");
}

function routes(template: Template) {
  return template.spec.pages.map((p) => `- \`${p.route}\` — ${p.purpose}`).join("\n");
}

function designSystem(template: Template) {
  const { palette, typography, spacing, radius } = template.spec;
  return `Colour tokens (define these once as CSS custom properties, never hard-code a hex in a component):

  --background      ${palette.background}
  --surface         ${palette.surface}
  --border          ${palette.border}
  --text            ${palette.text}
  --text-muted      ${palette.muted}
  --accent          ${palette.accent}
  --accent-contrast ${palette.accentContrast}

Typography:
- Display: ${typography.display}
- Body: ${typography.body}
- Mono: ${typography.mono}
- Type scale: ${typography.scale}

Spacing: ${spacing}
Radius: ${radius}
Elevation: use borders before shadows; at most two shadow levels in the whole build.`;
}

function sharedContext(template: Template) {
  const category = categoryMap.get(template.category)?.name ?? template.category;
  const style = styleMap.get(template.style)?.name ?? template.style;
  return `Product: ${template.title} — ${template.tagline}
Category: ${category}
Visual direction: ${style}
Positioning: ${template.spec.positioning}
Primary audience: ${template.spec.audience}

${template.longDescription}`;
}

const universalQuality = [
  "TypeScript in strict mode. No `any`, no unchecked non-null assertions.",
  "No placeholder copy. Every string is real, specific and written for this product.",
  "All data is local and typed — one module per entity, imported by the UI, never inlined in a component.",
  "Semantic HTML first. Landmarks, headings in order, labelled controls, alt text that says something.",
  "Every interactive element is keyboard reachable with a visible focus ring.",
  "Honour `prefers-reduced-motion`: entrance and looping animation must be disabled entirely.",
  "No console errors or warnings. No unused imports. The lint and type-check commands must both pass clean.",
];

function claudeCodePrompt(template: Template): string {
  const s = template.spec;
  return `You are a senior front-end engineer and product designer. You write production code, not demos: real components, real content, real states. You care about typography, spacing rhythm and keyboard access as much as you care about the build passing.

# Objective

Build the ${template.title} website — ${template.tagline.toLowerCase()} — as a complete, runnable front-end project.

${sharedContext(template)}

# Stack

${techList(template)}. Strict TypeScript. No backend, no database, no authentication: every record is local mock data, typed and centralised.

# Routes

${routes(template)}

# Components to build

${bullet(s.components)}

# Design system

${designSystem(template)}

# Responsive behaviour

Design at 390px first, then verify 768px, 1024px, 1280px and 1440px. This is not a scaled-down desktop layout — navigation, filters, tables and any editing surface each need a deliberate mobile design. Nothing may scroll horizontally except containers that are explicitly meant to.

# Motion

${bullet(s.motion)}

Motion is functional: it explains a change of state. Nothing loops without a reason, nothing animates longer than 300ms unless it is a deliberate page-level transition.

# Interactions

${bullet(s.interactions)}

# Content

${bullet(s.content)}

# Accessibility

- Colour contrast of at least 4.5:1 for body text and 3:1 for large text and UI boundaries.
- Colour is never the only carrier of meaning — pair it with a glyph, a label or a pattern.
- Dialogs trap focus, close on Escape and return focus to the element that opened them.
- Live regions announce asynchronous changes such as filter counts and form errors.
- The whole interface is operable with a keyboard alone, in a sensible tab order.

# Constraints

${bullet(s.constraints)}

# Suggested file structure

\`\`\`
${s.fileTree.join("\n")}
\`\`\`

# Engineering quality bar

${bullet(universalQuality)}

# Definition of done

1. The project installs and runs with a single command, with no manual setup steps.
2. Every route listed above exists and is reachable from the navigation.
3. Every interaction listed above works — no dead buttons, no placeholder handlers.
4. Loading, empty and error states exist for anything that renders a collection.
5. The build and the linter both pass with zero errors and zero warnings.
6. A short README explains the structure and how to change the content.

Work through the whole build before reporting back. When a decision is not specified above, choose the option a careful designer would choose and note it in the README.`;
}

function cursorPrompt(template: Template): string {
  const s = template.spec;
  const steps = [
    `Scaffold the project with ${techList(template)} and strict TypeScript. Configure path aliases and the lint script before writing any UI.`,
    `Create the design tokens as CSS custom properties, then map them to utility classes. Nothing later in the build may hard-code a colour.`,
    `Define the data layer: types first, then one typed module per entity. Populate it with realistic records — this is the content the UI will render.`,
    `Build the layout shell: ${s.components[0]}, navigation, and the page container with its responsive gutters.`,
    `Build the shared primitives (buttons, fields, badges, dialog) so every later screen composes from the same parts.`,
    ...s.pages.map((p) => `Implement \`${p.route}\`: ${p.purpose}`),
    `Wire the interactions: ${s.interactions.join("; ")}.`,
    `Add loading, empty and error states for every collection surface.`,
    `Responsive pass at 390px, 768px, 1024px and 1440px. Fix each breakpoint deliberately rather than letting flexbox decide.`,
    `Accessibility pass: focus order, focus rings, labels, contrast, reduced motion.`,
    `Run the type-checker and linter, fix everything they report, then re-read your own diff for anything you would flag in review.`,
  ];

  return `# ${template.title} — implementation plan

You are working in this repository as a senior front-end engineer. Follow the plan in order. Complete each step fully — including its edge cases — before moving on. Do not stub anything you intend to come back to.

## What we are building

${sharedContext(template)}

## Design system (apply from step 2 onward)

${designSystem(template)}

## Step-by-step plan

${numbered(steps)}

## Files you will create

\`\`\`
${s.fileTree.join("\n")}
\`\`\`

## Components

${bullet(s.components)}

## Motion rules

${bullet(s.motion)}

## Content rules

${bullet(s.content)}

## Hard constraints

${bullet(s.constraints)}

## Non-negotiables

${bullet(universalQuality)}

## Before you finish

Re-run the build and the linter. Open every route. Tab through each page from the top and confirm you can reach and operate everything without a mouse. Resize to 390px and confirm nothing overflows. Only then summarise what you built and which decisions you made that the plan left open.`;
}

function codexPrompt(template: Template): string {
  const s = template.spec;
  const requirements = [
    `**Stack.** ${techList(template)}, strict TypeScript, no backend and no third-party data source. All records are local, typed modules.`,
    `**Routes.** Implement exactly these routes, each reachable from the primary navigation:\n${routes(template)}`,
    `**Components.** Implement the following as reusable, typed components:\n${bullet(s.components)}`,
    `**Design tokens.** Use these values and no others:\n\n${designSystem(template)}`,
    `**Responsive.** Verified layouts at 390px, 768px, 1024px, 1280px and 1440px. Mobile is designed, not derived.`,
    `**Motion.**\n${bullet(s.motion)}`,
    `**Interactions.**\n${bullet(s.interactions)}`,
    `**Content.**\n${bullet(s.content)}`,
    `**Accessibility.** WCAG 2.2 AA: contrast, focus management, keyboard operability, labelled controls, live regions for async changes, and full \`prefers-reduced-motion\` support.`,
    `**Constraints.**\n${bullet(s.constraints)}`,
  ];

  return `# Task: build ${template.title}

## Summary

${sharedContext(template)}

## Requirements

${requirements.map((r, i) => `### R${i + 1}\n\n${r}`).join("\n\n")}

## File layout

\`\`\`
${s.fileTree.join("\n")}
\`\`\`

## Acceptance criteria

- [ ] \`install\` then \`dev\` runs the project with no manual configuration.
- [ ] Every route in R2 renders and is linked from the navigation.
- [ ] Every interaction in R7 is implemented; there are no non-functional controls.
- [ ] Loading, empty and error states exist for every list, grid or table.
- [ ] Type-check passes with zero errors under strict mode.
- [ ] Lint passes with zero errors and zero warnings.
- [ ] Keyboard-only walkthrough of every route succeeds, with a visible focus ring at each stop.
- [ ] No layout overflow at 390px; no horizontal page scroll at any breakpoint.
- [ ] With \`prefers-reduced-motion: reduce\`, no entrance or looping animation plays.
- [ ] README documents the structure and how to edit the content.

## Engineering standards

${bullet(universalQuality)}

Report which requirements are complete and flag any assumption you had to make.`;
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
  return `${template.slug}-${agent}-prompt.txt`;
}
