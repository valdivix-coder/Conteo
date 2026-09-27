import { afterEach, describe, expect, it } from "vitest";
import { DateTime, Settings } from "luxon";
import {
  TARGET,
  calendarDaysLeft,
  chileDateTime,
  chileDayKey,
  computeCountdown,
  computeTotals,
  countCalendarDays,
  journeyProgress,
  JOURNEY_START
} from "./time";

const chile = (iso: string) => chileDateTime(iso).toMillis();
const originalTZ = process.env.TZ;
const originalZone = Settings.defaultZone;

afterEach(() => {
  process.env.TZ = originalTZ;
  Settings.defaultZone = originalZone;
});

describe("timezone independence", () => {
  const deviceZones = ["America/Santiago", "America/New_York", "Europe/Madrid", "Asia/Tokyo"];

  it.each(deviceZones)("target is the same Chilean instant on a device set to %s", (tz) => {
    process.env.TZ = tz;
    Settings.defaultZone = tz;
    const target = chileDateTime("2027-12-31T00:00:00");
    // Chile is on summer time (UTC−3) in December.
    expect(target.toUTC().toISO()).toBe("2027-12-31T03:00:00.000Z");
    expect(target.toMillis()).toBe(TARGET.toMillis());
  });

  it.each(deviceZones)("countdown and day key do not depend on device zone %s", (tz) => {
    process.env.TZ = tz;
    Settings.defaultZone = tz;
    const now = Date.UTC(2026, 8, 28, 2, 30, 0); // 27 Sep 23:30 in Chile
    expect(chileDayKey(now)).toBe("2026-09-27");
    expect(computeCountdown(now)).toEqual(computeCountdown(chile("2026-09-27T23:30:00")));
  });
});

describe("countdown", () => {
  it("leaves exactly one second at 2027-12-30 23:59:59", () => {
    const c = computeCountdown(chile("2027-12-30T23:59:59"));
    expect(c).toMatchObject({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 1, finished: false });
  });

  it("is zero at the target instant", () => {
    const c = computeCountdown(TARGET.toMillis());
    expect(c).toMatchObject({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, finished: true });
  });

  it("never goes negative after the target", () => {
    for (const later of [1, 1000, 86_400_000, 400 * 86_400_000]) {
      const c = computeCountdown(TARGET.toMillis() + later);
      expect(c).toMatchObject({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, finished: true });
      const t = computeTotals(TARGET.toMillis() + later);
      expect(Object.values(t).every((v) => v === 0)).toBe(true);
    }
  });

  it("rounds sub-second remainders up so zero only appears at the target", () => {
    const c = computeCountdown(TARGET.toMillis() - 400);
    expect(c.seconds).toBe(1);
    expect(c.finished).toBe(false);
  });

  it("uses real calendar months, not 30-day approximations", () => {
    // 27 Sep 2026 00:00 → 31 Dec 2027 00:00 = 15 months and 4 days.
    const c = computeCountdown(chile("2026-09-27T00:00:00"));
    expect(c).toMatchObject({ months: 15, days: 4, hours: 0, minutes: 0, seconds: 0 });
  });

  it("breaks down a mid-day instant", () => {
    const c = computeCountdown(chile("2026-09-26T15:55:51"));
    expect(c).toMatchObject({ months: 15, days: 4, hours: 8, minutes: 4, seconds: 9 });
  });

  it("recomputes from the absolute instant (no drift between calls)", () => {
    const base = chile("2027-06-01T10:00:00");
    const later = computeCountdown(base + 3_600_000 * 5 + 1000);
    expect(later).toMatchObject({ hours: 8, minutes: 59, seconds: 59 });
  });
});

describe("totals", () => {
  it("counts days, hours, minutes and seconds from the journey start", () => {
    const t = computeTotals(chile("2026-09-26T00:00:00"));
    // 26 Sep 2026 → 31 Dec 2027 = 461 calendar days.
    expect(t.totalDays).toBe(461);
    expect(t.weeks).toBe(65);
    expect(t.weekRemainderDays).toBe(6);
    // Two DST changes in between (April −1 h, September +1 h) cancel out.
    expect(t.totalHours).toBe(461 * 24);
    expect(t.totalMinutes).toBe(461 * 24 * 60);
    expect(t.totalSeconds).toBe(461 * 24 * 3600);
  });
});

/** Finds a Chilean DST transition in a year by scanning offsets — never hardcoded. */
function findTransition(year: number, direction: "forward" | "back"): DateTime {
  let day = DateTime.fromObject({ year, month: 1, day: 1 }, { zone: "America/Santiago" });
  while (day.year === year) {
    const next = day.plus({ days: 1 });
    const delta = next.offset - day.offset;
    if ((direction === "forward" && delta > 0) || (direction === "back" && delta < 0)) return day;
    day = next;
  }
  throw new Error(`No ${direction} transition found in ${year}`);
}

describe("DST (resolved by Luxon, not hardcoded)", () => {
  it.each(["forward", "back"] as const)("handles the %s transition of 2027", (direction) => {
    const before = findTransition(2027, direction).set({ hour: 12 });
    const after = before.plus({ days: 1 });
    const realHours = (after.toMillis() - before.toMillis()) / 3_600_000;
    expect(realHours).toBe(direction === "forward" ? 23 : 25);

    // One calendar day later is one calendar day, even if it lasts 23 or 25 hours.
    const c = computeCountdown(before.toMillis(), after);
    expect(c).toMatchObject({ months: 0, days: 1, hours: 0, minutes: 0, seconds: 0 });
    expect(c.totalSeconds).toBe(realHours * 3600);
  });

  it("keeps the day key correct around midnight of a transition day", () => {
    const day = findTransition(2027, "forward").plus({ days: 1 }).startOf("day");
    expect(chileDayKey(day.toMillis())).toBe(day.toISODate());
    expect(chileDayKey(day.toMillis() - 1)).toBe(day.minus({ days: 1 }).toISODate());
  });
});

describe("calendar counts", () => {
  it("counts days left from the Chilean date", () => {
    expect(calendarDaysLeft("2027-12-30")).toBe(1);
    expect(calendarDaysLeft("2027-12-31")).toBe(0);
    expect(calendarDaysLeft("2028-02-01")).toBe(0);
    expect(calendarDaysLeft("2026-09-26")).toBe(461);
  });

  it("counts Mondays and weekends until the target", () => {
    // Wed 22 Dec 2027: Monday 27 Dec and the 25–26 Dec weekend are left.
    expect(countCalendarDays("2027-12-22")).toEqual({ mondays: 1, weekends: 1, days: 9 });
    // Mon 27 Dec 2027: today counts as a remaining Monday; no weekend left.
    expect(countCalendarDays("2027-12-27")).toEqual({ mondays: 1, weekends: 0, days: 4 });
    // Sun 26 Dec 2027: the weekend in progress still counts.
    expect(countCalendarDays("2027-12-26")).toEqual({ mondays: 1, weekends: 1, days: 5 });
    expect(countCalendarDays("2027-12-31")).toEqual({ mondays: 0, weekends: 0, days: 0 });
  });

  it("counts every Monday of the full journey", () => {
    // Sat 26 Sep 2026 → Thu 30 Dec 2027: first Monday 28 Sep 2026, last 27 Dec 2027.
    const { mondays, weekends } = countCalendarDays("2026-09-26");
    expect(mondays).toBe(66);
    expect(weekends).toBe(66);
  });
});

describe("journey start", () => {
  it("starts on Monday 28 September 2026 at 08:00 in Chile", () => {
    expect(JOURNEY_START.toISO()).toBe("2026-09-28T08:00:00.000-03:00");
    expect(JOURNEY_START.weekday).toBe(1);
  });

  it("leaves 15 months, 2 days and 16 hours at the start", () => {
    expect(computeCountdown(JOURNEY_START.toMillis())).toMatchObject({ months: 15, days: 2, hours: 16, minutes: 0, seconds: 0 });
  });

  it("keeps progress at zero before the start", () => {
    expect(journeyProgress(chile("2026-09-27T12:00:00"))).toBe(0);
    expect(journeyProgress(JOURNEY_START.toMillis() + 3_600_000)).toBeGreaterThan(0);
  });
});

describe("journey progress", () => {
  it("goes from 0 to 1 and clamps outside the journey", () => {
    expect(journeyProgress(JOURNEY_START.toMillis() - 1000)).toBe(0);
    expect(journeyProgress(JOURNEY_START.toMillis())).toBe(0);
    expect(journeyProgress(TARGET.toMillis())).toBe(1);
    expect(journeyProgress(TARGET.toMillis() + 1e9)).toBe(1);
    const mid = (JOURNEY_START.toMillis() + TARGET.toMillis()) / 2;
    expect(journeyProgress(mid)).toBeCloseTo(0.5, 10);
  });
});
