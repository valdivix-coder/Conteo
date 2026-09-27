import { Atmosphere } from "./components/Atmosphere";
import { CountdownHero } from "./components/CountdownHero";
import { CurrentDate } from "./components/CurrentDate";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FinalState } from "./components/FinalState";
import { FunConversions } from "./components/FunConversions";
import { JourneyProgress } from "./components/JourneyProgress";
import { MilestoneMoment } from "./components/MilestoneMoment";
import { TimeExplorer } from "./components/TimeExplorer";
import { useChileDayKey, useIsFinished } from "./hooks/useChileTime";
import { useDailyMessage } from "./hooks/useDailyMessage";
import { useMilestones } from "./hooks/useMilestones";

/**
 * App re-renders only when the Chilean date changes or the countdown ends.
 * Per-second and per-minute updates live inside the components that need them.
 */
export function App() {
  const dayKey = useChileDayKey();
  const finished = useIsFinished();
  const moment = useMilestones(dayKey, finished);
  const message = useDailyMessage(dayKey);

  return (
    <>
      <ErrorBoundary>
        <Atmosphere phase={moment.phase} />
      </ErrorBoundary>

      <div className="page">
        <CurrentDate dayKey={dayKey} finished={finished} />

        <main>
          {finished ? <FinalState /> : <CountdownHero banner={moment.banner} message={message} messageKey={dayKey} />}

          {moment.milestone !== null && (
            <ErrorBoundary>
              <MilestoneMoment milestone={moment.milestone} celebrate={moment.shouldCelebrate} />
            </ErrorBoundary>
          )}

          <ErrorBoundary>
            <JourneyProgress />
          </ErrorBoundary>

          {!finished && (
            <>
              <ErrorBoundary>
                <TimeExplorer />
              </ErrorBoundary>
              <ErrorBoundary>
                <FunConversions dayKey={dayKey} />
              </ErrorBoundary>
            </>
          )}
        </main>

        <footer className="footer">
          <p className="footer__line">
            Babylon tiene fecha de término.
            <br />
            <span className="footer__accent">Y cada segundo falta menos.</span>
          </p>
          <p className="footer__meta">Hora de Chile continental</p>
        </footer>
      </div>
    </>
  );
}
