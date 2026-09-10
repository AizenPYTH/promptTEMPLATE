import type { Collection } from "@/types/template";

/**
 * Editorial groupings, written by hand. Three of them, covering all ten
 * templates between them — a catalogue this size does not support eight
 * collections without padding them.
 */
export const collections: Collection[] = [
  {
    slug: "dark-interfaces",
    title: "Dark interfaces",
    subtitle: "Near-black canvases with exactly one accent",
    description:
      "Four products that live on a dark ground and survive daily use: controlled contrast, a single luminous accent, and surfaces that stay legible when the room lights come on. A launch page, a dashboard, an issue tracker and an automation canvas — four very different jobs, one discipline.",
    curator: "Nina Kovač",
    accent: "#7c6dff",
    archetype: "board",
    templateSlugs: ["nova-ai", "orbit-analytics", "cadence-project-management", "flux-automation"],
  },
  {
    slug: "editorial-and-image-led",
    title: "Editorial and image-led",
    subtitle: "Where the type and the pictures do the work",
    description:
      "Sites with almost no interface. A photographic portfolio browsed horizontally, a luxury house paced at one idea per screen, and a developer's site that is one column and a monospace spine. All three are harder than they look: with the chrome removed, nothing hides a weak decision.",
    curator: "Claire Dumont",
    accent: "#b4423f",
    archetype: "editorial",
    templateSlugs: ["studio-27-portfolio", "zenith-luxury-brand", "mono-developer-portfolio"],
  },
  {
    slug: "money-and-merchandise",
    title: "Money and merchandise",
    subtitle: "Interfaces that have to be trusted before they are liked",
    description:
      "A storefront for objects worth photographing properly, a finance platform whose numbers hold still while you read them, and a launch page built for the day the traffic is a spike rather than a trickle. Three places where a design mistake costs money directly.",
    curator: "Sofia Marchetti",
    accent: "#8a6d3b",
    archetype: "commerce",
    templateSlugs: ["arcadia-ecommerce", "finora-finance-saas", "launchpad-startup-landing"],
  },
];

export const collectionMap = new Map(collections.map((c) => [c.slug, c]));
