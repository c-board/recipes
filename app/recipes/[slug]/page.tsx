import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { RecipePhotoDialog } from "@/components/recipe-photo-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllRecipes, getRecipeBySlug } from "@/lib/recipes";
import { cn } from "@/lib/utils";

type RecipePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return { title: "Recipe Not Found" };
  }

  return { title: recipe.title };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
      >
        ← All recipes
      </Link>

      <header className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {recipe.title}
        </h1>
        {recipe.image ? (
          <RecipePhotoDialog
            imageSrc={recipe.image}
            imageAlt={`Photo of ${recipe.title}`}
          />
        ) : null}
      </header>

      <Separator />

      <article
        className={cn(
          "text-base leading-relaxed",
          "[&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-semibold",
          "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold",
          "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold",
          "[&_p]:mb-4",
          "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_li]:mb-1",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
        )}
      >
        <ReactMarkdown>{recipe.content}</ReactMarkdown>
      </article>
    </main>
  );
}
