"use client";

import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
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
      <DialogTrigger render={<Button variant="outline" />}>
        View photo
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-4xl"
        aria-describedby={undefined}
      >
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
