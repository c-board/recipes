"use client";

import { TimerIcon } from "lucide-react";
import { useTimer } from "@/components/timer-provider";
import { cn } from "@/lib/utils";

type TimerChipProps = {
  label: string;
  ms: number;
};

export const TimerChip = ({ label, ms }: TimerChipProps) => {
  const { requestStart, activeTimer } = useTimer();
  const isActive = activeTimer?.label === label;

  return (
    <button
      type="button"
      onClick={() => requestStart(label, ms)}
      className={cn(
        "mx-0.5 inline-flex translate-y-px items-center gap-1 rounded-md border px-1.5 py-0.5 text-sm font-medium align-baseline transition-colors",
        "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive && "border-primary/50 bg-primary/20",
      )}
      aria-label={`Start ${label} timer`}
    >
      <TimerIcon className="size-3.5" aria-hidden />
      {label}
    </button>
  );
};
