export const APP_CONFIG = {
  appName: "Escape de Babylon",
  personName: "Belén",
  timeZone: "America/Santiago",
  locale: "es-CL",
  /** Local wall-clock time in `timeZone`. */
  targetDate: "2027-12-31T00:00:00",
  /** Local wall-clock time in `timeZone`. Progress is measured from here. */
  journeyStartDate: "2026-09-26T00:00:00",
  /** Remaining calendar days that trigger a milestone moment. */
  milestoneDays: [365, 300, 250, 200, 150, 100, 75, 50, 30, 14, 7, 3, 2, 1],
  storageKey: "escape-de-babylon:celebrated-milestones"
} as const;

/** Reference values for the recreational equivalences. */
export const CONVERSION_REFERENCES = {
  synodicMonthDays: 29.53059,
  mercuryYearDays: 87.969,
  marsSolSeconds: 88_775,
  heartbeatsPerMinute: 70,
  songMinutes: 3,
  dogYearsPerHumanYear: 7,
  gregorianYearDays: 365.2425,
  /** Family units, in minutes. */
  matiNapMinutes: 120,
  venegasEpisodeMinutes: 30,
  isiJokeMinutes: 5,
  simonShowerMinutes: 20,
  juCookieMinutes: 45
} as const;
