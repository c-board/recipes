import { RecipeCardSkeleton } from "@/components/recipe-card-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-5 w-56" />
      </header>
      <Separator />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index}>
              <RecipeCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
