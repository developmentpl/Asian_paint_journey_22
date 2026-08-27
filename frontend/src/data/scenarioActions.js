/**
 * Per-scenario visual "action" sequences.
 *
 * When a player answers, before the explanation/points are shown, the
 * MotorcycleRider plays a short real-time sequence of actions (correct
 * path) or a short unsafe consequence (wrong path) driven by
 * ScenarioActionController. Each step is:
 *   { key, caption, duration? }
 * - `key` maps to a CSS state on MotorcycleRider (see MotorcycleRider.jsx)
 * - `caption` is shown as a subtitle while that step plays
 * - `duration` (ms) optionally overrides the default step length
 *
 * Scenario 1 is special: its correct path is the "gear up" sequence
 * (helmet -> raincoat -> tyres -> headlight -> check complete) and,
 * once completed correctly, the rider keeps wearing the helmet/raincoat
 * for the rest of the journey (see Game.jsx `geared` state).
 */

export const scenarioActions = {
  1: {
    correct: [
      { key: "wearHelmet", caption: "Rider puts on the helmet." },
      { key: "wearRaincoat", caption: "Rider puts on the raincoat." },
      { key: "checkFrontTyre", caption: "Rider checks the front tyre grip." },
      { key: "checkRearTyre", caption: "Rider checks the rear tyre grip." },
      { key: "headlightOn", caption: "Rider checks and turns on the headlight." },
      { key: "checkComplete", caption: "Pre-Ride Safety Check Completed ✓ +10", duration: 1400 },
    ],
    wrong: [
      { key: "noGear", caption: "Rider sets off without protective gear…" },
      { key: "exposedRider", caption: "Unprepared for the rain ahead." },
    ],
  },
  2: {
    correct: [
      { key: "headlightOn", caption: "Rider switches on the headlight for visibility." },
      { key: "reduceSpeed", caption: "Rider slows down as the rain gets heavier." },
    ],
    wrong: [{ key: "lowVisSkid", caption: "Poor visibility catches the rider off guard…" }],
  },
  3: {
    correct: [{ key: "reduceSpeed", caption: "Rider eases off the throttle for better control." }],
    wrong: [{ key: "wobble", caption: "The bike loses grip on the wet surface…" }],
  },
  4: {
    correct: [{ key: "increaseDistance", caption: "Rider drops back for a longer following distance." }],
    wrong: [{ key: "closeCall", caption: "Too close — a sudden near miss!" }],
  },
  5: {
    correct: [{ key: "brakeSmooth", caption: "Rider brakes smoothly and stays in control." }],
    wrong: [{ key: "skid", caption: "Hard braking locks the wheel — the bike skids!" }],
  },
  6: {
    correct: [{ key: "avoidHazard", caption: "Rider slows and follows the shallowest, safest line.", duration: 1600 }],
    wrong: [{ key: "splashHit", caption: "The bike crosses deep water, wobbles, then regains control.", duration: 1700 }],
  },
  7: {
    correct: [{ key: "avoidHazard", caption: "Rider spots the hidden pothole and steers around it.", duration: 1450 }],
    wrong: [{ key: "potholeHit", caption: "The wheels pass over the pothole and the rider regains control.", duration: 1550 }],
  },
  8: {
    correct: [{ key: "stopForPedestrian", caption: "Rider slows and stops for the crossing pedestrians.", duration: 5600 }],
    wrong: [{ key: "nearMissPedestrian", caption: "A pedestrian jumps back — far too close!" }],
  },
  9: {
    correct: [{ key: "slowTurn", caption: "Rider slows down and leans gently through the curve.", duration: 5600 }],
    wrong: [{ key: "skidTurn", caption: "The tyres slide on the wet curve!", duration: 4300 }],
  },
  10: {
    correct: [{ key: "arriveDestination", caption: "Rider moves gently toward the Asian Paints entrance and stops safely.", duration: 1800 }],
    wrong: [{ key: "shakyArrival", caption: "A shaky final stretch, but the rider just makes it." }],
  },
};

export const DEFAULT_STEP_DURATION = 900;

export default scenarioActions;
