import { APP_CONFIG } from "../config/app";
import { JOURNEY_START, TARGET, chileDateTime } from "./time";

const locale = "es";

export interface DateLabel {
  weekday: string;
  dayMonth: string;
  month: string;
  year: string;
  /** Day number of the journey, 1 on the start date. */
  journeyDay: number;
}

export function describeDay(dayKey: string): DateLabel {
  const date = chileDateTime(dayKey).setLocale(locale);
  const journeyDay = Math.round(date.startOf("day").diff(JOURNEY_START.startOf("day"), "days").days) + 1;
  return {
    weekday: date.toFormat("cccc"),
    dayMonth: date.toFormat("d 'de' LLLL"),
    month: date.toFormat("LLLL"),
    year: date.toFormat("yyyy"),
    journeyDay: Math.max(0, journeyDay)
  };
}

/** "31 diciembre 2027" */
export function targetLabel(): string {
  return TARGET.setLocale(locale).toFormat("d LLLL yyyy");
}

/** "26·09·26" compact editorial date. */
export function compactDate(iso: string): string {
  return chileDateTime(iso).toFormat("dd'·'LL'·'yy");
}

export const JOURNEY_START_COMPACT = compactDate(APP_CONFIG.journeyStartDate);
export const TARGET_COMPACT = compactDate(APP_CONFIG.targetDate);
