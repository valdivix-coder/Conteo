import { describe, expect, it } from "vitest";
import { DAYLIGHT, contrast, dawnAmount, luminance, skyAt, type Rgb } from "./dawn";

const WHITE: Rgb = [247, 247, 242];
const INK: Rgb = [26, 18, 6];

describe("dawn", () => {
  it("brightens monotonically as the journey advances", () => {
    let previous = -1;
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const l = luminance(skyAt(p)[2]);
      expect(l).toBeGreaterThanOrEqual(previous);
      previous = l;
    }
  });

  it("changes noticeably: the horizon is ≥ 10× brighter by the last day", () => {
    expect(luminance(skyAt(1)[2]) / luminance(skyAt(0)[2])).toBeGreaterThan(10);
  });

  it("front-loads the change a little so early weeks are visible", () => {
    expect(dawnAmount(0.1)).toBeGreaterThan(0.1);
    expect(dawnAmount(1)).toBe(1);
  });

  it("keeps white text at WCAG AA on every sky before the end", () => {
    for (let p = 0; p <= 1.0001; p += 0.02) {
      for (const band of skyAt(p)) expect(contrast(WHITE, band)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("reaches full daylight at the end, readable with dark text", () => {
    for (const band of DAYLIGHT) {
      expect(luminance(band)).toBeGreaterThan(0.6);
      expect(contrast(INK, band)).toBeGreaterThanOrEqual(7);
    }
  });
});
