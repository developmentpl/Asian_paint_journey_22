import { useEffect, useRef, useState } from "react";
import { DEFAULT_STEP_DURATION } from "../data/scenarioActions.js";

/**
 * ScenarioController — plays a scenario's list of visual-action
 * steps one at a time (real time, not simultaneously), reporting the
 * active step key up to the parent (so <MotorcycleRider> can react) and
 * rendering the step's caption as an on-screen subtitle.
 *
 * This is pure sequencing/orchestration: it owns no game state itself
 * (score, correctness, etc.) — Game.jsx decides *which* step list to run
 * (correct-path vs wrong-path, per scenario) and what happens when the
 * whole sequence finishes (onComplete).
 *
 * Game states this sits between: 'animation' is active while this
 * component is running; it calls onComplete() once the last step's
 * duration has elapsed, which is what moves the game on to 'feedback'.
 */
export default function ScenarioController({ steps, running, onStepChange, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const timeoutRef = useRef(null);
  const onStepChangeRef = useRef(onStepChange);
  const onCompleteRef = useRef(onComplete);
  onStepChangeRef.current = onStepChange;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!running || !steps || steps.length === 0) {
      return undefined;
    }

    setStepIndex(0);
    let index = 0;

    function playStep() {
      const step = steps[index];
      onStepChangeRef.current?.(step.key, step.caption);
      setStepIndex(index);

      const duration = step.duration ?? DEFAULT_STEP_DURATION;
      timeoutRef.current = setTimeout(() => {
        index += 1;
        if (index >= steps.length) {
          onStepChangeRef.current?.(null, null);
          onCompleteRef.current?.();
        } else {
          playStep();
        }
      }, duration);
    }

    playStep();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, steps]);

  if (!running || !steps || steps.length === 0) return null;

  const current = steps[stepIndex];

  return (
    <div className="action-caption-bar" role="status" aria-live="polite">
      <span className="action-caption-dot" />
      <span className="action-caption-text">{current?.caption}</span>
    </div>
  );
}
