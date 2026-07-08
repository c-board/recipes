import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { getAllRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "All Recipes",
};

export default async function AllRecipesPage() {
  const recipes = await getAllRecipes();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">All Recipes</h1>
      </header>
      <div className="space-y-12">
        {recipes.map((recipe) => (
          <section key={recipe.slug} id={recipe.slug} className="scroll-mt-8">
            <h2 className="mb-4 border-b border-zinc-200 pb-2 text-2xl font-semibold tracking-tight dark:border-zinc-800">
              {recipe.title}
            </h2>
            <article className="recipe-prose">
              <ReactMarkdown>{recipe.content}</ReactMarkdown>
            </article>
          </section>
        ))}
      </div>
    </div>
  );
}
