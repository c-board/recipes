"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import type { Recipe } from "@/lib/recipes";

type RecipeSearchProps = {
  recipes: Recipe[];
};

export const RecipeSearch = ({ recipes }: RecipeSearchProps) => {
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
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        {trimmedQuery
          ? `${filtered.length} of ${recipes.length} recipes`
          : `${recipes.length} recipes`}
      </p>
      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search recipes and ingredients..."
          aria-label="Search recipes"
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
        />
      </div>

      {filtered.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <li key={recipe.slug}>
              <Link
                href={`/recipes/${recipe.slug}`}
                className="block rounded-lg border border-zinc-200 px-5 py-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                <span className="font-medium">{recipe.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-zinc-300 px-5 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No recipes match &ldquo;{query.trim()}&rdquo;
        </p>
      )}
    </div>
  );
};
