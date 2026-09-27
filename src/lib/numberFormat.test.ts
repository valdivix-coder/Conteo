import { describe, expect, it } from "vitest";
import { formatApproximate, formatPair, formatPairGroups, formatPercent, roundSignificant, toPairGroups } from "./numberFormat";

describe("formatPair", () => {
  it.each([
    [0, "00"],
    [1, "01"],
    [9, "09"],
    [10, "10"],
    [12, "12"],
    [99, "99"]
  ])("%i → %s", (input, expected) => {
    expect(formatPair(input)).toBe(expected);
  });

  it("never renders negative or invalid values", () => {
    expect(formatPair(-5)).toBe("00");
    expect(formatPair(Number.NaN)).toBe("00");
    expect(formatPair(4.9)).toBe("04");
  });
});

describe("formatPairGroups", () => {
  it.each([
    [0, "00"],
    [7, "07"],
    [99, "99"],
    [100, "01·00"],
    [461, "04·61"],
    [11064, "01·10·64"],
    [663840, "66·38·40"],
    [39830400, "39·83·04·00"]
  ])("%i → %s", (input, expected) => {
    expect(formatPairGroups(input)).toBe(expected);
  });

  it("exposes the groups for rendering", () => {
    expect(toPairGroups(11064)).toEqual(["01", "10", "64"]);
  });
});

describe("formatApproximate", () => {
  it("rounds to two significant digits by default", () => {
    expect(formatApproximate(15.631947)).toEqual({ value: 16, digits: "16", display: "≈ 16" });
    expect(formatApproximate(221_280).display).toBe("≈ 22·00·00");
    expect(formatApproximate(448.7).display).toBe("≈ 04·50");
    expect(formatApproximate(5.24).display).toBe("≈ 05");
  });

  it("can keep the whole integer", () => {
    expect(formatApproximate(461, { significantDigits: null }).display).toBe("≈ 04·61");
  });

  it("handles zero", () => {
    expect(formatApproximate(0).display).toBe("≈ 00");
    expect(roundSignificant(0)).toBe(0);
  });
});

describe("formatPercent", () => {
  it("uses two digits below 100", () => {
    expect(formatPercent(0)).toEqual({ whole: "00", decimals: "00" });
    expect(formatPercent(0.0712)).toEqual({ whole: "07", decimals: "12" });
    expect(formatPercent(0.38)).toEqual({ whole: "38", decimals: "00" });
    expect(formatPercent(0.99999)).toEqual({ whole: "99", decimals: "99" });
    expect(formatPercent(1).whole).toBe("100");
    expect(formatPercent(3).whole).toBe("100");
  });
});
