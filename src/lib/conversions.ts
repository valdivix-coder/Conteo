import { CONVERSION_REFERENCES as REF } from "../config/app";
import type { CalendarCounts } from "./time";

const SECONDS_PER_DAY = 86_400;
const SECONDS_PER_MINUTE = 60;
const HEARTBEATS_UNIT = 1_000_000;

export interface Conversions {
  mondays: number;
  weekends: number;
  sunrises: number;
  moons: number;
  dogYears: number;
  mercuryYears: number;
  marsSols: number;
  /** Millions of heartbeats. */
  heartbeatsMillions: number;
  songs: number;
  matiNaps: number;
  venegasEpisodes: number;
  isiJokes: number;
  simonShowers: number;
  juCookies: number;
}

/**
 * Raw (unrounded) equivalences. Every value is derived directly from the
 * exact remaining seconds, never from another rounded value.
 */
export function computeConversions(totalSeconds: number, calendar: CalendarCounts): Conversions {
  const seconds = Math.max(0, totalSeconds);
  const days = seconds / SECONDS_PER_DAY;
  const minutes = seconds / SECONDS_PER_MINUTE;
  const years = days / REF.gregorianYearDays;

  return {
    mondays: calendar.mondays,
    weekends: calendar.weekends,
    sunrises: calendar.days,
    moons: days / REF.synodicMonthDays,
    dogYears: years * REF.dogYearsPerHumanYear,
    mercuryYears: days / REF.mercuryYearDays,
    marsSols: seconds / REF.marsSolSeconds,
    heartbeatsMillions: (minutes * REF.heartbeatsPerMinute) / HEARTBEATS_UNIT,
    songs: Math.floor(minutes / REF.songMinutes),
    matiNaps: Math.floor(minutes / REF.matiNapMinutes),
    venegasEpisodes: Math.floor(minutes / REF.venegasEpisodeMinutes),
    isiJokes: Math.floor(minutes / REF.isiJokeMinutes),
    simonShowers: Math.floor(minutes / REF.simonShowerMinutes),
    juCookies: Math.floor(minutes / REF.juCookieMinutes)
  };
}
