import { useLanguage } from "../i18n/LanguageContext.jsx";

/**
 * Journey progress route: START ●━●━●━... ● DESTINATION
 * with a bike marker sitting on the current step.
 */
export default function ProgressBar({ progress, total }) {
  const { t } = useLanguage();
  const percent = Math.min(100, Math.round((progress / total) * 100));

  return (
    <div className="progress-route">
      <span className="progress-endpoint">{t.progress.start}</span>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
        <div className="progress-bike" style={{ left: `${percent}%` }}>
          🏍️
        </div>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`progress-dot ${i < progress ? "progress-dot-done" : ""} ${
              i === progress ? "progress-dot-active" : ""
            }`}
            style={{ left: `${(i / (total - 1)) * 100}%` }}
          />
        ))}
      </div>
      <span className="progress-endpoint">{t.progress.destination}</span>
    </div>
  );
}
