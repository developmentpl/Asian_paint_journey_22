import ProgressBar from "./ProgressBar.jsx";
import { MuteButton } from "./AudioManager.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

/**
 * Game HUD — player name (top left), scenario progress (top center),
 * score (top right).
 */
export default function ScoreHUD({ playerName, current, total, score, maxScore, journeyProgress = 0 }) {
  const { t } = useLanguage();
  const initial = (playerName || "").trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="hud">
      <div className="hud-left">
        <span className="hud-avatar" aria-hidden="true">
          {initial}
        </span>
        <span className="hud-text-col">
          <span className="hud-label">{t.hud.rider}</span>
          <span className="hud-value">{playerName}</span>
        </span>
      </div>

      <div className="hud-center">
        <span className="hud-scenario-text">{t.hud.scenario(current, total)}</span>
        <ProgressBar progress={journeyProgress} total={total} />
      </div>

      <div className="hud-right">
        <span className="hud-text-col hud-text-col-end">
          <span className="hud-label">{t.hud.score}</span>
          <span className="hud-value hud-score">
            {score} / {maxScore}
          </span>
        </span>
        <MuteButton className="hud-mute" />
      </div>
    </div>
  );
}
