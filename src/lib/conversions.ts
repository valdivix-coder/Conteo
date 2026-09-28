import { CONVERSION_REFERENCES as REF } from "../config/app";
import type { CalendarCounts } from "./time";

const SECONDS_PER_DAY = 86_400;
const SECONDS_PER_MINUTE = 60;

export interface Conversions {
  mondays: number;
  weekends: number;
  sunrises: number;
  moons: number;
  dogYears: number;
  mercuryYears: number;
  marsSols: number;
  heartbeats: number;
  songs: number;
  matiNaps: number;
  venegasEpisodes: number;
  isiJokes: number;
  simonShowers: number;
  juCookies: number;
}

/** Whole heartbeats in a span of seconds, at the reference rate. */
export function heartbeatsIn(seconds: number): number {
  return Math.floor((Math.max(0, seconds) / SECONDS_PER_MINUTE) * REF.heartbeatsPerMinute);
}

/**
 * Whole units still ahead (complete units only, no decimals). Every value is
 * derived directly from the exact remaining seconds, never from another
 * rounded value, so a figure only changes when a whole unit elapses.
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
    moons: Math.floor(days / REF.synodicMonthDays),
    dogYears: Math.floor(years * REF.dogYearsPerHumanYear),
    mercuryYears: Math.floor(days / REF.mercuryYearDays),
    marsSols: Math.floor(seconds / REF.marsSolSeconds),
    heartbeats: heartbeatsIn(seconds),
    songs: Math.floor(minutes / REF.songMinutes),
    matiNaps: Math.floor(minutes / REF.matiNapMinutes),
    venegasEpisodes: Math.floor(minutes / REF.venegasEpisodeMinutes),
    isiJokes: Math.floor(minutes / REF.isiJokeMinutes),
    simonShowers: Math.floor(minutes / REF.simonShowerMinutes),
    juCookies: Math.floor(minutes / REF.juCookieMinutes)
  };
}
