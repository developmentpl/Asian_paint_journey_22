import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import RoadEnvironment from "./RoadEnvironment.jsx";
import { DEFAULT_STEP_DURATION } from "../data/scenarioActions.js";

/**
 * Dedicated feedback screen. It always demonstrates the safe action,
 * regardless of whether the player's original choice was correct.
 */
export default function FeedbackModal({
  feedback,
  correctAnswerText,
  onContinue,
  isLastScenario,
  readyToContinue,
  scenario,
  sceneConfig,
  correctActions = [],
  geared,
  journeyProgress,
}) {
  const { t } = useLanguage();
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    setDemoIndex(0);
    if (correctActions.length < 2) return undefined;
    const step = correctActions[demoIndex];
    const timer = setTimeout(
      () => setDemoIndex((index) => (index + 1) % correctActions.length),
      Math.max(1100, step?.duration ?? DEFAULT_STEP_DURATION)
    );
    return () => clearTimeout(timer);
  }, [scenario?.id, correctActions, demoIndex]);

  if (!feedback) return null;
  const { isCorrect, pointsAwarded, explanation } = feedback;
  const demonstration = correctActions[demoIndex] || correctActions[0];

  return (
    <div className="feedback-overlay">
      <section className={`feedback-screen ${isCorrect ? "feedback-card-correct" : "feedback-card-wrong"}`} aria-labelledby="feedback-heading">
        <header className="feedback-screen-header">
          <div className={`feedback-icon ${isCorrect ? "feedback-icon-correct" : "feedback-icon-wrong"}`}>{isCorrect ? "✓" : "✕"}</div>
          <div>
            <p className="feedback-scenario-label">{t.scenario.label(scenario.id)}</p>
            <h2 id="feedback-heading" className={isCorrect ? "feedback-heading-correct" : "feedback-heading-wrong"}>
              {isCorrect ? t.feedback.safeDecision : t.feedback.unsafeDecision}
            </h2>
          </div>
          {isCorrect && <p className="feedback-points">+{pointsAwarded}</p>}
        </header>

        <div className="feedback-demo-stage" aria-label={demonstration?.caption}>
          <RoadEnvironment
            sceneConfig={sceneConfig}
            activeAction={demonstration?.key || null}
            geared={geared}
            scenarioId={scenario.id}
            journeyProgress={Math.min(3, journeyProgress)}
          />
          <div className="feedback-demo-badge">
            <span className="action-caption-dot" />
            <strong>{demonstration?.caption}</strong>
          </div>
        </div>

        <div className="feedback-answer-block">
          <span>{t.feedback.correctAnswerLabel}</span>
          <strong>{correctAnswerText}</strong>
        </div>
        <p className="feedback-explanation">{explanation}</p>

        <button
          type="button"
          className={`btn btn-primary feedback-continue-btn ${readyToContinue ? "feedback-continue-visible" : ""}`}
          onClick={onContinue}
          disabled={!readyToContinue}
        >
          {isLastScenario ? t.feedback.finishJourney : t.feedback.continueJourney}
          <span aria-hidden="true"> →</span>
        </button>
      </section>
    </div>
  );
}
