import { RecipeSearch } from "@/components/recipe-search";
import { Separator } from "@/components/ui/separator";
import { getAllRecipes } from "@/lib/recipes";

export default async function Home() {
  const recipes = await getAllRecipes();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Recipes
        </h1>
        <p className="text-muted-foreground">Personal recipe collection</p>
      </header>
      <Separator />
      <RecipeSearch recipes={recipes} />
    </main>
  );
}
