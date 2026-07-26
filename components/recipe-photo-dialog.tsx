"use client";

import { XIcon } from "lucide-react";
import React from "react";
import { RecipeImage } from "@/components/recipe-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
        showCloseButton={false}
        className="h-[100dvh] w-[100vw] max-w-[100vw] gap-0 rounded-none border-0 bg-black p-0 ring-0 sm:max-w-[100vw]"
        aria-describedby={undefined}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{imageAlt}</DialogTitle>
        </DialogHeader>

        <div className="relative flex h-[100dvh] w-full items-center justify-center">
          <DialogClose
            render={
              <button
                type="button"
                className="absolute inset-0"
                aria-label="Close photo"
              />
            }
          />

          <div className="pointer-events-none relative z-10 h-full w-full">
            <RecipeImage
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full bg-black"
              imageClassName="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-20 size-11 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white"
                aria-label="Close photo"
              />
            }
          >
            <XIcon className="size-5" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
