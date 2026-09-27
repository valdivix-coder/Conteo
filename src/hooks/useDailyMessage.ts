import { useMemo } from "react";
import { messageForDay } from "../lib/messages";

export function useDailyMessage(dayKey: string): string {
  return useMemo(() => messageForDay(dayKey), [dayKey]);
}
