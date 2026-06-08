/**
 * Local history accumulator.
 *
 * A static SPA with no backend has nowhere to keep a price history —
 * so this tracker builds its own over time, one snapshot per day,
 * stored in the visitor's localStorage. Open the tab today and it
 * starts the clock; come back tomorrow and you'll have two points;
 * a year on, a full year of trend.
 *
 * Window filters (7D / 1M / 3M / 6M / 1Y) simply slice whatever has
 * been accumulated so far — short windows fill in fast, longer ones
 * grow in as the tracker keeps running.
 */

import type { GoldSnapshot } from "./goldApi";

const STORAGE_KEY = "pulse.gold.history.v1";
const MAX_SNAPSHOTS = 400; // ~ a bit over a year of daily points

export function loadHistory(): GoldSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GoldSnapshot[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => a.at - b.at);
  } catch {
    return [];
  }
}

function saveHistory(snapshots: GoldSnapshot[]): void {
  try {
    const trimmed = snapshots.slice(-MAX_SNAPSHOTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail quietly,
    // the tracker still works, it just won't remember between visits.
  }
}

/**
 * Record a snapshot, keeping at most one per calendar date (the most
 * recent overwrites earlier ones from the same day so the series stays
 * a clean daily cadence even if the tab is open for hours).
 */
export function recordSnapshot(snapshot: GoldSnapshot): GoldSnapshot[] {
  const existing = loadHistory();
  const withoutToday = existing.filter((s) => s.date !== snapshot.date);
  const next = [...withoutToday, snapshot].sort((a, b) => a.at - b.at);
  saveHistory(next);
  return next;
}

export const WINDOWS = [
  { id: "7d", label: "7 Days", days: 7 },
  { id: "1m", label: "1 Month", days: 30 },
  { id: "3m", label: "3 Months", days: 90 },
  { id: "6m", label: "6 Months", days: 182 },
  { id: "1y", label: "1 Year", days: 365 },
] as const;

export type WindowId = (typeof WINDOWS)[number]["id"];

export function filterByWindow(history: GoldSnapshot[], windowId: WindowId): GoldSnapshot[] {
  const def = WINDOWS.find((w) => w.id === windowId) ?? WINDOWS[0];
  const cutoff = Date.now() - def.days * 24 * 60 * 60 * 1000;
  return history.filter((s) => s.at >= cutoff);
}
