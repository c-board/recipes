"use client";

import ReactMarkdown from "react-markdown";
import React, { useMemo, useState } from "react";
import type { Recipe } from "@/lib/recipes";

type AllRecipesProps = {
  recipes: Recipe[];
};

export const AllRecipes = ({ recipes }: AllRecipesProps) => {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!trimmedQuery) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      return (
        recipe.title.toLowerCase().includes(trimmedQuery) ||
        recipe.content.toLowerCase().includes(trimmedQuery)
      );
    });
  }, [recipes, trimmedQuery]);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-zinc-200 bg-background/90 px-6 pb-4 pt-2 backdrop-blur dark:border-zinc-800">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search all recipes and ingredients..."
          aria-label="Search all recipes"
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
        />
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {trimmedQuery
            ? `${filtered.length} of ${recipes.length} recipes`
            : `${recipes.length} recipes`}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-12">
          {filtered.map((recipe) => (
            <section key={recipe.slug} id={recipe.slug} className="scroll-mt-28">
              <h2 className="mb-4 border-b border-zinc-200 pb-2 text-2xl font-semibold tracking-tight dark:border-zinc-800">
                {recipe.title}
              </h2>
              <article className="recipe-prose">
                <ReactMarkdown>{recipe.content}</ReactMarkdown>
              </article>
            </section>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-zinc-300 px-5 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No recipes match &ldquo;{query.trim()}&rdquo;
        </p>
      )}
    </div>
  );
};
