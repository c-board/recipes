"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type RecipeImageProps = {
  src: string;
  alt: string;
  sizes: string;
  loading?: "eager" | "lazy";
  className?: string;
  imageClassName?: string;
};

export const RecipeImage = ({
  src,
  alt,
  sizes,
  loading = "lazy",
  className,
  imageClassName,
}: RecipeImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded ? <Skeleton className="absolute inset-0 z-10 rounded-none" /> : null}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={loading}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
      />
    </div>
  );
};
