import { useEffect, useRef } from "react";
import RainEffect from "./RainEffect.jsx";
import Pedestrian from "./Pedestrian.jsx";
import RearRedCarSvg from "./RearRedCarSvg.jsx";

function RearCar({ braking, indicating, far }) {
  return (
    <div className={`fpv-lead-car ${far ? "fpv-car-far" : ""} ${braking ? "fpv-car-braking" : ""}`}>
      <RearRedCarSvg braking={braking} indicating={indicating} />
    </div>
  );
}

export default function FirstPersonRoadView({ config, activeAction, scenarioId, paused = false, motionState = "riding" }) {
  const sceneRef = useRef(null);
  const sceneMotionState = scenarioId === 8 && activeAction === "stopForPedestrian" ? "stopped" : motionState;
  const braking = scenarioId === 5 || activeAction === "brakeSmooth";
  const indicating = scenarioId === 5;
  const carFar = activeAction === "increaseDistance";
  const slowing = ["reduceSpeed", "brakeSmooth", "stopForPedestrian", "slowTurn", "avoidHazard", "splashHit"].includes(activeAction);
  const avoiding = activeAction === "avoidHazard";
  const potholeHit = activeAction === "potholeHit";
  const waterHit = activeAction === "splashHit";

  // Keep one continuous animation timeline for every world-motion layer.
  // Playback rate changes preserve currentTime; pausing therefore freezes
  // the exact rendered frame instead of recalculating negative delays or
  // redistributing the perspective strips.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    // .raindrop is deliberately excluded here — rain's play/pause state is
    // governed purely by CSS (animation-play-state), which is what lets
    // .fpv-aligned-road-scene (scenarios 4-7) and .fpv-crossing-scene
    // (scenario 8) keep rain animating through the "stopped" question
    // phase via the `!important` overrides in index.css. A WAAPI
    // `.pause()` call here would win over any CSS play-state (it puts the
    // animation in a manually-paused hold state that a CSS rule cannot
    // resume), silently freezing rain during every question regardless of
    // scenario.
    const movingElements = scene.querySelectorAll(
      ".fpv-road-texture, .fpv-lane-stream i, .fpv-roadside-object, .fpv-city, .fpv-lead-car"
    );
    const animations = Array.from(movingElements).flatMap((element) => element.getAnimations());

    if (sceneMotionState === "stopped") {
      animations.forEach((animation) => animation.pause());
      return undefined;
    }

    const targetRate = sceneMotionState === "decelerating" ? 0.16 : 1;
    const startRates = animations.map((animation) => animation.playbackRate || 0.16);
    animations.forEach((animation) => animation.play());
    const startedAt = performance.now();
    let frame;

    const updateRate = (now) => {
      const progress = Math.min(1, (now - startedAt) / 780);
      const eased = 1 - Math.pow(1 - progress, 3);
      animations.forEach((animation, index) => {
        animation.updatePlaybackRate(startRates[index] + (targetRate - startRates[index]) * eased);
      });
      if (progress < 1) frame = requestAnimationFrame(updateRate);
    };
    frame = requestAnimationFrame(updateRate);
    return () => cancelAnimationFrame(frame);
  }, [sceneMotionState, scenarioId]);

  return (
    <div ref={sceneRef} className={`road-scene fpv-scene fpv-motion-${sceneMotionState} ${activeAction === "arriveDestination" ? "fpv-arriving" : ""} ${[4, 5, 6, 7].includes(scenarioId) ? "fpv-aligned-road-scene" : ""} ${scenarioId === 6 ? "fpv-waterlogged-scene" : ""} ${scenarioId === 8 ? "fpv-crossing-scene" : ""} ${paused ? "hazard-decision-paused" : ""} ${potholeHit ? "fpv-pothole-hit" : ""} ${waterHit ? "fpv-water-hit" : ""} ${config.night ? "road-scene-night" : ""} ${slowing ? "fpv-slowing" : ""} ${avoiding ? "fpv-avoiding" : ""}`}>
      <div className="fpv-sky"><span className="fpv-horizon-glow" /></div>
      <div className="fpv-city" aria-hidden="true">{Array.from({length: 18}).map((_,i)=><i key={i} />)}</div>
      {scenarioId !== 8 && <div className="fpv-roadside" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <i key={i} className={`fpv-roadside-object fpv-roadside-${i % 3}`} style={{ "--object-index": i }} />
        ))}
      </div>}
      <div className="fpv-road">
        <span className="fpv-edge fpv-edge-left" /><span className="fpv-edge fpv-edge-right" />
        <span className="fpv-lane-stream fpv-lane-left">{Array.from({length: 7}).map((_,i)=><i key={i} style={{"--dash-index":i}} />)}</span>
        <span className="fpv-lane-stream fpv-lane-right">{Array.from({length: 7}).map((_,i)=><i key={i} style={{"--dash-index":i}} />)}</span>
        <span className="fpv-road-sheen" />
        <span className="fpv-road-texture" />
      </div>

      {config.vehicle && <RearCar braking={braking} indicating={indicating} far={carFar} />}
      {config.puddle && <div className={`fpv-hazard fpv-puddle fpv-puddle-${config.puddle}`}><i /><i /><i /></div>}
      {waterHit && <div className="fpv-deep-water-splash" aria-hidden="true"><i/><i/><i/><i/><i/></div>}
      {config.pothole && <div className="fpv-hazard fpv-pothole"><i /></div>}
      {config.pedestrian && (
        <>
          {scenarioId !== 8 && <div className="fpv-crossing-streetlights" aria-hidden="true"><i/><i/></div>}
          <svg className="fpv-crossing-warning" viewBox="0 0 110 200" role="img" aria-label="Pedestrian crossing ahead">
            <rect x="50" y="83" width="10" height="111" rx="2" fill="#b4c0ca" stroke="#526371" strokeWidth="2" />
            <ellipse cx="55" cy="195" rx="18" ry="4" fill="#42515b" />
            <rect x="18" y="18" width="74" height="74" rx="5" transform="rotate(45 55 55)" fill="#ffd126" stroke="#e6a700" strokeWidth="3" />
            <rect x="22" y="22" width="66" height="66" rx="3" transform="rotate(45 55 55)" fill="none" stroke="#252b30" strokeWidth="1.5" />
            <circle cx="60" cy="31" r="5" fill="#252b30" />
            <path d="m56 41-9 16-5 19m10-20 12 8 4 13M54 44l-13 9-2 10m17-20 10 12 10 2" fill="none" stroke="#252b30" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M34 83h43" stroke="#252b30" strokeWidth="3" />
          </svg>
          <div className="fpv-stop-line" aria-hidden="true" />
          <div className="fpv-stop-line-far" aria-hidden="true" />
          <div className={`fpv-crossing ${activeAction === "stopForPedestrian" ? "fpv-pedestrians-crossing" : "fpv-pedestrians-waiting"}`}>
            <div className="fpv-zebra" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, index) => <i key={index} />)}
            </div>
            <Pedestrian variant={1} stopped={activeAction !== "stopForPedestrian"} profile />
          </div>
        </>
      )}
      {config.signal && (
        <div className={`fpv-signal ${config.signal === "pedestrian" ? "fpv-pedestrian-signal" : ""}`}>
          <span className={config.signal === "pedestrian" ? "fpv-ped-stop" : (config.signal === "green" ? "" : "on-red")} />
          <span className={config.signal === "pedestrian" ? "fpv-ped-go" : (config.signal === "green" ? "on-green" : "")} />
        </div>
      )}
      {scenarioId === 10 && (
        <>
          <div className="fpv-plant-driveway" aria-hidden="true" />
          <div className={`fpv-plant ${activeAction === "arriveDestination" ? "fpv-plant-arrived" : ""}`} aria-label="Asian Paints plant destination">
            <div className="fpv-plant-sign"><b>ASIAN PAINTS</b><span>PLANT</span></div>
            <div className="fpv-plant-building"><i/><i/><i/><i/><i/></div>
            <div className="fpv-plant-gate"><span>WELCOME</span></div>
          </div>
        </>
      )}

      <div className="fpv-cockpit" aria-hidden="true">
        <span className="fpv-mirror fpv-mirror-left" /><span className="fpv-mirror fpv-mirror-right" />
        <span className="fpv-handle fpv-handle-left">
          <span className="fpv-arm fpv-arm-left"><i className="fpv-hand" /></span>
        </span>
        <span className="fpv-handle fpv-handle-right">
          <span className="fpv-arm fpv-arm-right"><i className={`fpv-hand ${braking ? "fpv-hand-braking" : ""}`} /></span>
        </span>
        <span className="fpv-speedometer"><b>{sceneMotionState === "stopped" ? "0" : sceneMotionState === "decelerating" ? "18" : slowing ? "28" : "30"}</b><small>km/h</small></span>
        <span className="fpv-bike-front"><i /></span>
      </div>
      <RainEffect intensity={config.rain || "normal"} />
      <div className="fpv-vignette" />
    </div>
  );
}
