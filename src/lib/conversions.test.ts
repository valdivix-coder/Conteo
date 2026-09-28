import { describe, expect, it } from "vitest";
import { UNIT_SECONDS, computeConversions } from "./conversions";
import { liveDecimals, splitFixed } from "./numberFormat";
import { chileDateTime, computeTotals, countCalendarDays } from "./time";

const FULL_JOURNEY_START = chileDateTime("2026-09-26T00:00:00").toMillis();

const FULL_JOURNEY_SECONDS = 461 * 86_400;
const calendar = { mondays: 66, weekends: 66, days: 461 };

describe("conversions", () => {
  const c = computeConversions(FULL_JOURNEY_SECONDS, calendar);

  it("passes calendar counts through", () => {
    expect(c.mondays).toBe(66);
    expect(c.weekends).toBe(66);
    expect(c.sunrises).toBe(461);
  });

  it("computes moons with the synodic month", () => {
    expect(c.moons).toBeCloseTo(461 / 29.53059, 10);
    expect(Math.round(c.moons)).toBe(16);
  });

  it("computes Mercury years and Martian sols", () => {
    expect(c.mercuryYears).toBeCloseTo(461 / 87.969, 10);
    expect(c.marsSols).toBeCloseTo(FULL_JOURNEY_SECONDS / 88_775, 10);
    expect(Math.floor(c.marsSols)).toBe(448);
  });

  it("computes dog years, heartbeats and songs", () => {
    expect(c.dogYears).toBeCloseTo((461 / 365.2425) * 7, 10);
    expect(c.heartbeats).toBe(461 * 1440 * 70);
    expect(c.songs).toBe((461 * 1440) / 3);
  });

  it("computes the family units from their durations", () => {
    const minutes = 461 * 1440;
    expect(c.matiNaps).toBe(minutes / 120);
    expect(c.venegasEpisodes).toBe(minutes / 30);
    expect(c.isiJokes).toBe(minutes / 5);
    expect(c.simonShowers).toBe(minutes / 20);
    expect(c.juCookies).toBeCloseTo(minutes / 45, 10);
  });

  it("keeps the fraction of the unit in progress", () => {
    const partial = computeConversions(90 * 60, { mondays: 0, weekends: 0, days: 0 });
    expect(partial.matiNaps).toBeCloseTo(0.75, 10);
    expect(partial.juCookies).toBeCloseTo(2, 10);
  });

  it("changes every second for every continuous unit", () => {
    const now = computeConversions(FULL_JOURNEY_SECONDS, calendar);
    const next = computeConversions(FULL_JOURNEY_SECONDS - 1, calendar);
    for (const id of Object.keys(UNIT_SECONDS) as (keyof typeof UNIT_SECONDS)[]) {
      const decimals = liveDecimals(UNIT_SECONDS[id]);
      const a = splitFixed(now[id], decimals);
      const b = splitFixed(next[id], decimals);
      // Over a few seconds the visible digits must move (the last digit ticks ~1/s).
      const later = splitFixed(computeConversions(FULL_JOURNEY_SECONDS - 3, calendar)[id], decimals);
      expect(`${later.integer},${later.fraction}`).not.toBe(`${a.integer},${a.fraction}`);
      expect(`${b.integer},${b.fraction}` <= `${a.integer},${a.fraction}` || b.integer < a.integer).toBe(true);
    }
  });

  it("is zero, never negative, when time is up", () => {
    const zero = computeConversions(-50, { mondays: 0, weekends: 0, days: 0 });
    expect(Object.values(zero).every((v) => v === 0)).toBe(true);
  });

  it("agrees with the time engine for the whole journey", () => {
    const totals = computeTotals(FULL_JOURNEY_START);
    const fromEngine = computeConversions(totals.totalSeconds, countCalendarDays("2026-09-26"));
    expect(fromEngine).toEqual(c);
  });

  it("derives weeks without cumulative rounding", () => {
    const totals = computeTotals(FULL_JOURNEY_START);
    expect(totals.weeks * 7 + totals.weekRemainderDays).toBe(totals.totalDays);
  });
});
