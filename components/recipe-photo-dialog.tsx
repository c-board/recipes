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
      <DialogContent className="sm:max-w-4xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{imageAlt}</DialogTitle>
        </DialogHeader>
        <RecipeImage
          src={imageSrc}
          alt={imageAlt}
          className="aspect-video w-full rounded-lg"
          imageClassName="object-contain"
          sizes="100vw"
          priority
        />
      </DialogContent>
    </Dialog>
  );
};
