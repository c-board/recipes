import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RecipeCardSkeleton = () => {
  return (
    <Card>
      <Skeleton className="aspect-video w-full rounded-none rounded-t-xl" />
      <CardHeader>
        <Skeleton className="h-5 w-2/3" />
      </CardHeader>
    </Card>
  );
};
