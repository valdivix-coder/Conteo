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

/** Length in seconds of one unit of each continuous equivalence. */
export const UNIT_SECONDS = {
  moons: REF.synodicMonthDays * SECONDS_PER_DAY,
  dogYears: (REF.gregorianYearDays * SECONDS_PER_DAY) / REF.dogYearsPerHumanYear,
  mercuryYears: REF.mercuryYearDays * SECONDS_PER_DAY,
  marsSols: REF.marsSolSeconds,
  heartbeats: SECONDS_PER_MINUTE / REF.heartbeatsPerMinute,
  songs: REF.songMinutes * SECONDS_PER_MINUTE,
  matiNaps: REF.matiNapMinutes * SECONDS_PER_MINUTE,
  venegasEpisodes: REF.venegasEpisodeMinutes * SECONDS_PER_MINUTE,
  isiJokes: REF.isiJokeMinutes * SECONDS_PER_MINUTE,
  simonShowers: REF.simonShowerMinutes * SECONDS_PER_MINUTE,
  juCookies: REF.juCookieMinutes * SECONDS_PER_MINUTE
} as const;

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
    heartbeats: minutes * REF.heartbeatsPerMinute,
    songs: minutes / REF.songMinutes,
    matiNaps: minutes / REF.matiNapMinutes,
    venegasEpisodes: minutes / REF.venegasEpisodeMinutes,
    isiJokes: minutes / REF.isiJokeMinutes,
    simonShowers: minutes / REF.simonShowerMinutes,
    juCookies: minutes / REF.juCookieMinutes
  };
}
