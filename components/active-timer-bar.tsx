"use client";

import { XIcon } from "lucide-react";
import { useTimer } from "@/components/timer-provider";
import { Button } from "@/components/ui/button";
import { formatRemaining } from "@/lib/parse-durations";
import { cn } from "@/lib/utils";

export const ActiveTimerBar = () => {
  const { activeTimer, remainingMs, cancel } = useTimer();

  if (!activeTimer) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[60] border-t bg-background/95 backdrop-blur-sm",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{activeTimer.label}</p>
          <p className="font-heading text-2xl font-semibold tabular-nums tracking-tight">
            {formatRemaining(remainingMs)}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={cancel}
          aria-label="Cancel timer"
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
};
