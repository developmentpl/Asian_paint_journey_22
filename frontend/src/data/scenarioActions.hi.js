/**
 * Per-scenario visual "action" sequences (Hindi captions).
 *
 * MUST mirror frontend/src/data/scenarioActions.js exactly in `key` and
 * `duration` values — those drive MotorcycleRider's CSS states and
 * ScenarioActionController's timing. Only `caption` text is translated.
 *
 * Kept in simple, everyday spoken Hindi (see the matching note in
 * questions.hi.js) rather than formal/literary wording.
 */

export const scenarioActions = {
  1: {
    correct: [
      { key: "wearHelmet", caption: "सवार हेलमेट पहनता है।" },
      { key: "wearRaincoat", caption: "सवार रेनकोट पहनता है।" },
      { key: "checkFrontTyre", caption: "सवार आगे के टायर की पकड़ जांचता है।" },
      { key: "checkRearTyre", caption: "सवार पीछे के टायर की पकड़ जांचता है।" },
      { key: "headlightOn", caption: "सवार हेडलाइट जांचकर चालू करता है।" },
      { key: "checkComplete", caption: "सवारी से पहले की जांच पूरी ✓ +10", duration: 1400 },
    ],
    wrong: [
      { key: "noGear", caption: "सवार बिना सुरक्षा गियर के निकल पड़ता है…" },
      { key: "exposedRider", caption: "आगे की बारिश के लिए तैयार नहीं।" },
    ],
  },
  2: {
    correct: [
      { key: "headlightOn", caption: "सवार बेहतर दिखने के लिए हेडलाइट चालू करता है।" },
      { key: "reduceSpeed", caption: "बारिश तेज़ होने पर सवार रफ़्तार धीमी करता है।" },
    ],
    wrong: [{ key: "lowVisSkid", caption: "साफ न दिखने से सवार अचानक चौंक जाता है…" }],
  },
  3: {
    correct: [{ key: "reduceSpeed", caption: "बेहतर कंट्रोल के लिए सवार थ्रॉटल धीमा करता है।" }],
    wrong: [{ key: "wobble", caption: "बाइक गीली सतह पर पकड़ खो देती है…" }],
  },
  4: {
    correct: [{ key: "increaseDistance", caption: "सवार ज़्यादा दूरी बनाने के लिए पीछे हो जाता है।" }],
    wrong: [{ key: "closeCall", caption: "बहुत पास आ गया — बाल-बाल बचाव!" }],
  },
  5: {
    correct: [{ key: "brakeSmooth", caption: "सवार आराम से ब्रेक लगाता है और कंट्रोल में रहता है।" }],
    wrong: [{ key: "skid", caption: "तेज़ ब्रेक लगाने से पहिया जाम हो जाता है — बाइक फिसल जाती है!" }],
  },
  6: {
    correct: [{ key: "avoidHazard", caption: "सवार धीमा होकर सबसे कम पानी वाले सुरक्षित रास्ते से निकलता है।", duration: 1600 }],
    wrong: [{ key: "splashHit", caption: "बाइक गहरे पानी से गुजरती है, थोड़ी डगमगाती है और फिर संभल जाती है।", duration: 1700 }],
  },
  7: {
    correct: [{ key: "avoidHazard", caption: "सवार छिपे गड्ढे को देख लेता है और उसके बगल से निकल जाता है।", duration: 1450 }],
    wrong: [{ key: "potholeHit", caption: "दोनों पहिए गड्ढे से गुजरते हैं और सवार फिर संभल जाता है।", duration: 1550 }],
  },
  8: {
    correct: [{ key: "stopForPedestrian", caption: "सवार धीमा होकर सड़क पार करते लोगों के लिए रुक जाता है।" }],
    wrong: [{ key: "nearMissPedestrian", caption: "एक पैदल यात्री पीछे कूदता है — बहुत ज़्यादा पास!" }],
  },
  9: {
    correct: [{ key: "slowTurn", caption: "सवार रफ़्तार धीमी करता है और मोड़ में आराम से झुकता है।", duration: 5600 }],
    wrong: [{ key: "skidTurn", caption: "गीले मोड़ पर टायर फिसल जाते हैं!", duration: 4300 }],
  },
  10: {
    correct: [{ key: "arriveDestination", caption: "सवार एशियन पेंट्स के प्रवेश द्वार की ओर धीरे आगे बढ़ता है और सुरक्षित रुकता है।", duration: 1800 }],
    wrong: [{ key: "shakyArrival", caption: "आखिरी हिस्सा डगमगाया, लेकिन सवार किसी तरह पहुंच ही जाता है।" }],
  },
};

export const DEFAULT_STEP_DURATION = 900;

export default scenarioActions;
