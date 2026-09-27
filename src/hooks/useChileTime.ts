import { useSyncExternalStore } from "react";
import { getNowMinute, getNowMs, getNowSecond, subscribe } from "../lib/clock";
import { JOURNEY_START, chileDayKey, remainingSeconds } from "../lib/time";

let cachedSecond = Number.NaN;
let cachedDayKey = "";

function getDayKey(): string {
  const second = getNowSecond();
  if (second !== cachedSecond) {
    cachedSecond = second;
    cachedDayKey = chileDayKey(getNowMs());
  }
  return cachedDayKey;
}

function getFinished(): boolean {
  return remainingSeconds(getNowMs()) === 0;
}

function getStarted(): boolean {
  return getNowMs() >= JOURNEY_START.toMillis();
}

/** True once the journey has started. Re-renders the caller once. */
export function useHasStarted(): boolean {
  return useSyncExternalStore(subscribe, getStarted, getStarted);
}

/** Epoch second. Re-renders the caller once per second. */
export function useNowSecond(): number {
  return useSyncExternalStore(subscribe, getNowSecond, getNowSecond);
}

/** Epoch minute. Re-renders the caller once per minute. */
export function useNowMinute(): number {
  return useSyncExternalStore(subscribe, getNowMinute, getNowMinute);
}

/** Chilean calendar date (yyyy-MM-dd). Re-renders the caller once per day. */
export function useChileDayKey(): string {
  return useSyncExternalStore(subscribe, getDayKey, getDayKey);
}

/** True from the exact target instant on. Re-renders the caller once. */
export function useIsFinished(): boolean {
  return useSyncExternalStore(subscribe, getFinished, getFinished);
}
