"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Recipe } from "@/lib/recipes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type RecipeCommandMenuProps = {
  recipes: Recipe[];
};

export const RecipeCommandMenu = ({ recipes }: RecipeCommandMenuProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search recipes"
      description="Jump to a recipe by name or ingredient"
    >
      <Command>
        <CommandInput placeholder="Search recipes and ingredients..." />
        <CommandList>
          <CommandEmpty>No recipes found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem value="home all recipes" onSelect={() => navigate("/")}>
              All recipes
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Recipes">
            {recipes.map((recipe) => (
              <CommandItem
                key={recipe.slug}
                value={`${recipe.title} ${recipe.content}`}
                onSelect={() => navigate(`/recipes/${recipe.slug}`)}
              >
                {recipe.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
