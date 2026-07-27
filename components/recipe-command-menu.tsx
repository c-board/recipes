"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Recipe } from "@/lib/recipes";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

type RecipeCommandMenuProps = {
  recipes: Recipe[];
};

function subscribe() {
  return () => {};
}

function getModKey() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "⌘" : "Ctrl";
}

function getServerModKey() {
  return "Ctrl";
}

export const RecipeCommandMenu = ({ recipes }: RecipeCommandMenuProps) => {
  const [open, setOpen] = useState(false);
  const modKey = useSyncExternalStore(subscribe, getModKey, getServerModKey);
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
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="fixed right-4 bottom-4 z-40 shadow-sm"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <KbdGroup>
          <Kbd>{modKey}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

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
              <CommandItem
                value="home all recipes"
                onSelect={() => navigate("/")}
              >
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
    </>
  );
};
