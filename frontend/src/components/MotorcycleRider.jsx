/**
 * MotorcycleRider — real photo asset, direct <img> render (round 10).
 *
 * Per an explicit product decision, this component never draws the
 * bike/rider as hand-illustrated SVG/CSS shapes. It renders a real
 * transparent PNG/WebP photograph with a plain `<img className="game-
 * bike-rider">` and animates that image with CSS/React transforms only:
 * suspension bounce, an accelerate-out surge, brake dive, lean,
 * swerve/lane-change, skid, jerk, bump, plus overlay effects for the
 * continuous rain spray, one-off puddle splash, a headlight glow and a
 * brake/tail-light glow. If the required photo asset is missing, this
 * renders NOTHING in its place — no placeholder box, no drawn artwork —
 * only a console warning for developers; see <BikePhotoLayer/> below.
 *
 * Required assets (full spec in ASSETS.md) — place these under
 * `frontend/public/bike-assets/`:
 *   - bike-rider-plain.png  (or .webp)  — bike + rider, no helmet/raincoat
 *   - bike-rider-geared.png (or .webp)  — same bike/rider/pose, WITH
 *     helmet + raincoat visible
 * Both need a transparent background, the same side-view pose/crop/
 * scale, and the bike facing right, so the crossfade between them (and
 * the overlay effects below, which are positioned by % anchor) lines up
 * cleanly. The component tries `.webp` first, then `.png` for each.
 *
 * Functional contract with the rest of the app is unchanged on purpose
 * (scoring/backend never touches this component):
 *  - `geared`: true once Scenario 1 has been answered correctly — the
 *    geared-up photo then stays on for the rest of the journey.
 *  - `activeAction`: the current step key from ScenarioController
 *    (e.g. "wearHelmet", "reduceSpeed", "skid") — drives a one-off visual
 *    reaction. Because a single photo can't reveal a helmet and a
 *    raincoat independently the way separate SVG layers could, both
 *    "wearHelmet" and "wearRaincoat" trigger the same crossfade to the
 *    geared photo — gear appears as one moment instead of two.
 *  - `splash`: transient puddle-splash trigger (waterlogged/pothole).
 *
 * Class names the CSS keys off (rider-wrapper, rider-photo-frame,
 * rider-photo-suspension, rider-photo-stack, bike-rider,
 * rider-photo-layer-visible, rider-slow, rider-braking, rider-accelerate,
 * rider-swerve, rider-lean, rider-skid, rider-jerk, rider-bump,
 * rider-drop-back, rider-arrived, rider-consequence, water-splash,
 * headlight-beam, wheel-spray, rear-light-glow, tyre-check,
 * check-complete-badge …) are documented right above each
 * rule in index.css.
 */
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { DEFAULT_STEP_DURATION } from "../data/scenarioActions.js";

const ACTION_WRAPPER_CLASS = {
  reduceSpeed: "rider-slow",
  brakeSmooth: "rider-slow rider-braking",
  increaseDistance: "rider-drop-back",
  avoidHazard: "rider-swerve",
  stopForPedestrian: "rider-stopped",
  slowTurn: "rider-lean",
  arriveDestination: "rider-arrived",
  checkComplete: "rider-check-complete",
  lowVisSkid: "rider-skid",
  wobble: "rider-skid",
  skid: "rider-skid",
  skidTurn: "rider-skid",
  closeCall: "rider-jerk",
  nearMissPedestrian: "rider-jerk",
  potholeHit: "rider-bump",
  shakyArrival: "rider-jerk",
};

const BRAKING_ACTIONS = new Set(["brakeSmooth", "stopForPedestrian", "reduceSpeed", "slowTurn"]);

const CONSEQUENCE_ACTIONS = new Set([
  "lowVisSkid",
  "wobble",
  "skid",
  "skidTurn",
  "closeCall",
  "nearMissPedestrian",
  "potholeHit",
  "shakyArrival",
  "splashHit",
  "noGear",
  "exposedRider",
]);

const IMAGE_EXTENSIONS = ["webp", "png"];

/**
 * One bike/rider photo layer — a real `<img className="bike-rider">`,
 * nothing else. Tries `.webp` then `.png` from `/bike-assets/`; if
 * neither request succeeds it renders nothing at all (no placeholder
 * box, no drawn fallback) and logs one console warning naming the exact
 * file to add, so a missing asset is silent in the game itself but
 * obvious to whoever's building it.
 */
function BikePhotoLayer({ baseName, active }) {
  const [extIndex, setExtIndex] = useState(0);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setExtIndex(0);
    setMissing(false);
  }, [baseName]);

  useEffect(() => {
    if (missing) {
      // eslint-disable-next-line no-console
      console.warn(
        `[road-safety-game] Missing bike/rider asset — add "${baseName}.png" or "${baseName}.webp" ` +
          `to frontend/public/bike-assets/ (see ASSETS.md for the exact spec).`
      );
    }
  }, [missing, baseName]);

  if (missing) return null;

  const src = `/bike-assets/${baseName}.${IMAGE_EXTENSIONS[extIndex]}`;

  return (
    <img
      className={`bike-rider ${active ? "rider-photo-layer-visible" : ""}`}
      src={src}
      alt="Motorcycle and rider"
      draggable={false}
      onError={() => {
        setExtIndex((i) => {
          if (i < IMAGE_EXTENSIONS.length - 1) return i + 1;
          setMissing(true);
          return i;
        });
      }}
    />
  );
}

export default function MotorcycleRider({ activeAction, geared, scenarioId, splash, journeyProgress = 0 }) {
  const { language } = useLanguage();
  const [displaySpeed, setDisplaySpeed] = useState(40);
  useEffect(() => {
    if (scenarioId !== 2 || activeAction !== "reduceSpeed") {
      setDisplaySpeed(40);
      return undefined;
    }
    const started = performance.now();
    const timer = setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / (DEFAULT_STEP_DURATION * 0.8));
      setDisplaySpeed(Math.round(40 - 20 * progress));
      if (progress === 1) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [scenarioId, activeAction]);
  const actionClass = ACTION_WRAPPER_CLASS[activeAction] || "";
  const isConsequence = CONSEQUENCE_ACTIONS.has(activeAction);
  const headlightBright = activeAction === "headlightOn";
  const bigSplash = activeAction === "splashHit";
  const brakeLightOn = BRAKING_ACTIONS.has(activeAction) || activeAction === "stopForPedestrian";
  const preRideEquipping = scenarioId === 1 && !geared;
  const helmetOnly = preRideEquipping && activeAction === "wearHelmet";
  const fullyEquipped =
    geared ||
    (preRideEquipping &&
      ["wearRaincoat", "checkFrontTyre", "checkRearTyre", "headlightOn", "checkComplete"].includes(activeAction));

  // Brief "accelerate" surge the instant a braking action lets go, so
  // acceleration and deceleration/braking both read as distinct motions
  // instead of the bike just snapping back to normal.
  const prevActionRef = useRef(activeAction);
  const [accelerating, setAccelerating] = useState(false);
  useEffect(() => {
    const wasBraking = BRAKING_ACTIONS.has(prevActionRef.current);
    const isBrakingNow = BRAKING_ACTIONS.has(activeAction);
    prevActionRef.current = activeAction;
    if (wasBraking && !isBrakingNow) {
      setAccelerating(true);
      const t = setTimeout(() => setAccelerating(false), 550);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [activeAction]);

  return (
    <div
      className={`rider-wrapper ${actionClass} ${isConsequence ? "rider-consequence" : ""} ${
        accelerating ? "rider-accelerate" : ""
      }`}
      data-action={activeAction || "idle"}
      style={{ left: `${18 + Math.min(10, journeyProgress) * 6}%` }}
    >
      <div className="rider-ground-shadow" />

      {(splash || bigSplash) && <div className={`water-splash ${bigSplash ? "water-splash-big" : ""}`} />}

      <div className={`headlight-beam ${headlightBright ? "headlight-beam-bright" : ""}`} />
      <div className={`rear-light-glow ${brakeLightOn ? "rear-light-glow-on" : ""}`} />

      {/* Continuous fine water spray thrown up off both contact patches —
          always present at a low level, more pronounced while braking. */}
      <span className="wheel-spray wheel-spray-rear" />
      <span className="wheel-spray wheel-spray-front" />

      {/* Tyre-check pulses (Scenario 1) */}
      {activeAction === "checkFrontTyre" && <span className="tyre-check tyre-check-front">✓</span>}
      {activeAction === "checkRearTyre" && <span className="tyre-check tyre-check-rear">✓</span>}

      <div className="rider-photo-frame">
        <div className="rider-photo-suspension">
          <div className="rider-photo-stack">
            <BikePhotoLayer baseName="bike-rider-plain" active={!helmetOnly && !fullyEquipped} />
            <BikePhotoLayer baseName="bike-rider-helmet" active={helmetOnly} />
            <BikePhotoLayer baseName="bike-rider-geared" active={fullyEquipped} />
            <svg className="rider-mirrors" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
              <g stroke="#243340" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                <path d="M973 481 1001 410 1030 395 M917 495 934 414 955 389" fill="none" />
                <ellipse cx="1044" cy="384" rx="37" ry="22" fill="#a3cedf" transform="rotate(-15 1044 384)" />
                <ellipse cx="963" cy="378" rx="32" ry="20" fill="#7398ae" transform="rotate(-15 963 378)" />
              </g>
            </svg>
            <span className="wheel-hub-motion wheel-hub-motion-rear" aria-hidden="true" />
            <span className="wheel-hub-motion wheel-hub-motion-front" aria-hidden="true" />
          </div>
        </div>
      </div>

      {isConsequence && (
        <svg className="consequence-fx" viewBox="0 0 60 40" aria-hidden="true">
          <path d="M2 20 Q15 5 28 20 T54 20" stroke="var(--white-dim)" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M2 30 Q15 15 28 30 T54 30" stroke="var(--white-dim)" strokeWidth="3" fill="none" opacity="0.45" />
        </svg>
      )}
      {activeAction === "checkComplete" && (
        <span className="check-complete-badge">
          {language === "hi" ? "✓ प्री-राइड सुरक्षा जांच पूरी +10" : "✓ Pre-Ride Safety Check Completed +10"}
        </span>
      )}

      <div className="road-reflection" />
      {scenarioId === 2 && activeAction === "reduceSpeed" && (
        <div className="rider-speed-readout" role="status" aria-label={language === "hi" ? "रफ़्तार कम हो रही है" : "Reducing speed"}>
          <span>{language === "hi" ? "रफ़्तार" : "SPEED"}</span>
          <strong>{displaySpeed} <small>km/h</small></strong>
        </div>
      )}
    </div>
  );
}
