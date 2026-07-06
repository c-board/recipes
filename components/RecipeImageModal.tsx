"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type RecipeImageModalProps = {
  imageSrc: string;
  imageAlt: string;
};

export const RecipeImageButton = ({
  imageSrc,
  imageAlt,
}: RecipeImageModalProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
      >
        View photo
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={imageAlt}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/60 text-2xl leading-none text-white transition-colors hover:bg-black/80"
            aria-label="Close photo"
          >
            ×
          </button>

          <div
            className="relative flex max-h-[85vh] w-full max-w-4xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1600}
              height={1200}
              className="h-auto max-h-[85vh] w-auto max-w-full object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
