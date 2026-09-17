import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

/**
 * "Review Your Decisions" — expandable list of all 10 scenarios showing
 * the player's answer vs. the correct answer and the safety explanation.
 *
 * `review` is expected to already be localized (see Results.jsx, which
 * takes the game engine's English results and swaps in the question/
 * options/explanation text from the current language's local scenario
 * data, matched by questionId; selectedAnswer/correctAnswer/isCorrect
 * stay exactly as the engine computed them).
 *
 * Deliberately doesn't show an A/B/C/D letter here: those letters are
 * randomized per play-through (see Scenario.jsx's per-scenario shuffle),
 * so a fixed "B" label on this summary screen wouldn't match whatever
 * position the player actually saw and clicked. The option text itself
 * is the unambiguous record of what was chosen.
 */
export default function ResultsReview({ review }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="results-review">
      <button type="button" className="btn btn-ghost btn-block" onClick={() => setOpen((o) => !o)}>
        {open ? t.resultsReview.hideButton : t.resultsReview.reviewButton}
      </button>

      {open && (
        <div className="review-list">
          {review.map((item, i) => (
            <div key={item.questionId} className={`review-item ${item.isCorrect ? "review-item-correct" : "review-item-wrong"}`}>
              <div className="review-item-header">
                <span className="review-item-number">{t.resultsReview.scenarioLabel(i + 1)}</span>
                <span className={`review-status ${item.isCorrect ? "review-status-correct" : "review-status-wrong"}`}>
                  {item.isCorrect ? t.resultsReview.correct : t.resultsReview.incorrect}
                </span>
              </div>
              <p className="review-question">{item.question}</p>
              <p className="review-line">
                <span className="review-line-label">{t.resultsReview.yourAnswer}</span> {item.options?.[item.selectedAnswer]}
              </p>
              {!item.isCorrect && (
                <p className="review-line">
                  <span className="review-line-label">{t.resultsReview.correctAnswerLine}</span> {item.options?.[item.correctAnswer]}
                </p>
              )}
              <p className="review-explanation">{item.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
