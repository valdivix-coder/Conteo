import { afterEach, describe, expect, it } from "vitest";
import { DateTime, Settings } from "luxon";
import { CLOSINGS, IMAGES, OPENINGS, combinationCount, messageForDay } from "./messages";
import { chileDayKey, chileDateTime } from "./time";

const originalTZ = process.env.TZ;
afterEach(() => {
  process.env.TZ = originalTZ;
  Settings.defaultZone = "system";
});

function journeyDays(): string[] {
  const days: string[] = [];
  let d = DateTime.fromISO("2026-09-26", { zone: "utc" });
  const end = DateTime.fromISO("2027-12-31", { zone: "utc" });
  while (d <= end) {
    days.push(d.toISODate() ?? "");
    d = d.plus({ days: 1 });
  }
  return days;
}

describe("daily message", () => {
  it("is stable for the same Chilean date (reloads)", () => {
    expect(messageForDay("2026-09-27")).toBe(messageForDay("2026-09-27"));
  });

  it("changes every day of the journey", () => {
    const days = journeyDays();
    for (let i = 1; i < days.length; i += 1) {
      expect(messageForDay(days[i]!)).not.toBe(messageForDay(days[i - 1]!));
    }
  });

  it("never repeats a message within four months", () => {
    const lastSeen = new Map<string, number>();
    journeyDays().forEach((day, index) => {
      const msg = messageForDay(day);
      const previous = lastSeen.get(msg);
      if (previous !== undefined) expect(index - previous).toBeGreaterThanOrEqual(120);
      lastSeen.set(msg, index);
    });
    expect(lastSeen.size).toBeGreaterThan(380);
  });

  it("offers more than 1000 natural combinations", () => {
    expect(combinationCount()).toBeGreaterThan(1000);
  });

  it("follows the Chilean date, not the device timezone", () => {
    const instant = chileDateTime("2026-09-27T23:30:00").toMillis();
    const expected = messageForDay("2026-09-27");
    for (const tz of ["America/New_York", "Europe/Madrid", "Asia/Tokyo"]) {
      process.env.TZ = tz;
      Settings.defaultZone = tz;
      expect(messageForDay(chileDayKey(instant))).toBe(expected);
    }
  });

  it("changes exactly at Chilean midnight", () => {
    const midnight = chileDateTime("2026-09-28T00:00:00").toMillis();
    expect(messageForDay(chileDayKey(midnight - 1))).toBe(messageForDay("2026-09-27"));
    expect(messageForDay(chileDayKey(midnight))).toBe(messageForDay("2026-09-28"));
  });

  it("only mentions Mondays on days where it makes sense", () => {
    for (const day of journeyDays()) {
      const weekday = DateTime.fromISO(day, { zone: "utc" }).weekday;
      const msg = messageForDay(day);
      if (msg.includes("Otro lunes quedó atrás")) expect(weekday).toBe(2);
      if (msg.includes("este lunes será")) expect(weekday).toBe(1);
    }
  });

  it("writes every fragment as a complete sentence", () => {
    for (const f of [...OPENINGS, ...IMAGES, ...CLOSINGS]) {
      expect(f.text).toMatch(/^[A-ZÁÉÍÓÚÑ¿¡]/);
      expect(f.text).toMatch(/[.!?]$/);
    }
  });
});

describe("direct address", () => {
  const SECOND_PERSON = /Belén|(?<!\p{L})(tú|tu|tus|te|ti|tuyo|tuya|contigo|respira|imagina|sonríe|aguanta|di)(?!\p{L})/iu;

  it("always talks to Belén, by name or in second person", () => {
    let day = DateTime.fromISO("2026-09-26", { zone: "utc" });
    while (day.toISODate()! <= "2027-12-31") {
      expect(messageForDay(day.toISODate()!)).toMatch(SECOND_PERSON);
      day = day.plus({ days: 1 });
    }
  });
});
