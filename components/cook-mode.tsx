"use client";

import {
  ChefHatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { textWithTimerChips } from "@/components/timer-text";
import { useTimer } from "@/components/timer-provider";
import { Button } from "@/components/ui/button";
import { parseRecipeSections } from "@/lib/parse-recipe";
import { cn } from "@/lib/utils";

type CookModeProps = {
  title: string;
  content: string;
};

export const CookMode = ({ title, content }: CookModeProps) => {
  const { ingredients, steps } = parseRecipeSections(content);
  const { activeTimer } = useTimer();
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<number, boolean>
  >({});
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const touchStartX = useRef<number | null>(null);

  const stepCount = steps.length;
  const canCook = stepCount > 0;
  const currentStep = steps[stepIndex] ?? "";
  const isFirst = stepIndex <= 0;
  const isLast = stepIndex >= stepCount - 1;

  const releaseWakeLock = useCallback(async () => {
    const lock = wakeLockRef.current;
    wakeLockRef.current = null;
    if (!lock) {
      return;
    }
    try {
      await lock.release();
    } catch {
      // Already released
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      return;
    }
    try {
      await releaseWakeLock();
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      wakeLockRef.current.addEventListener("release", () => {
        if (wakeLockRef.current?.released) {
          wakeLockRef.current = null;
        }
      });
    } catch {
      // Permission denied or unsupported
    }
  }, [releaseWakeLock]);

  const openCookMode = useCallback(() => {
    setStepIndex(0);
    setShowIngredients(false);
    setOpen(true);
  }, []);

  const closeCookMode = useCallback(() => {
    setOpen(false);
    setShowIngredients(false);
    void releaseWakeLock();
  }, [releaseWakeLock]);

  const goNext = useCallback(() => {
    setStepIndex((current) => Math.min(current + 1, stepCount - 1));
  }, [stepCount]);

  const goPrev = useCallback(() => {
    setStepIndex((current) => Math.max(current - 1, 0));
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    void requestWakeLock();

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        void requestWakeLock();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void releaseWakeLock();
    };
  }, [open, releaseWakeLock, requestWakeLock]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeCookMode();
        return;
      }

      if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "BUTTON" ||
            target.tagName === "INPUT" ||
            target.isContentEditable)
        ) {
          if (event.key === " " || event.key === "Enter") {
            return;
          }
        }
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [closeCookMode, goNext, goPrev, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function toggleIngredient(index: number) {
    setCheckedIngredients((current) => ({
      ...current,
      [index]: !current[index],
    }));
  }

  if (!canCook) {
    return null;
  }

  return (
    <>
      <Button type="button" onClick={openCookMode} className="w-fit">
        <ChefHatIcon />
        Cook mode
      </Button>

      {open ? (
        <div
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-background",
            "pt-[max(0.75rem,env(safe-area-inset-top))]",
            "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          )}
          role="dialog"
          aria-modal="true"
          aria-label={`Cook mode: ${title}`}
        >
          <header className="flex items-center gap-2 border-b px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={closeCookMode}
              aria-label="Exit cook mode"
            >
              <XIcon />
            </Button>

            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-lg font-semibold tracking-tight">
                {title}
              </p>
              <p className="text-sm text-muted-foreground">
                Step {stepIndex + 1} of {stepCount}
              </p>
            </div>

            {ingredients.length > 0 ? (
              <Button
                type="button"
                variant={showIngredients ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowIngredients((value) => !value)}
                aria-pressed={showIngredients}
              >
                <ListIcon />
                Ingredients
              </Button>
            ) : null}
          </header>

          <div className="mx-4 mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{
                width: `${((stepIndex + 1) / stepCount) * 100}%`,
              }}
            />
          </div>

          {showIngredients ? (
            <div className="border-b px-4 py-4">
              <ul className="mx-auto flex max-h-[40vh] max-w-3xl flex-col gap-2 overflow-y-auto">
                {ingredients.map((ingredient, index) => {
                  const checked = Boolean(checkedIngredients[index]);
                  return (
                    <li key={`${ingredient}-${index}`}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/60">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleIngredient(index)}
                          className="mt-1 size-4 accent-primary"
                        />
                        <span
                          className={cn(
                            "text-base leading-snug",
                            checked && "text-muted-foreground line-through",
                          )}
                        >
                          {ingredient}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div
            className={cn(
              "relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-8",
              activeTimer ? "pb-52" : "pb-28",
            )}
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const startX = touchStartX.current;
              const endX = event.changedTouches[0]?.clientX;
              touchStartX.current = null;
              if (startX == null || endX == null) {
                return;
              }
              const delta = endX - startX;
              if (Math.abs(delta) < 50) {
                return;
              }
              if (delta < 0) {
                goNext();
              } else {
                goPrev();
              }
            }}
          >
            <p className="font-heading text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl md:text-4xl">
              {textWithTimerChips(currentStep)}
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Swipe or use arrow keys · tap a time to start a timer
            </p>
          </div>

          <footer
            className={cn(
              "fixed inset-x-0 z-[55] border-t bg-background/95 backdrop-blur-sm",
              activeTimer ? "bottom-20 sm:bottom-24" : "bottom-0",
            )}
          >
            <div
              className={cn(
                "mx-auto flex w-full max-w-3xl gap-3 px-4 pt-3",
                "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
              )}
            >
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 flex-1"
                onClick={goPrev}
                disabled={isFirst}
              >
                <ChevronLeftIcon />
                Previous
              </Button>
              <Button
                type="button"
                size="lg"
                className="h-12 flex-1"
                onClick={isLast ? closeCookMode : goNext}
              >
                {isLast ? (
                  "Done"
                ) : (
                  <>
                    Next
                    <ChevronRightIcon />
                  </>
                )}
              </Button>
            </div>
          </footer>
        </div>
      ) : null}
    </>
  );
};
