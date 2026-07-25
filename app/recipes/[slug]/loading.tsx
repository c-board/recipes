import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <Skeleton className="h-8 w-28" />

      <header className="flex flex-col gap-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="aspect-video w-full rounded-xl" />
      </header>

      <Separator />

      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-4 h-6 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </main>
  );
}
