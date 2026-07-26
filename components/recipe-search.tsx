"use client";

import Link from "next/link";
import React, { useState } from "react";
import type { Recipe } from "@/lib/recipes";
import { RecipeImage } from "@/components/recipe-image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PLACEHOLDER_IMAGE = "/assets/recipe-placeholder.svg";

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

      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search recipes and ingredients..."
        aria-label="Search recipes"
      />

      {filtered.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => {
            const imageSrc = recipe.image ?? PLACEHOLDER_IMAGE;
            const imageAlt = recipe.image
              ? `Photo of ${recipe.title}`
              : `No photo for ${recipe.title}`;

            return (
              <li key={recipe.slug}>
                <Link href={`/recipes/${recipe.slug}`} className="block">
                  <Card className="transition-colors hover:bg-muted/50">
                    <RecipeImage
                      src={imageSrc}
                      alt={imageAlt}
                      className="aspect-video w-full"
                      imageClassName="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <CardHeader>
                      <CardTitle>{recipe.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            );
          })}
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
