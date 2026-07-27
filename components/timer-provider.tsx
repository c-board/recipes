"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActiveTimerBar } from "@/components/active-timer-bar";

type ActiveTimer = {
  label: string;
  endsAt: number;
};

type TimerContextValue = {
  activeTimer: ActiveTimer | null;
  remainingMs: number;
  requestStart: (label: string, ms: number) => void;
  cancel: () => void;
};

const TimerContext = createContext<TimerContextValue | null>(null);

function playBeep() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.08;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.6);
    oscillator.stop(context.currentTime + 0.6);
    oscillator.onended = () => {
      void context.close();
    };
  } catch {
    // Audio may be blocked; notification/vibrate still fire
  }
}

function vibrate() {
  try {
    navigator.vibrate?.([200, 100, 200]);
  } catch {
    // Ignore unsupported vibrate
  }
}

function showDoneNotification(label: string) {
  if (typeof Notification === "undefined") {
    return;
  }
  if (Notification.permission !== "granted") {
    return;
  }
  try {
    new Notification("Timer done", {
      body: label,
      silent: false,
    });
  } catch {
    // Some browsers require service worker for notifications
  }
}

export function useTimer(): TimerContextValue {
  const value = useContext(TimerContext);
  if (!value) {
    throw new Error("useTimer must be used within TimerProvider");
  }
  return value;
}

type TimerProviderProps = {
  children: React.ReactNode;
};

export const TimerProvider = ({ children }: TimerProviderProps) => {
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);

  const notifyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);
  const activeTimerRef = useRef<ActiveTimer | null>(null);

  useEffect(() => {
    activeTimerRef.current = activeTimer;
  }, [activeTimer]);

  const clearNotifyTimeout = useCallback(() => {
    if (notifyTimeoutRef.current !== null) {
      clearTimeout(notifyTimeoutRef.current);
      notifyTimeoutRef.current = null;
    }
  }, []);

  const finishTimer = useCallback(() => {
    if (completedRef.current) {
      return;
    }
    completedRef.current = true;

    const label = activeTimerRef.current?.label ?? "Timer";

    clearNotifyTimeout();
    setActiveTimer(null);
    setRemainingMs(0);

    vibrate();
    if (document.visibilityState === "visible") {
      playBeep();
    }
    showDoneNotification(label);
  }, [clearNotifyTimeout]);

  const armNotifyTimeout = useCallback(
    (endsAt: number) => {
      clearNotifyTimeout();
      const delay = Math.max(0, endsAt - Date.now());
      notifyTimeoutRef.current = setTimeout(() => {
        finishTimer();
      }, delay);
    },
    [clearNotifyTimeout, finishTimer],
  );

  const requestStart = useCallback(
    async (label: string, ms: number) => {
      completedRef.current = false;
      clearNotifyTimeout();

      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "default"
      ) {
        try {
          await Notification.requestPermission();
        } catch {
          // User dismissed or unsupported
        }
      }

      const endsAt = Date.now() + ms;
      setActiveTimer({ label, endsAt });
      setRemainingMs(ms);
      armNotifyTimeout(endsAt);
    },
    [armNotifyTimeout, clearNotifyTimeout],
  );

  const cancel = useCallback(() => {
    completedRef.current = true;
    clearNotifyTimeout();
    setActiveTimer(null);
    setRemainingMs(0);
  }, [clearNotifyTimeout]);

  useEffect(() => {
    if (!activeTimer) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      cancel();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTimer, cancel]);

  useEffect(() => {
    if (!activeTimer) {
      return;
    }

    function tick() {
      const timer = activeTimerRef.current;
      if (!timer) {
        return;
      }
      const remaining = timer.endsAt - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        finishTimer();
        return;
      }
      setRemainingMs(remaining);
    }

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [activeTimer, finishTimer]);

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState !== "visible") {
        return;
      }

      const timer = activeTimerRef.current;
      if (!timer) {
        return;
      }

      const remaining = timer.endsAt - Date.now();
      if (remaining <= 0) {
        finishTimer();
        return;
      }

      setRemainingMs(remaining);
      armNotifyTimeout(timer.endsAt);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onVisibilityChange);
    };
  }, [armNotifyTimeout, finishTimer]);

  useEffect(() => {
    return () => {
      clearNotifyTimeout();
    };
  }, [clearNotifyTimeout]);

  const value: TimerContextValue = {
    activeTimer,
    remainingMs,
    requestStart,
    cancel,
  };

  return (
    <TimerContext.Provider value={value}>
      <div className={activeTimer ? "pb-24" : undefined}>{children}</div>
      <ActiveTimerBar />
    </TimerContext.Provider>
  );
};
