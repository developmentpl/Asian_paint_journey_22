import { useEffect, useRef } from "react";
import { useAudio } from "./AudioManager.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import journeyEnglishAudio from "../assets/audio/journey-en.mp3";
import journeyHindiAudio from "../assets/audio/journey-hi.mp3";

const CHALLENGE_TYPES = ["check", "rain", "speed", "distance", "brake", "water", "pothole", "crossing", "turn", "arrival"];

function ChallengeIcon({ type }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
  const art = {
    check: <><circle cx="24" cy="22" r="12" {...common}/><path d="m17 22 5 5 10-11M13 39h22" {...common}/></>,
    rain: <><path d="M11 23c1-7 7-11 14-9 3-4 12-1 12 5 5 0 8 3 8 7H10c-4-1-4-6 1-7" {...common}/><path d="m16 31-3 6m13-6-3 8m14-8-3 6" {...common}/></>,
    speed: <><path d="M10 35a16 16 0 1 1 28 0M24 33l9-11" {...common}/><circle cx="24" cy="33" r="2.5" fill="currentColor"/></>,
    distance: <><path d="M7 30h13l4-8h9l7 8h3v7H7zM11 30l3-5h6" {...common}/><circle cx="14" cy="37" r="4" {...common}/><circle cx="36" cy="37" r="4" {...common}/><path d="M4 14h40M4 14l5-4m-5 4 5 4m35-4-5-4m5 4-5 4" {...common}/></>,
    brake: <><circle cx="24" cy="26" r="15" {...common}/><path d="M24 16v11l7 5M10 9l5 5m23-5-5 5" {...common}/></>,
    water: <><path d="M24 7S12 23 12 31a12 12 0 0 0 24 0C36 23 24 7 24 7Z" {...common}/><path d="M5 41c5-3 9 3 14 0s9 3 14 0 8 2 12 0" {...common}/></>,
    pothole: <><ellipse cx="24" cy="31" rx="18" ry="9" {...common}/><path d="m11 31 7-4 6 3 7-5 7 6M7 13l6 5m28-5-6 5" {...common}/></>,
    crossing: <><path d="M5 38h38M8 32h6m5 0h6m5 0h6M11 25h6m5 0h6m5 0h6" {...common}/><circle cx="24" cy="8" r="4" {...common}/><path d="m24 12-1 10-7 5m7-7 7 5m-7-8-6 2" {...common}/></>,
    turn: <><path d="M9 40c0-18 9-18 19-18h10M33 15l7 7-7 7" {...common}/><path d="M17 40c0-10 3-11 11-11" {...common}/></>,
    arrival: <><path d="M8 41V21L24 9l16 12v20H8Z" {...common}/><path d="M19 41V28h10v13M35 9v8" {...common}/><path d="M35 9h9l-3 4 3 4h-9" {...common}/></>,
  };
  return <svg viewBox="0 0 48 48" aria-hidden="true">{art[type]}</svg>;
}

/** Visual route preview shown before the existing countdown/game flow. */
export default function WelcomeScreen({ playerName, onStartJourney }) {
  const { language, t } = useLanguage();
  const { playNarration, stopNarration } = useAudio();
  const playedLanguageRef = useRef(null);

  useEffect(() => {
    if (playedLanguageRef.current === language) return;
    const source = language === "hi" ? journeyHindiAudio : journeyEnglishAudio;
    if (playNarration(source)) playedLanguageRef.current = language;
  }, [language, playNarration]);

  const handleStartJourney = () => {
    stopNarration();
    onStartJourney();
  };

  return (
    <section className="journey-map" aria-labelledby="journey-title">
      <div className="journey-rain" aria-hidden="true">{Array.from({ length: 18 }).map((_, i) => <i key={i} />)}</div>
      <header className="journey-header">
        <div>
          <p className="welcome-eyebrow">{t.welcome.eyebrow(playerName)}</p>
          <h1 id="journey-title">{t.welcome.mapTitle}</h1>
          <p>{t.welcome.mapSubtitle}</p>
        </div>
        <div className="journey-legend"><span />{t.welcome.routeLabel}</div>
      </header>
      <div className="route-board">
        <svg className="route-road" viewBox="0 0 1000 355" preserveAspectRatio="none" aria-hidden="true">
          <path className="route-road-edge" d="M55 95 C230 35 405 35 500 100 S805 170 930 95 C990 60 970 35 930 35 M930 35 C780 15 700 175 815 245 S575 335 470 265 S175 205 62 280" />
          <path className="route-road-center" d="M55 95 C230 35 405 35 500 100 S805 170 930 95 C990 60 970 35 930 35 M930 35 C780 15 700 175 815 245 S575 335 470 265 S175 205 62 280" />
        </svg>
        <div className="route-start" aria-hidden="true"><span>{t.welcome.start}</span><img src="/bike-assets/bike-rider-geared.png" alt="" /></div>
        <ol className="challenge-route">
          {t.welcome.challenges.map((label, i) => (
            <li className={`challenge-node challenge-node-${i + 1}`} key={CHALLENGE_TYPES[i]} style={{ "--delay": `${i * 0.12}s` }}>
              <span className="challenge-number">{i + 1}</span>
              <span className="challenge-picture"><ChallengeIcon type={CHALLENGE_TYPES[i]} /></span>
              <strong>{label}</strong>
            </li>
          ))}
        </ol>
        <div className="route-destination" aria-hidden="true"><span>{t.welcome.destination}</span><ChallengeIcon type="arrival" /></div>
      </div>
      <footer className="journey-footer">
        <p>{t.welcome.ctaHint}</p>
        <button type="button" className="btn btn-primary journey-start-btn" onClick={handleStartJourney}><span>{t.welcome.startJourney}</span><span aria-hidden="true">→</span></button>
      </footer>
    </section>
  );
}
