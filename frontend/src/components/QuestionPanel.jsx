import { useEffect, useState } from "react";
import AnswerOptions from "./AnswerOptions.jsx";
import { shuffleIndices } from "../utils/shuffle.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

/**
 * QuestionPanel (formerly "Scenario") — presents one road scenario in two
 * separate, compact pieces so the road environment behind them (rider,
 * traffic, hazards) stays visible — this is NOT one big card covering the
 * lower half of the screen:
 *
 *  1. A small floating intro card (title + situation text) near the top,
 *     shown only during the brief "what's happening" beat.
 *  2. Once that beat ends, a slim answer dock at the very bottom with
 *     just the question line and the decision buttons.
 *
 * The A/B/C/D screen positions are randomized once per scenario (so the
 * correct answer isn't predictably always "B") — see `optionOrder` below
 * and the comment in utils/shuffle.js for why this needs no scoring
 * changes: options are identified by their canonical index (a stable,
 * shuffle-proof identity — `correctAnswer` in questions.js refers to this
 * same index, never to a displayed letter), not by the letter they
 * happen to be displayed under.
 */
export default function QuestionPanel({ scenario, onAnswer, disabled, checking, feedback, phase, visible, side = "right", isFpv = false }) {
  const { t } = useLanguage();
  const [showQuestion, setShowQuestion] = useState(false);
  const [optionOrder, setOptionOrder] = useState(() => shuffleIndices(scenario.options.length));

  useEffect(() => {
    setShowQuestion(false);
    setOptionOrder(shuffleIndices(scenario.options.length));
    setShowQuestion(true);
  }, [scenario.id, scenario.options.length]);

  if (!visible) return null;

  return (
    <>
      <div className="scenario-intro-float scenario-intro-collapsed">
        <span className="scenario-kicker">{t.scenario.label(scenario.id)}</span>
        <h2 className="scenario-title">{scenario.title}</h2>
      </div>

      {showQuestion && (
        <div className={`scenario-question-dock scenario-question-${scenario.id} question-side-${side} ${isFpv ? "question-fpv" : ""} ${phase === "answerReveal" ? "scenario-question-result" : ""}`}>
          <h3 className="scenario-question">{scenario.question}</h3>
          <AnswerOptions
            options={scenario.options}
            order={optionOrder}
            onSelect={onAnswer}
            disabled={disabled}
            feedback={feedback}
          />
          {checking && (
            <p className="scenario-checking">
              <span className="checking-spinner" /> {t.scenario.checking}
            </p>
          )}
        </div>
      )}
    </>
  );
}
