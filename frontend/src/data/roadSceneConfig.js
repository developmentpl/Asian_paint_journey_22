/**
 * Per-scenario road-scene configuration — what's physically present in
 * the world for each of the 10 scenarios (traffic, signals, hazards,
 * weather). This is separate from scenarioActions.js (which describes
 * the animation that plays *after* an answer) — this file describes
 * what's visible on screen *while the question is being asked*.
 *
 * `view` picks which "camera" treatment RoadEnvironment applies (see the
 * `scene-camera-*` classes in index.css) so the game doesn't render every
 * scenario from the same fixed framing:
 *   - "side"      default clear side-on view of the rider/bike (riding,
 *                 speed-control scenarios)
 *   - "wide"      pulled back so the bike AND another subject (the car
 *                 ahead, a pedestrian) are both clearly visible at once
 *   - "hazard"    pushed in and framed low, toward the road surface, so
 *                 a puddle/pothole right in front of the rider reads
 *                 clearly as the thing to react to
 *   - "cinematic" a slightly tighter, graded/vignetted framing for
 *                 intro/instruction and arrival beats
 *   - "top"       a tilted, semi top-down angle so a turn's road geometry
 *                 is easier to read than a flat side view
 *
 * Keyed by question id (1-10), matching data/questions.js.
 */
export const roadSceneConfig = {
  1: { rain: "none", ambientTraffic: false, vehicle: null, signal: null, pedestrian: false, pothole: false, puddle: null, turn: false, night: false, view: "pre-ride" },
  2: { rain: "heavy", ambientTraffic: false, vehicle: null, signal: null, pedestrian: false, pothole: false, puddle: null, turn: false, night: false, lowVisibility: true, view: "rain-wide" },
  3: { rain: "normal", vehicle: null, signal: null, pedestrian: false, pothole: false, puddle: "small", turn: false, night: false, view: "side" },
  4: { rain: "normal", camera: "fpv", vehicle: { type: "car", initialDistance: "close" }, signal: null, pedestrian: false, pothole: false, puddle: null, turn: false, night: false, view: "following" },
  5: { rain: "normal", camera: "fpv", vehicle: { type: "car", initialDistance: "close", braking: true }, signal: null, pedestrian: false, pothole: false, puddle: null, turn: false, night: false, view: "braking" },
  6: { rain: "normal", camera: "fpv", vehicle: null, signal: null, pedestrian: false, pothole: false, puddle: "large", turn: false, night: false, view: "puddle-low" },
  7: { rain: "normal", camera: "fpv", vehicle: null, signal: null, pedestrian: false, pothole: true, puddle: null, turn: false, night: false, view: "pothole-top" },
  8: { rain: "normal", camera: "fpv", vehicle: null, signal: null, pedestrian: true, pothole: false, puddle: null, turn: false, night: true, view: "crossing" },
  9: { rain: "normal", vehicle: null, signal: null, pedestrian: false, pothole: false, puddle: "small", turn: true, night: false, view: "curve" },
  10: { rain: "light", finalDestination: true, vehicle: null, signal: "green", pedestrian: false, pothole: false, puddle: null, turn: false, night: true, view: "destination" },
};

export default roadSceneConfig;
