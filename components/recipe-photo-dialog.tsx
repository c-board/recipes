"use client";

import Image from "next/image";
import React from "react";
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
            className="group w-full overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 transition-[opacity,box-shadow] hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={`View larger ${imageAlt}`}
          />
        }
      >
        <span className="relative block aspect-video w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{imageAlt}</DialogTitle>
        </DialogHeader>
        <div className="relative flex max-h-[70vh] items-center justify-center overflow-hidden rounded-lg bg-muted">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1600}
            height={1200}
            className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
