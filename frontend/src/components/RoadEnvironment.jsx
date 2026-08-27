import RainEffect from "./RainEffect.jsx";
import MotorcycleRider from "./MotorcycleRider.jsx";
import TrafficVehicle from "./TrafficVehicle.jsx";
import TrafficSignal from "./TrafficSignal.jsx";
import Pedestrian from "./Pedestrian.jsx";
import Pothole from "./Pothole.jsx";
import WaterPuddle from "./WaterPuddle.jsx";
import StreetLight from "./StreetLight.jsx";
import RoadSign from "./RoadSign.jsx";
import AmbientCar from "./AmbientTraffic.jsx";
import FirstPersonRoadView from "./FirstPersonRoadView.jsx";
import FinalDestinationView from "./FinalDestinationView.jsx";
import TopDownTurnView from "./TopDownTurnView.jsx";

/**
 * RoadEnvironment (formerly RoadScene) — the full real-time rainy-road
 * environment, built as explicit stacked layers (back to front):
 *
 *   sky/clouds -> rain -> distant buildings/trees -> roadside objects
 *   (signs, streetlights, guardrail) -> ambient traffic -> traffic/signals
 *   -> road surface -> lane markings/puddles -> motorcycle+rider ->
 *   scenario hazards
 *
 * `sceneConfig` (from data/roadSceneConfig.js) says what's physically in
 * the world for the current scenario; `activeAction` (from
 * ScenarioController, only set during the 'animation' phase) drives
 * one-off reactions — the vehicle ahead pulling away, brake lights,
 * headlight brightening, the rider swerving around a hazard, etc.
 *
 * The question/HUD UI is NOT part of this component — GameScene layers
 * those on top separately, so this environment always renders full-bleed.
 */

// How many buildings/trees/streetlights make up ONE lap of each scrolling
// backdrop track. Each track is rendered TWICE back-to-back (see the
// `Array.from({ length: UNIT * 2 })` calls below) so `scrollScenery`'s
// `translateX(-50%)` always lands on an identical second copy — a true
// seamless loop, so streetlights/trees/buildings repeat continuously at
// equal spacing with no gaps, ever.
const BUILDING_UNIT = 30;
const TREE_UNIT = 24;
const STREETLIGHT_UNIT = 14;
const ROAD_SIGN_UNIT = 8;
const BARRIER_UNIT = 20;
const AMBIENT_CAR_UNIT = 10;

export default function RoadEnvironment({ sceneConfig, splash, activeAction, geared, scenarioId, journeyProgress = 0, paused = false, motionState = "riding" }) {
  const cfg = sceneConfig || {};
  const isNight = !!cfg.night;
  const isTurn = !!cfg.turn;
  const rainIntensity = cfg.rain || "normal";
  const view = cfg.view || "side";

  const vehicleDistance = activeAction === "increaseDistance" ? "far" : cfg.vehicle?.initialDistance || "close";
  const vehicleBraking = !!cfg.vehicle?.braking && (activeAction === "brakeSmooth" || activeAction === "skid" || !activeAction);
  const pedestrianStopped = activeAction === "stopForPedestrian";
  const headlightBright = activeAction === "headlightOn" || cfg.lowVisibility;

  if (cfg.finalDestination) {
    return <FinalDestinationView activeAction={activeAction} geared={geared} journeyProgress={journeyProgress} motionState={motionState} />;
  }

  if (scenarioId === 9) {
    return <TopDownTurnView activeAction={activeAction} geared={geared} />;
  }

  if (cfg.camera === "fpv") {
    return <FirstPersonRoadView config={cfg} activeAction={activeAction} scenarioId={scenarioId} paused={paused} motionState={motionState} />;
  }

  return (
    <div
      className={`road-scene road-scene-view-${view} ${paused ? "hazard-decision-paused" : ""} ${isNight ? "road-scene-night" : ""} ${
        rainIntensity === "heavy" ? "road-scene-storm" : ""
      }`}
    >
      {/* Camera layer: every visual layer below renders exactly as before —
          this wrapper just applies one composite transform (scale / pan /
          tilt, see `.scene-camera-*` in index.css) so different scenarios
          can be framed differently (side-on, wide two-subject shot, a
          hazard pushed close, a tilted semi top-down turn, a graded
          cinematic beat) without any per-layer positioning changes. */}
      <div className={`scene-camera scene-camera-${view}`}>
      {/* 1. Sky / dark clouds */}
      <div className="scene-sky">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>

      {/* 2. Rain */}
      <RainEffect intensity={rainIntensity} />

      {/* 3. Distant buildings / trees — each track renders two identical
          laps back to back so the scroll loop never runs out of skyline
          or treeline and shows a gap (see BUILDING_UNIT/TREE_UNIT above). */}
      <div className="scene-distant">
        <div className="scenery-track scenery-track-buildings">
          {Array.from({ length: BUILDING_UNIT * 2 }).map((_, i) => (
            <div className={`building building-${(i % 3) + 1}`} key={`b${i}`}>
              <span className="building-window" />
              <span className="building-window" />
              <span className="building-window" />
            </div>
          ))}
        </div>
      </div>
      <div className="scene-roadside">
        <div className="scenery-track scenery-track-trees">
          {Array.from({ length: TREE_UNIT * 2 }).map((_, i) => (
            <div className={`tree-icon tree-icon-${(i % 3) + 1}`} key={`t${i}`}>
              <span className="tree-canopy" />
              <span className="tree-canopy tree-canopy-shade" />
              <span className="tree-trunk" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Roadside objects: streetlights and warning signs, each in
          their own evenly-spaced, seamlessly looping track (same
          mechanism as the buildings/trees above), plus divider posts and
          a continuous guardrail. Streetlights render in every scenario —
          the base scene is already a dusk/twilight navy throughout, so a
          lamp-lit roadside reads as consistent scenery, not a night-only
          special case. */}
      <div className="scene-roadside-objects">
        <div className="streetlight-track-wrap">
          <div className="scenery-track scenery-track-streetlights">
            {Array.from({ length: STREETLIGHT_UNIT * 2 }).map((_, i) => (
              <StreetLight key={`sl${i}`} />
            ))}
          </div>
        </div>
        <div className="road-sign-track-wrap">
          <div className="scenery-track scenery-track-signs">
            {Array.from({ length: ROAD_SIGN_UNIT * 2 }).map((_, i) => (
              <RoadSign key={`sign${i}`} kind={i % 2 === 0 ? "slippery" : "caution"} />
            ))}
          </div>
        </div>
        <div className="divider-track">
          {Array.from({ length: 14 }).map((_, i) => (
            <span className="divider-post" key={i} />
          ))}
        </div>
        <div className="barrier-track-wrap">
          <div className="scenery-track scenery-track-barriers">
            {Array.from({ length: BARRIER_UNIT * 2 }).map((_, i) => (
              <span className="guardrail-segment" key={`gr${i}`} />
            ))}
          </div>
        </div>
      </div>

      {/* 4.5 Ambient opposite-lane traffic — small, softly-blurred car
          silhouettes that continuously pass in the distance. */}
      <div className="scene-ambient-traffic">
        <div className="scenery-track scenery-track-ambient-cars">
          {Array.from({ length: AMBIENT_CAR_UNIT * 2 }).map((_, i) => (
            <AmbientCar key={`ac${i}`} variant={i % 2} depth={i % 3} />
          ))}
        </div>
      </div>

      {/* 5. Traffic / signals */}
      {cfg.signal && (
        <div className="scene-signal-slot">
          <TrafficSignal state={cfg.signal} />
        </div>
      )}
      {cfg.vehicle && (
        <>
          <TrafficVehicle
            type={cfg.vehicle.type}
            braking={vehicleBraking}
            distance={vehicleDistance}
            moving
          />
          {view === "following" && <div className={`safe-gap-guide safe-gap-${vehicleDistance}`} aria-hidden="true"><span /></div>}
        </>
      )}

      {/* 6-7. Road surface + lane markings + puddles */}
      <div className={`scene-road ${isTurn ? "scene-road-turn" : ""}`}>
        <div className="road-wet-sheen" />
        <div className="road-lane-markings" />
        <div className="road-edge-line road-edge-left" />
        <div className="road-edge-line road-edge-right" />

        {cfg.puddle && (
          <div className={`scene-puddle-slot puddle-slot-${cfg.puddle}`}>
            <WaterPuddle size={cfg.puddle} />
          </div>
        )}

        {cfg.pedestrian && (
          <div className="pedestrian-crossing">
            <div className="crossing-stripes" />
            <Pedestrian variant={1} stopped={pedestrianStopped} />
            <Pedestrian variant={2} stopped={pedestrianStopped} />
          </div>
        )}
      </div>

      {/* 8. Motorcycle + rider (fixed above the road, never obscured) */}
      <MotorcycleRider activeAction={activeAction} geared={geared} scenarioId={scenarioId} splash={splash} journeyProgress={journeyProgress} />

      {/* 8.5 Foreground rain — a second, sparser rain pass drawn ABOVE the
          rider so raindrops are visibly falling past/on them. */}
      <RainEffect intensity={rainIntensity} foreground />

      {/* 9. Scenario hazard objects */}
      {cfg.pothole && (
        <div className="scene-pothole-slot">
          <Pothole />
        </div>
      )}

      {headlightBright && <div className="scene-low-vis-overlay" />}
      </div>
    </div>
  );
}
