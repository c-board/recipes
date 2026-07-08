import { getAllRecipes } from "@/lib/recipes";

export const dynamic = "force-static";

export async function GET() {
  const recipes = await getAllRecipes();

  const body = [
    "# Recipes",
    "",
    "A personal recipe collection. Each section below is a complete recipe.",
    "",
    ...recipes.map((recipe) => {
      return [`# ${recipe.title}`, "", recipe.content.trim(), ""].join("\n");
    }),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
