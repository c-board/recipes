import type { Metadata } from "next";
import { AllRecipes } from "@/components/AllRecipes";
import { getAllRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "All Recipes",
  robots: { index: false, follow: false },
};

export default async function AllRecipesPage() {
  const recipes = await getAllRecipes();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">All Recipes</h1>
      </header>
      <AllRecipes recipes={recipes} />
    </div>
  );
}
