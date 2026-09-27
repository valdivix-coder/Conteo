import { useEffect, useMemo, useState } from "react";
import { dayContext, hasCelebrated, markCelebrated, type DayContext } from "../lib/milestones";
import { calendarDaysLeft } from "../lib/time";

export interface MilestoneState extends DayContext {
  /** True only the first time this device sees today's milestone. */
  shouldCelebrate: boolean;
}

export function useMilestones(dayKey: string, finished: boolean): MilestoneState {
  const context = useMemo(
    () => dayContext(dayKey, calendarDaysLeft(dayKey), finished),
    [dayKey, finished]
  );
  const [celebrate, setCelebrate] = useState<number | null>(null);

  useEffect(() => {
    const { milestone } = context;
    if (milestone === null || hasCelebrated(milestone)) return;
    markCelebrated(milestone);
    setCelebrate(milestone);
  }, [context]);

  return { ...context, shouldCelebrate: celebrate !== null && celebrate === context.milestone };
}
