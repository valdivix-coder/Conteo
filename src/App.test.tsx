// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { chileDateTime } from "./lib/time";

async function renderAt(chileIso: string) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(chileDateTime(chileIso).toMillis());
  vi.resetModules();
  const { App } = await import("./App");
  return render(<App />);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("App", () => {
  it("renders the countdown with an accessible, minute-precision summary", async () => {
    await renderAt("2026-09-27T12:00:00");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Escapar de\s*Babylon/i);
    expect(screen.getByRole("timer").textContent).toContain("Faltan 15 meses, 3 días, 12 horas y 0 minutos");
    expect(screen.getByText("domingo")).toBeTruthy();
  });

  it("announces grouped numbers as whole numbers", async () => {
    await renderAt("2026-09-27T12:00:00");
    // Sunrises: 27 Sep → 30 Dec 2027 = 460 days, shown as 04·60.
    expect(screen.getByText("aproximadamente 460 amaneceres")).toBeTruthy();
  });

  it("shows a milestone on its day", async () => {
    await renderAt("2027-09-22T09:00:00");
    expect(screen.getByText("Hito alcanzado")).toBeTruthy();
    expect(screen.getByText("100 días")).toBeTruthy();
  });

  it("transforms into the final state at the target", async () => {
    await renderAt("2027-12-31T00:00:00");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Belén escapó de\s*Babylon/i);
    expect(screen.queryByRole("timer")).toBeNull();
  });
});
