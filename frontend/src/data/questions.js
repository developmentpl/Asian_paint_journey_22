/**
 * Road Safety in Rain — Scenario / Question data (frontend copy)
 * ------------------------------------------------
 * Used to render scenario visuals (title, description, options, environment)
 * AND as the answer key: services/gameEngine.js scores each answer against
 * `correctAnswer` here.
 *
 * If you change a `correctAnswer` or reorder options, also update:
 *   - data/questions.hi.js (same option order, Hindi text)
 *   - ANSWER_KEY in google-apps-script/Code.gs (it re-scores the
 *     submitted answers before saving the result to the Sheet)
 */

export const questions = [
  {
    id: 1,
    title: "Preparing Before the Ride",
    description:
      "Dark clouds are gathering over the highway. Rain is expected any minute and the rider is about to start the journey.",
    question: "What should the rider do before setting off in expected rain?",
    options: [
      "Start immediately, deal with rain gear later",
      "Wear a helmet, raincoat and check tyre grip & headlight before riding",
      "Wait for rain to fully stop, even if it takes hours, without any preparation",
      "Remove the helmet since raincoats are enough protection",
    ],
    correctAnswer: 1,
    explanation:
      "Wearing a helmet and proper rain gear, and checking tyres and headlights beforehand, ensures the rider is visible and in control once the rain starts.",
    environment: "pre-ride",
  },
  {
    id: 2,
    title: "Heavy Rain Reduces Visibility",
    description:
      "Heavy rain suddenly begins. Visibility drops sharply and the road ahead is barely visible through the downpour.",
    question:
      "What should the rider do when heavy rain significantly reduces visibility?",
    options: [
      "Increase speed to get out of the rain faster",
      "Reduce speed and maintain a safe following distance",
      "Ride close behind another vehicle to use its tail lights as a guide",
      "Switch off the headlight to avoid glare",
    ],
    correctAnswer: 1,
    explanation:
      "Reducing speed and increasing the following distance gives the rider more time to react to hazards that are harder to see in heavy rain.",
    environment: "heavy-rain",
  },
  {
    id: 3,
    title: "Maintaining Safe Speed",
    description:
      "The rain has soaked the road surface completely. The rider notices the tyres feel less responsive than usual.",
    question: "How should the rider manage speed on a wet road?",
    options: [
      "Maintain normal dry-weather speed",
      "Ride significantly slower than usual to allow for reduced tyre grip",
      "Speed up on straight stretches and slow down only at turns",
      "Match the speed of the fastest vehicle on the road",
    ],
    correctAnswer: 1,
    explanation:
      "Wet roads drastically reduce tyre grip. Riding slower than normal compensates for the loss of traction and shortens stopping distance.",
    environment: "wet-road",
  },
  {
    id: 4,
    title: "Safe Following Distance",
    description:
      "Traffic ahead is moving steadily, but the road is slick with rainwater and spray from vehicle tyres.",
    question:
      "What following distance should the rider keep from the vehicle ahead in the rain?",
    options: [
      "The same distance as in dry weather",
      "A much longer distance than usual, since braking takes more time on wet roads",
      "As close as possible to save time",
      "No specific distance is necessary if visibility is fine",
    ],
    correctAnswer: 1,
    explanation:
      "Braking distances increase significantly on wet roads, so a longer following distance gives the rider enough time and space to stop safely.",
    environment: "traffic",
  },
  {
    id: 5,
    title: "Braking and Indicator Ahead",
    description:
      "The car ahead brakes and its indicator begins flashing, showing that it may turn or change direction in the rain.",
    question: "How should the rider respond when the car ahead brakes and shows an indicator?",
    options: [
      "Slam the front brake hard immediately",
      "Slow down with both brakes gently, increase the gap and let the car complete its move",
      "Overtake immediately from the side opposite the indicator",
      "Ignore it and maintain the same speed",
    ],
    correctAnswer: 1,
    explanation:
      "The indicator warns that the car may change direction. Slowing progressively and increasing the gap avoids wheel lock-up and gives it space to move safely.",
    environment: "braking",
  },
  {
    id: 6,
    title: "Waterlogged Road",
    description:
      "The road ahead disappears under a wide stretch of standing water from the heavy rain — a waterlogged patch across both lanes.",
    question: "How should the rider cross a waterlogged stretch of road?",
    options: [
      "Ride through at full speed to avoid the engine stalling",
      "Slow down, ride through the shallowest, most visible part at a steady low speed",
      "Stop in the middle of the water and wait",
      "Take a sharp U-turn without checking traffic behind",
    ],
    correctAnswer: 1,
    explanation:
      "Riding slowly and steadily through the shallowest visible section reduces the risk of losing control, stalling the engine, or hitting a hidden hazard.",
    environment: "waterlogged",
  },
  {
    id: 7,
    title: "Pothole Filled With Water",
    description:
      "A water-filled patch ahead is hiding something beneath the surface — it could be a deep pothole, invisible under the murky rainwater.",
    question:
      "What should the rider do about a water-filled patch that may hide a pothole?",
    options: [
      "Ride straight through it without slowing down",
      "Slow down and steer around it if safe, treating it as a possible pothole",
      "Accelerate to jump over it",
      "Close the eyes and hope for the best",
    ],
    correctAnswer: 1,
    explanation:
      "Water hides the true depth of potholes. Slowing down and safely steering around the patch avoids sudden jolts, loss of control, or tyre damage.",
    environment: "pothole",
  },
  {
    id: 8,
    title: "Pedestrian Crossing in the Rain",
    description:
      "Up ahead, a pedestrian crossing is visible. A few people are hurrying across, holding umbrellas, hard to see clearly through the rain.",
    question: "What should the rider do near a pedestrian crossing in the rain?",
    options: [
      "Speed up to pass before pedestrians reach the crossing",
      "Slow down, stay alert and be ready to stop for pedestrians",
      "Honk continuously and proceed without slowing down",
      "Ignore the crossing since visibility is poor anyway",
    ],
    correctAnswer: 1,
    explanation:
      "Rain reduces visibility for both riders and pedestrians. Slowing down and staying alert near crossings helps prevent accidents.",
    environment: "pedestrian",
  },
  {
    id: 9,
    title: "Turning on a Slippery Road",
    description:
      "The road curves ahead, glistening with rainwater. A sharp turn is coming up on the wet, slippery surface.",
    question: "How should the rider handle a turn on a wet, slippery road?",
    options: [
      "Lean sharply and take the turn at normal speed",
      "Slow down before the turn and take it gently with minimal lean",
      "Accelerate through the turn to maintain balance",
      "Brake hard while mid-turn",
    ],
    correctAnswer: 1,
    explanation:
      "Slowing down before the turn and leaning gently reduces the chance of the tyres losing grip on the wet surface, preventing skids.",
    environment: "turn",
  },
  {
    id: 10,
    title: "Safely Reaching the Destination",
    description:
      "The destination is finally in sight through the rain. The rider is tired, but the streetlights ahead mark the last stretch of the journey.",
    question:
      "As the rider nears the destination in fading light and rain, what is the safest approach?",
    options: [
      "Rush the last stretch since the journey is almost over",
      "Continue riding cautiously with headlight on, maintaining safe speed until fully parked",
      "Remove the raincoat early to feel more comfortable while still riding",
      "Stop paying attention since the destination is close",
    ],
    correctAnswer: 1,
    explanation:
      "Safety awareness must continue until the ride is completely finished — most accidents happen when riders relax too early near the end of a journey.",
    environment: "night-arrival",
  },
];



export default questions;
