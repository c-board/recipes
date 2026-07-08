import type { MetadataRoute } from "next";
import { getAllRecipes } from "@/lib/recipes";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getAllRecipes();
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${siteUrl}/recipes/${recipe.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...recipeRoutes];
}
