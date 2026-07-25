"use client";

import Link from "next/link";
import React, { useState } from "react";
import type { Recipe } from "@/lib/recipes";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type RecipeSearchProps = {
  recipes: Recipe[];
};

export const RecipeSearch = ({ recipes }: RecipeSearchProps) => {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();

  const filtered = trimmedQuery
    ? recipes.filter((recipe) => {
        return (
          recipe.title.toLowerCase().includes(trimmedQuery) ||
          recipe.content.toLowerCase().includes(trimmedQuery)
        );
      })
    : recipes;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        {trimmedQuery
          ? `${filtered.length} of ${recipes.length} recipes`
          : `${recipes.length} recipes`}
      </p>

      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search recipes and ingredients..."
        aria-label="Search recipes"
      />

      {filtered.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <li key={recipe.slug}>
              <Link href={`/recipes/${recipe.slug}`} className="block">
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <CardTitle>{recipe.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground">
              No recipes match &ldquo;{query.trim()}&rdquo;
            </CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
