const LETTERS = ["A", "B", "C", "D"];

/**
 * Large interactive decision buttons. Once `feedback` is present (an
 * answer has been submitted and scored by the backend) every button is
 * disabled and the selected/correct options are highlighted — this is
 * what stops repeated clicks from ever re-scoring the same question
 * (spec §11/§38): the buttons simply stop being clickable.
 *
 * `order` is a permutation of option indices (from Scenario.jsx's
 * per-load shuffle) saying which canonical option renders at each
 * A/B/C/D position — the letter is purely cosmetic. Every click, and
 * every highlight comparison against `feedback`, uses the option's
 * canonical index (`optionId`), which is exactly what the backend
 * already validates against — the shuffle never has to be sent to or
 * understood by the server.
 */
export default function AnswerOptions({ options, order, onSelect, disabled, feedback }) {
  const displayOrder = Array.isArray(order) && order.length === options.length ? order : options.map((_, i) => i);

  return (
    <div className="answer-grid">
      {displayOrder.map((optionId, position) => {
        let stateClass = "";
        if (feedback) {
          if (optionId === feedback.correctAnswer) stateClass = "answer-correct";
          else if (optionId === feedback.selectedAnswer) stateClass = "answer-wrong";
          else stateClass = "answer-muted";
        }

        return (
          <button
            key={optionId}
            type="button"
            className={`answer-btn ${stateClass}`}
            disabled={disabled}
            onClick={() => onSelect(optionId)}
          >
            <span className="answer-letter">{LETTERS[position]}</span>
            <span className="answer-text">{options[optionId]}</span>
            {feedback && optionId === feedback.correctAnswer && <span className="answer-check">✓</span>}
            {feedback && optionId === feedback.selectedAnswer && optionId !== feedback.correctAnswer && (
              <span className="answer-check">✕</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
