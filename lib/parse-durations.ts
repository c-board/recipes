export type DurationMatch = {
  start: number;
  end: number;
  label: string;
  ms: number;
};

const DASH = String.raw`[\u2013\u2014-]`;

const DURATION_PATTERN = new RegExp(
  String.raw`(\d+(?:\.\d+)?)\s*(?:${DASH}\s*(\d+(?:\.\d+)?)\s*)?(minutes?|mins?|hours?|hrs?|seconds?|secs?)`,
  "gi",
);

function unitToMs(amount: number, unit: string): number {
  const normalized = unit.toLowerCase();
  if (normalized.startsWith("hour") || normalized.startsWith("hr")) {
    return amount * 60 * 60 * 1000;
  }
  if (normalized.startsWith("sec")) {
    return amount * 1000;
  }
  return amount * 60 * 1000;
}

function formatLabel(amount: number, unit: string): string {
  const normalized = unit.toLowerCase();
  if (normalized.startsWith("hour") || normalized.startsWith("hr")) {
    return amount === 1 ? "1 hr" : `${amount} hr`;
  }
  if (normalized.startsWith("sec")) {
    return amount === 1 ? "1 sec" : `${amount} sec`;
  }
  return amount === 1 ? "1 min" : `${amount} min`;
}

function formatRangeLabel(
  lower: number,
  upper: number,
  unit: string,
): string {
  const normalized = unit.toLowerCase();
  if (normalized.startsWith("hour") || normalized.startsWith("hr")) {
    return `${lower}–${upper} hr`;
  }
  if (normalized.startsWith("sec")) {
    return `${lower}–${upper} sec`;
  }
  return `${lower}–${upper} min`;
}

export function parseDurations(text: string): DurationMatch[] {
  const matches: DurationMatch[] = [];

  for (const match of text.matchAll(DURATION_PATTERN)) {
    const full = match[0];
    const start = match.index ?? 0;
    const end = start + full.length;
    const lowerRaw = match[1];
    const upperRaw = match[2];
    const unit = match[3];

    if (!lowerRaw || !unit) {
      continue;
    }

    const lower = Number.parseFloat(lowerRaw);
    if (!Number.isFinite(lower) || lower <= 0) {
      continue;
    }

    if (upperRaw) {
      const upper = Number.parseFloat(upperRaw);
      if (!Number.isFinite(upper) || upper <= 0) {
        continue;
      }
      matches.push({
        start,
        end,
        label: formatRangeLabel(lower, upper, unit),
        ms: unitToMs(Math.min(lower, upper), unit),
      });
      continue;
    }

    matches.push({
      start,
      end,
      label: formatLabel(lower, unit),
      ms: unitToMs(lower, unit),
    });
  }

  return matches;
}

export function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
