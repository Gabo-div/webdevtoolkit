import { file } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";
import { icons } from "@lucide/astro";

const pages = new Set(
  Object.keys(import.meta.glob("src/pages/tools/*.astro")).map((path) => {
    const parts = path.split("/");
    const filename = parts[parts.length - 1].replace(/\.astro$/, "");
    return filename;
  }),
);

const categories = defineCollection({
  loader: file("src/content/categories.json"),
  schema: z.object({
    slug: z.string(),
    icon: z.string().refine((i) => !!icons[i as keyof typeof icons]),
  }),
});

const tools = defineCollection({
  loader: file("src/content/tools.json"),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    slug: z.string().refine((s) => {
      return pages.has(s);
    }),
    categories: reference("categories").array(),
  }),
});

export const collections = { categories, tools };
