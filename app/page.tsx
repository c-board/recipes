import Link from "next/link";
import { RecipeSearch } from "@/components/RecipeSearch";
import { getAllRecipes } from "@/lib/recipes";

export default async function Home() {
  const recipes = await getAllRecipes();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-2 flex items-baseline justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Recipes</h1>
        <Link
          href="/all"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          View all on one page
        </Link>
      </header>
      <RecipeSearch recipes={recipes} />
    </div>
  );
}
