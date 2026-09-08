import type { MetadataRoute } from "next";
import { templates } from "@/data/templates";
import { categories } from "@/data/taxonomy";
import { collections } from "@/data/collections";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/templates", "/categories", "/collections", "/pricing", "/about", "/changelog", "/submit"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...templates.map((template) => ({
      url: `${site.url}/templates/${template.slug}`,
      lastModified: new Date(template.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${site.url}/categories/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...collections.map((collection) => ({
      url: `${site.url}/collections/${collection.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
