/**
 * All non-scenario UI strings, in English and Hindi. Scenario content
 * (titles/questions/options/explanations) and action captions live in
 * data/questions.hi.js and data/scenarioActions.hi.js instead — this file
 * is everything else: screens, forms, HUD, feedback, scoreboard, review.
 *
 * Shape must stay identical between `en` and `hi` (same keys) since
 * components read through this via useLanguage().t without a fallback.
 */

const en = {
  languageSelect: {
    title: "Choose Your Language",
    subtitle: "Select the language you'd like to play in.",
    english: "English",
    hindi: "हिंदी",
    hint: "You can't change this once your journey begins.",
  },
  playerForm: {
    step: "Step 1 of 2",
    title: "Before You Ride…",
    subtitle: "Tell us who's taking on the rainy-road challenge.",
    nameLabel: "Full Name",
    namePlaceholder: "e.g. Saniya Sharma",
    emailLabel: "Email ID",
    emailPlaceholder: "e.g. saniya@company.com",
    nameError: "Please tell us your name — it can't be left empty.",
    emailRequiredError: "An email address is required.",
    emailInvalidError: "That doesn't look like a valid email address.",
    next: "Next",
  },
  employeeDetails: {
    step: "Step 2 of 2",
    title: "Employee Details",
    subtitle: "A couple more details before your journey begins.",
    idLabel: "Employee ID",
    idPlaceholder: "e.g. EMP00123",
    idError: "Employee ID is required.",
    plantLabel: "Plant",
    plantPlaceholder: "Select your plant",
    plantError: "Please select your plant.",
    back: "Back",
    continue: "Continue",
    settingUp: "Setting up…",
  },
  welcome: {
    eyebrow: (name) => `Hey ${name}, ready?`,
    title: "Welcome to the Road Safety in Rain Challenge",
    intro:
      "You are about to begin a rainy-day motorcycle journey. During your ride, you will face different road conditions and safety situations. Your decisions will determine how safely you reach your destination.",
    rules: [
      "10 road scenarios stand between you and the destination.",
      "Each scenario presents one safety decision to make.",
      "Every safe decision earns +10 points.",
      "An unsafe decision earns 0 points — but you'll see why.",
      "Maximum possible score: 100.",
      "After every answer, the correct choice and explanation are shown.",
    ],
    ctaHint: "Ride safe. Think fast. Reach the destination.",
    startJourney: "Play",
    mapTitle: "Your Rainy-Road Journey",
    mapSubtitle: "Navigate every challenge safely to reach your destination.",
    routeLabel: "10 safety challenges ahead",
    start: "START",
    destination: "DESTINATION",
    challenges: ["Pre-ride check", "Heavy rain", "Safe speed", "Following distance", "Smooth braking", "Waterlogging", "Pothole", "Pedestrian crossing", "Slippery turn", "Safe arrival"],
  },
  // NOTE: no "countdown" key here on purpose — the 3/2/1/GO! countdown is
  // intentionally hardcoded (not translated) in Countdown.jsx, since it
  // must render identically in English and Hindi. See that file's header
  // comment.
  hud: {
    rider: "Rider",
    score: "Score",
    scenario: (current, total) => `Scenario ${current} / ${total}`,
  },
  progress: {
    start: "START",
    destination: "DESTINATION",
  },
  scenario: {
    label: (n) => `Scenario ${n}`,
    checking: "Checking your decision…",
  },
  feedback: {
    safeDecision: "Correct",
    unsafeDecision: "Incorrect",
    correctAnswerLabel: "Correct answer:",
    continueJourney: "Continue Journey",
    finishJourney: "Finish Journey",
  },
  scoreboard: {
    heading: "Journey Completed!",
    playerLabel: "Player",
    employeeIdLabel: "Employee ID",
    plantLabel: "Plant",
    correctDecisions: "Correct Decisions",
    unsafeDecisions: "Unsafe Decisions",
    performance: {
      excellent: {
        label: "Excellent Safety Rider",
        message: "Excellent! You demonstrated strong awareness of safe riding practices during rainy conditions.",
      },
      good: {
        label: "Good Safety Awareness",
        message: "Good job! You understand most rainy-road safety practices, but there are a few areas you can improve.",
      },
      needsImprovement: {
        label: "Needs Improvement",
        message: "You completed the journey, but some decisions could put a rider at risk. Review the safety recommendations.",
      },
      trainingRecommended: {
        label: "Safety Training Recommended",
        message: "Several unsafe decisions were identified. Review the rainy-road safety guidelines before riding.",
      },
    },
  },
  resultsReview: {
    reviewButton: "Review Your Decisions",
    hideButton: "Hide",
    scenarioLabel: (n) => `Scenario ${n}`,
    correct: "✓ Correct",
    incorrect: "✕ Incorrect",
    yourAnswer: "Your answer:",
    correctAnswerLine: "Correct answer:",
  },
  results: {
    finish: "Finish",
    playAgain: "Play Again",
    thanksTitle: "Thanks for Riding Safely!",
    thanksBody: "Your journey and results have been saved. Stay safe out there — especially when it rains.",
  },
  errors: {
    startGameFailed: "Could not start the game. Please try again.",
    submitAnswerFailed: "Could not submit your answer.",
    generic: "Something went wrong. Please try again.",
  },
};

// Kept in simple, everyday spoken Hindi on purpose (short sentences,
// common words like "फैसला"/"स्टेज"/"मंज़िल"/"ज़रूरी" instead of literary
// Sanskrit-heavy alternatives like "निर्णय"/"परिदृश्य"/"गंतव्य"/"आवश्यक")
// so it reads as beginner-friendly, not textbook-formal.
const hi = {
  languageSelect: {
    title: "अपनी भाषा चुनें",
    subtitle: "वह भाषा चुनें जिसमें आप खेलना चाहते हैं।",
    english: "English",
    hindi: "हिंदी",
    hint: "यात्रा शुरू होने के बाद आप इसे बदल नहीं सकेंगे।",
  },
  playerForm: {
    step: "चरण 1 / 2",
    title: "सवारी शुरू करने से पहले…",
    subtitle: "हमें बताएं कि बारिश भरी सड़क की चुनौती कौन ले रहा है।",
    nameLabel: "पूरा नाम",
    namePlaceholder: "जैसे: सानिया शर्मा",
    emailLabel: "ईमेल आईडी",
    emailPlaceholder: "जैसे: saniya@company.com",
    nameError: "कृपया अपना नाम लिखें — इसे खाली नहीं छोड़ सकते।",
    emailRequiredError: "ईमेल पता डालना ज़रूरी है।",
    emailInvalidError: "यह सही ईमेल पता नहीं लग रहा।",
    next: "आगे",
  },
  employeeDetails: {
    step: "चरण 2 / 2",
    title: "कर्मचारी की जानकारी",
    subtitle: "यात्रा शुरू करने से पहले बस कुछ और जानकारी चाहिए।",
    idLabel: "कर्मचारी आईडी",
    idPlaceholder: "जैसे: EMP00123",
    idError: "कर्मचारी आईडी डालना ज़रूरी है।",
    plantLabel: "प्लांट",
    plantPlaceholder: "अपना प्लांट चुनें",
    plantError: "कृपया अपना प्लांट चुनें।",
    back: "पीछे",
    continue: "जारी रखें",
    settingUp: "तैयार किया जा रहा है…",
  },
  welcome: {
    eyebrow: (name) => `नमस्ते ${name}, तैयार हैं?`,
    title: "बारिश में सड़क सुरक्षा गेम में आपका स्वागत है",
    intro:
      "आप एक बरसाती दिन मोटरसाइकिल पर यात्रा शुरू करने वाले हैं। रास्ते में आपको अलग-अलग सड़क हालात मिलेंगे, और हर बार आपको एक सुरक्षित फैसला लेना होगा। आपके फैसले तय करेंगे कि आप कितनी सुरक्षित तरीके से अपनी मंज़िल तक पहुंचते हैं।",
    rules: [
      "आपकी मंज़िल तक पहुंचने से पहले 10 स्टेज आएंगे।",
      "हर स्टेज में आपको एक सुरक्षा फैसला लेना है।",
      "हर सही फैसले पर +10 अंक मिलेंगे।",
      "गलत फैसले पर 0 अंक मिलेंगे — लेकिन आपको वजह बताई जाएगी।",
      "सबसे ज़्यादा स्कोर: 100 अंक।",
      "हर जवाब के बाद, सही जवाब और उसकी वजह दिखाई जाएगी।",
    ],
    ctaHint: "सुरक्षित सवारी करें। जल्दी सोचें। मंज़िल तक पहुंचें।",
    startJourney: "यात्रा शुरू करें",
    mapTitle: "बारिश में आपकी यात्रा",
    mapSubtitle: "हर चुनौती को सुरक्षित पार करके मंज़िल तक पहुंचें।",
    routeLabel: "रास्ते में 10 सुरक्षा चुनौतियां",
    start: "शुरुआत",
    destination: "मंज़िल",
    challenges: ["सवारी से पहले जांच", "तेज़ बारिश", "सुरक्षित रफ़्तार", "सही दूरी", "आराम से ब्रेक", "सड़क पर पानी", "गड्ढा", "ज़ेब्रा क्रॉसिंग", "फिसलन भरा मोड़", "सुरक्षित मंज़िल"],
  },
  // NOTE: no "countdown" key here on purpose — see the English block above.
  hud: {
    rider: "सवार",
    score: "स्कोर",
    scenario: (current, total) => `स्टेज ${current} / ${total}`,
  },
  progress: {
    start: "शुरुआत",
    destination: "मंज़िल",
  },
  scenario: {
    label: (n) => `स्टेज ${n}`,
    checking: "आपका जवाब जांचा जा रहा है…",
  },
  feedback: {
    safeDecision: "सही",
    unsafeDecision: "गलत",
    correctAnswerLabel: "सही जवाब:",
    continueJourney: "यात्रा जारी रखें",
    finishJourney: "यात्रा खत्म करें",
  },
  scoreboard: {
    heading: "यात्रा पूरी हुई!",
    playerLabel: "खिलाड़ी",
    employeeIdLabel: "कर्मचारी आईडी",
    plantLabel: "प्लांट",
    correctDecisions: "सही फैसले",
    unsafeDecisions: "गलत फैसले",
    performance: {
      excellent: {
        label: "बेहतरीन सुरक्षित सवार",
        message: "शाबाश! बारिश में आपने बहुत ही सुरक्षित तरीके से सवारी की।",
      },
      good: {
        label: "अच्छी सुरक्षा समझ",
        message: "बढ़िया काम! आप ज़्यादातर बारिश में सड़क सुरक्षा के नियम समझते हैं, बस कुछ जगह और सीखने की ज़रूरत है।",
      },
      needsImprovement: {
        label: "थोड़ा और सीखने की ज़रूरत है",
        message: "आपने यात्रा पूरी कर ली, लेकिन कुछ फैसलों से सवार को खतरा हो सकता था। सुरक्षा से जुड़ी बातें एक बार फिर देख लें।",
      },
      trainingRecommended: {
        label: "सुरक्षा ट्रेनिंग लेने की सलाह",
        message: "कई गलत फैसले हुए। सवारी से पहले बारिश में सड़क सुरक्षा के नियम फिर से पढ़ लें।",
      },
    },
  },
  resultsReview: {
    reviewButton: "अपने फैसले फिर से देखें",
    hideButton: "छुपाएं",
    scenarioLabel: (n) => `स्टेज ${n}`,
    correct: "✓ सही",
    incorrect: "✕ गलत",
    yourAnswer: "आपका जवाब:",
    correctAnswerLine: "सही जवाब:",
  },
  results: {
    finish: "खत्म करें",
    playAgain: "फिर से खेलें",
    thanksTitle: "सुरक्षित सवारी के लिए धन्यवाद!",
    thanksBody: "आपकी यात्रा और स्कोर सेव हो गए हैं। हमेशा सुरक्षित रहें — खासकर जब बारिश हो रही हो।",
  },
  errors: {
    startGameFailed: "गेम शुरू नहीं हो सका। कृपया दोबारा कोशिश करें।",
    submitAnswerFailed: "आपका जवाब भेजा नहीं जा सका।",
    generic: "कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।",
  },
};

export const uiText = { en, hi };
export default uiText;
