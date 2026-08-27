import { useEffect, useState } from "react";
import { useAudio } from "./AudioManager.jsx";

const STEP_DURATION_MS = 800;

// Fixed, non-translated countdown sequence — per spec this must render
// identically in English and Hindi (3 -> 2 -> 1 -> GO), never localized.
const STEPS = ["3", "2", "1", "GO!"];

/**
 * Full-screen animated countdown: 3 → 2 → 1 → GO. Every step (including
 * "GO") is intentionally hardcoded and NOT run through the i18n layer —
 * the same countdown must appear whether English or Hindi was selected.
 * Plays a beep on every step and calls onFinish once GO has been shown.
 */
export default function Countdown({ onFinish }) {
  const [stepIndex, setStepIndex] = useState(0);
  const { playEffect } = useAudio();

  useEffect(() => {
    playEffect("countdown");
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          clearInterval(interval);
          setTimeout(onFinish, STEP_DURATION_MS);
          return prev;
        }
        playEffect("countdown");
        return next;
      });
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="countdown-screen">
      <div className="rain-layer rain-layer-back" />
      <div className="rain-layer rain-layer-front" />
      <div key={stepIndex} className={`countdown-number ${stepIndex === 3 ? "countdown-go" : ""}`}>
        {STEPS[stepIndex]}
      </div>
    </div>
  );
}
