import { access, readdir, readFile } from "fs/promises";
import { constants } from "fs";
import path from "path";

export type Recipe = {
  slug: string;
  title: string;
  content: string;
  image?: string;
};

const RECIPES_DIR = path.join(process.cwd(), "recipes");

async function getRecipeImage(slug: string): Promise<string | undefined> {
  const locations = [
    path.join(process.cwd(), "assets", `${slug}.png`),
    path.join(process.cwd(), "public", "assets", `${slug}.png`),
  ];

  for (const location of locations) {
    try {
      await access(location, constants.F_OK);
      return `/assets/${slug}.png`;
    } catch {
      continue;
    }
  }

  return undefined;
}

export function slugToTitle(slug: string): string {
  return slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getRecipeSlugs(): Promise<string[]> {
  const files = await readdir(RECIPES_DIR);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const slugs = await getRecipeSlugs();
  const recipes = await Promise.all(
    slugs.map(async (slug) => {
      const content = await readFile(
        path.join(RECIPES_DIR, `${slug}.md`),
        "utf-8",
      );
      const image = await getRecipeImage(slug);

      return {
        slug,
        title: slugToTitle(slug),
        content,
        image,
      };
    }),
  );

  return recipes.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const filePath = path.join(RECIPES_DIR, `${slug}.md`);

  try {
    const content = await readFile(filePath, "utf-8");
    const image = await getRecipeImage(slug);

    return {
      slug,
      title: slugToTitle(slug),
      content,
      image,
    };
  } catch {
    return null;
  }
}
