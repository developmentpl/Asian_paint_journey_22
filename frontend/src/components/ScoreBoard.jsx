import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const CIRCUMFERENCE = 2 * Math.PI * 70;

function getPerformance(score, performanceText) {
  if (score >= 90) {
    return { ...performanceText.excellent, tone: "excellent", icon: "★" };
  }
  if (score >= 70) {
    return { ...performanceText.good, tone: "good", icon: "✓" };
  }
  if (score >= 50) {
    return { ...performanceText.needsImprovement, tone: "needs-improvement", icon: "↗" };
  }
  return { ...performanceText.trainingRecommended, tone: "training-recommended", icon: "!" };
}

/**
 * Animated circular score meter + player summary + performance message.
 */
export default function ScoreBoard({ player, session }) {
  const { t } = useLanguage();
  const score = session.score;
  const maxScore = session.total_questions * 10;
  const perf = getPerformance(score, t.scoreboard.performance);
  const [animatedOffset, setAnimatedOffset] = useState(CIRCUMFERENCE);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedCorrect, setAnimatedCorrect] = useState(0);
  const [animatedWrong, setAnimatedWrong] = useState(0);
  const [scoreComplete, setScoreComplete] = useState(false);

  useEffect(() => {
    const targetOffset = CIRCUMFERENCE - (score / maxScore) * CIRCUMFERENCE;
    const timer = setTimeout(() => setAnimatedOffset(targetOffset), 150);

    const duration = 1600;
    const start = Date.now();
    let frame;
    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      const steppedScore = progress >= 1 ? score : Math.floor((progress * score) / 10) * 10;
      setAnimatedScore(steppedScore);
      if (progress >= 1) setScoreComplete(true);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  useEffect(() => {
    const timers = [];
    const frames = [];
    const animateValue = (target, setter, delay) => {
      timers.push(setTimeout(() => {
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / 620);
          setter(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frames.push(requestAnimationFrame(tick));
        };
        frames.push(requestAnimationFrame(tick));
      }, delay));
    };
    animateValue(session.correct_answers, setAnimatedCorrect, 1900);
    animateValue(session.wrong_answers, setAnimatedWrong, 2150);
    return () => {
      timers.forEach(clearTimeout);
      frames.forEach(cancelAnimationFrame);
    };
  }, [session.correct_answers, session.wrong_answers]);

  return (
    <div className="scoreboard">
      <h1 className="scoreboard-heading">{t.scoreboard.heading}</h1>

      <div className={`score-meter scoreboard-score-reveal ${scoreComplete ? "score-meter-complete" : ""}`}>
        <svg viewBox="0 0 160 160" className="score-meter-svg">
          <circle cx="80" cy="80" r="70" className="score-meter-track" />
          <circle
            cx="80"
            cy="80"
            r="70"
            className={`score-meter-fill score-meter-${perf.tone}`}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={animatedOffset}
          />
        </svg>
        <div className="score-meter-label">
          <span className="score-meter-value">{animatedScore}</span>
          <span className="score-meter-max">/ {maxScore}</span>
        </div>
        {scoreComplete && score >= 90 && <div className="score-confetti" aria-hidden="true">{Array.from({length:10}).map((_,i)=><i key={i}/>)}</div>}
      </div>

      <div className="scoreboard-counts">
        <div className="count-pill count-pill-correct scoreboard-count-reveal-correct">
          <span className="count-icon">✓</span>
          <span className="count-number">{animatedCorrect}</span>
          <span className="count-label">{t.scoreboard.correctDecisions}</span>
        </div>
        <div className="count-pill count-pill-wrong scoreboard-count-reveal-wrong">
          <span className="count-icon">!</span>
          <span className="count-number">{animatedWrong}</span>
          <span className="count-label">{t.scoreboard.unsafeDecisions}</span>
        </div>
      </div>

      <div className={`performance-banner performance-${perf.tone} scoreboard-performance-reveal`}>
        <span className="performance-icon" aria-hidden="true">{perf.icon}</span>
        <div>
          <h3>{perf.label}</h3>
          <p className="performance-message-reveal">{perf.message}</p>
        </div>
      </div>

      <div className="scoreboard-meta">
        <p className="scoreboard-meta-chip scoreboard-reveal-1"><i>👤</i>
          <span className="meta-label">{t.scoreboard.playerLabel}</span> {player.name}
        </p>
        <p className="scoreboard-meta-chip scoreboard-reveal-2"><i>🪪</i>
          <span className="meta-label">{t.scoreboard.employeeIdLabel}</span> {player.employee_id || player.employeeId}
        </p>
        <p className="scoreboard-meta-chip scoreboard-reveal-3"><i>🏭</i>
          <span className="meta-label">{t.scoreboard.plantLabel}</span> {player.plant}
        </p>
      </div>
    </div>
  );
}
