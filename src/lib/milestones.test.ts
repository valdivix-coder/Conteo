import { describe, expect, it } from "vitest";
import { dayContext, milestoneFor, phaseFor } from "./milestones";
import { calendarDaysLeft } from "./time";

describe("milestones", () => {
  it.each([365, 300, 250, 200, 150, 100, 75, 50, 30, 14, 7, 3, 2, 1])("detects %i days", (d) => {
    expect(milestoneFor(d)).toBe(d);
  });

  it("ignores other values", () => {
    expect(milestoneFor(364)).toBeNull();
    expect(milestoneFor(0)).toBeNull();
  });

  it("detects the 100-day milestone on the right Chilean date", () => {
    // 31 Dec 2027 minus 100 days = 22 Sep 2027.
    expect(calendarDaysLeft("2027-09-22")).toBe(100);
    expect(dayContext("2027-09-22", 100, false).milestone).toBe(100);
  });

  it("maps phases and banners", () => {
    expect(phaseFor(40, false)).toBe("journey");
    expect(phaseFor(30, false)).toBe("energy");
    expect(phaseFor(14, false)).toBe("two-weeks");
    expect(phaseFor(7, false)).toBe("last-week");
    expect(phaseFor(1, false)).toBe("final-day");
    expect(phaseFor(0, true)).toBe("free");
    expect(dayContext("2027-12-24", 7, false).banner).toBe("Última semana en Babylon.");
    expect(dayContext("2027-11-01", 60, false).banner).toBe("Otro mes menos en Babylon.");
    expect(dayContext("2027-11-02", 59, false).banner).toBeNull();
  });
});
