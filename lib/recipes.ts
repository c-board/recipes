import { readdir, readFile, stat } from "fs/promises";
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
      const fileStat = await stat(location);
      // Bust Next.js / browser caches when the file on disk is replaced
      return `/assets/${slug}.png?v=${Math.round(fileStat.mtimeMs)}`;
    } catch {
      continue;
    }
  }

  return undefined;
}

const SPECIAL_CASE_WORDS: Record<string, string> = {
  kfc: "KFC",
};

export function slugToTitle(slug: string): string {
  return slug
    .split("_")
    .map((word) => {
      const special = SPECIAL_CASE_WORDS[word.toLowerCase()];
      if (special) {
        return special;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
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
