"use client";

import React from "react";
import { RecipeImage } from "@/components/recipe-image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type RecipePhotoDialogProps = {
  imageSrc: string;
  imageAlt: string;
};

export const RecipePhotoDialog = ({
  imageSrc,
  imageAlt,
}: RecipePhotoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="group w-full overflow-hidden rounded-xl ring-1 ring-foreground/10 transition-[opacity,box-shadow] hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={`View larger ${imageAlt}`}
          />
        }
      >
        <RecipeImage
          src={imageSrc}
          alt={imageAlt}
          className="aspect-video w-full"
          imageClassName="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </DialogTrigger>
      <DialogContent
        className="w-[100vw] max-w-[100vw] gap-0 rounded-none border-0 bg-black p-0 ring-0 sm:w-full sm:max-w-4xl sm:gap-4 sm:rounded-xl sm:bg-popover sm:p-4 sm:ring-1 sm:ring-foreground/10"
        aria-describedby={undefined}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{imageAlt}</DialogTitle>
        </DialogHeader>
        <RecipeImage
          src={imageSrc}
          alt={imageAlt}
          className="h-[85dvh] w-full bg-black sm:h-auto sm:max-h-[80vh] sm:aspect-video sm:rounded-lg sm:bg-muted"
          imageClassName="object-contain"
          sizes="100vw"
          priority
        />
      </DialogContent>
    </Dialog>
  );
};
