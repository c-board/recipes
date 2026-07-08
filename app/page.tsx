import { RecipeSearch } from "@/components/RecipeSearch";
import { getAllRecipes } from "@/lib/recipes";

export default async function Home() {
  const recipes = await getAllRecipes();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-2">
        <h1 className="text-4xl font-semibold tracking-tight">Recipes</h1>
      </header>
      <RecipeSearch recipes={recipes} />
    </div>
  );
}
