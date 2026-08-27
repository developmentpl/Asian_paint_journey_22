import { useEffect, useRef, useState } from "react";
import GameScene from "../components/GameScene.jsx";
import { GameAPI } from "../services/api.js";
import { useAudio } from "../components/AudioManager.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import scenarioAudio from "../data/scenarioAudio.js";

/**
 * Phase state machine for a single scenario, per the spec:
 *   question -> answerSelected -> animation -> feedback -> readyToContinue
 *
 * - question: scenario + answer buttons are live.
 * - answerSelected: a choice was clicked; buttons lock immediately and we
 *   wait on the backend to score it (source of truth — never scored
 *   client-side).
 * - animation: ScenarioController plays the rider's real-time
 *   action (correct path) or consequence (wrong path) for this scenario.
 * - feedback: the explanation card appears (points/heading/explanation).
 * - readyToContinue: a short beat later, the Continue Journey button
 *   appears — this is the only way to advance, so the game never jumps
 *   straight to the next question on its own.
 */
const PHASE = {
  HAZARD: "hazard",
  DECELERATING: "decelerating",
  QUESTION: "question",
  ANSWER_SELECTED: "answerSelected",
  ANSWER_REVEAL: "answerReveal",
  ANIMATION: "animation",
  ADVANCING: "advancing",
  FEEDBACK: "feedback",
  READY: "readyToContinue",
};

const HAZARD_PREVIEW_MS = 1400;
const DECELERATION_MS = 1050;
const ANSWER_REVEAL_MS = 1050;
const RIDER_ADVANCE_MS = 750;

export default function Game({ player, sessionId, onComplete }) {
  const { language, t, questions, scenarioActions } = useLanguage();
  const MAX_SCORE = questions.length * 10;
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // 0-based into `questions`
  const [journeyProgress, setJourneyProgress] = useState(0); // advances only for correct answers
  const [session, setSession] = useState(null);
  const [phase, setPhase] = useState(PHASE.HAZARD);
  const [feedback, setFeedback] = useState(null);
  const [actionSteps, setActionSteps] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [sceneHoldAction, setSceneHoldAction] = useState(null);
  const [geared, setGeared] = useState(false); // helmet + raincoat, equipped after Scenario 1
  const [error, setError] = useState("");
  const { startAmbience, stopAmbience, playEffect, playEffectAndWait, playNarration, playNarrationAndWait, stopNarration } = useAudio();
  const completingRef = useRef(false);
  const pendingSessionRef = useRef(null);
  const questionNarratedRef = useRef(null);
  const explanationNarratedRef = useRef(null);
  const answerInFlightRef = useRef(false);
  const scenarioOneRemediationRef = useRef(false);

  // Recover true progress from the backend (refresh protection). The
  // backend only tracks answered-question IDs, not per-question
  // correctness for an in-progress session (that's only summarized once
  // COMPLETED), so on resume past Scenario 1 we assume gear was earned —
  // a harmless cosmetic default that never touches scoring.
  useEffect(() => {
    let cancelled = false;
    GameAPI.getSession(sessionId)
      .then((data) => {
        if (cancelled) return;
        setSession(data.session);
        setJourneyProgress(Math.min(questions.length, Math.round((data.session?.score || 0) / 10)));
        const resumeIndex = Math.min(data.answeredQuestionIds.length, questions.length - 1);
        setCurrentIndex(resumeIndex);
        if (resumeIndex > 0) setGeared(true);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!loading) startAmbience();
    return () => stopAmbience();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // After a correct safety animation, leave the road unobstructed long
  // enough for the fixed rider/progress movement to be clearly seen.
  useEffect(() => {
    if (phase !== PHASE.ADVANCING) return undefined;
    const timer = setTimeout(() => setPhase(PHASE.FEEDBACK), RIDER_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  const scenario = questions[currentIndex];

  useEffect(() => {
    answerInFlightRef.current = false;
    scenarioOneRemediationRef.current = false;
    questionNarratedRef.current = null;
    explanationNarratedRef.current = null;
    stopNarration();
    return () => stopNarration();
  }, [scenario.id, stopNarration]);

  useEffect(() => {
    const audio = scenarioAudio[language]?.[scenario.id];
    if (phase !== PHASE.QUESTION || !audio?.questionAudio) return;
    if (questionNarratedRef.current === scenario.id) return;
    if (playNarration(audio.questionAudio, "question")) questionNarratedRef.current = scenario.id;
  }, [language, phase, scenario.id, playNarration]);

  useEffect(() => {
    const audio = scenarioAudio[language]?.[scenario.id];
    if (phase !== PHASE.FEEDBACK) return undefined;
    if (explanationNarratedRef.current === scenario.id) return;
    explanationNarratedRef.current = scenario.id;

    if (!audio?.explanationAudio) {
      setPhase(PHASE.READY);
      return undefined;
    }

    playNarrationAndWait(audio.explanationAudio, "explanation").then(() => {
      setPhase((currentPhase) => currentPhase === PHASE.FEEDBACK ? PHASE.READY : currentPhase);
    });
    return undefined;
  }, [language, phase, scenario.id, playNarrationAndWait]);

  // Give every hazard a clean, unobstructed establishing shot before the
  // decision UI appears. This repeats for every scenario/camera change.
  useEffect(() => {
    if (loading || phase !== PHASE.HAZARD) return undefined;
    const timer = setTimeout(() => setPhase(PHASE.DECELERATING), HAZARD_PREVIEW_MS);
    return () => clearTimeout(timer);
  }, [loading, phase, currentIndex]);

  useEffect(() => {
    if (phase !== PHASE.DECELERATING) return undefined;
    const timer = setTimeout(() => setPhase(PHASE.QUESTION), DECELERATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  async function handleAnswer(selectedAnswer) {
    if (phase !== PHASE.QUESTION || answerInFlightRef.current) return;
    answerInFlightRef.current = true;
    stopNarration();
    setPhase(PHASE.ANSWER_SELECTED);
    setError("");
    try {
      const data = await GameAPI.submitAnswer({
        sessionId,
        questionId: scenario.id,
        selectedAnswer,
      });

      if (!data.success && !data.alreadyAnswered) {
        answerInFlightRef.current = false;
        setError(data.message || t.errors.submitAnswerFailed);
        setPhase(PHASE.QUESTION); // nothing was recorded — let the player try again
        return;
      }

      // The backend's result.explanation is always English (backend/data/
      // questions.js is untouched by the language feature — it's only the
      // scoring source of truth). Swap in the current language's local
      // explanation text for this scenario before showing it; isCorrect/
      // pointsAwarded stay exactly as the backend computed them.
      const result = { ...data.result, explanation: scenario.explanation };
      setFeedback(result);
      if (data.session) {
        if (scenario.id === 1 && result.isCorrect) pendingSessionRef.current = data.session;
        else setSession(data.session);
      }

      // Audio plays as soon as the answer is checked, before the visual
      // action sequence — per the required order (check -> audio -> visual).
      const feedbackEffect = result.isCorrect ? "correct" : "wrong";
      await playEffectAndWait(language === "hi" ? `${feedbackEffect}-hi` : feedbackEffect);

      const stepSet = scenarioActions[scenario.id];
      const scenarioOneSafetySteps = (stepSet?.correct || []).map((step) => (
        !result.isCorrect && step.key === "checkComplete"
          ? { ...step, caption: step.caption.replace(/\s*[✓✔]?\s*\+10\s*$/, "") }
          : step
      ));
      // Unsafe answers stay at the current road position. The correct
      // action is demonstrated on the separate feedback screen instead.
      const steps = scenario.id === 1
        ? scenarioOneSafetySteps
        : scenario.id === 10
        ? (stepSet?.correct || [])
        : result.isCorrect
          ? (stepSet?.correct || [])
          : ([6, 7, 9].includes(scenario.id) ? (stepSet?.wrong || []) : []);
      setActionSteps(steps);
      // Hold on the marked A/B/C/D choices before returning to the road
      // action. Correct is green; a wrong choice is red while the right
      // choice is simultaneously green.
      setPhase(PHASE.ANSWER_REVEAL);
    } catch (err) {
      answerInFlightRef.current = false;
      setError(err.message);
      setPhase(PHASE.QUESTION);
    }
  }

  useEffect(() => {
    if (phase !== PHASE.ANSWER_REVEAL) return undefined;
    const timer = setTimeout(() => {
      if (scenario.id === 1 && !feedback?.isCorrect) setPhase(PHASE.FEEDBACK);
      else if (actionSteps?.length && (feedback?.isCorrect || [1, 6, 7, 9, 10].includes(scenario.id))) setPhase(PHASE.ANIMATION);
      else setPhase(PHASE.FEEDBACK);
    }, ANSWER_REVEAL_MS);
    return () => clearTimeout(timer);
  }, [phase, actionSteps, feedback]);

  async function handleAnimationComplete() {
    if (scenario.id === 1) {
      setGeared(true);
      if (pendingSessionRef.current) {
        setSession(pendingSessionRef.current);
        pendingSessionRef.current = null;
      }
    }

    if (scenario.id === 1 && scenarioOneRemediationRef.current) {
      scenarioOneRemediationRef.current = false;
      setFeedback(null);
      setActionSteps(null);
      setActiveAction(null);
      setSceneHoldAction(null);
      setPhase(PHASE.HAZARD);
      setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
      return;
    }
    if (feedback?.isCorrect) {
      setJourneyProgress((value) => Math.min(questions.length, value + 1));
      setSceneHoldAction(actionSteps?.[actionSteps.length - 1]?.key || null);
    }
    setActiveAction(null);

    setPhase(feedback?.isCorrect ? PHASE.ADVANCING : PHASE.FEEDBACK);
  }

  async function handleContinue() {
    if (phase !== PHASE.READY) return; // Continue only does anything once the player has actually reached it

    if (scenario.id === 1 && !feedback?.isCorrect && actionSteps?.length) {
      stopNarration();
      scenarioOneRemediationRef.current = true;
      setPhase(PHASE.ANIMATION);
      return;
    }

    const isLast = currentIndex >= questions.length - 1;

    setFeedback(null);
    setActionSteps(null);
    setActiveAction(null);

    if (isLast) {
      if (completingRef.current) return;
      completingRef.current = true;
      try {
        await GameAPI.complete(sessionId);
        stopAmbience();
        playEffect("complete");
        onComplete();
      } catch (err) {
        setError(err.message);
        completingRef.current = false;
        setPhase(PHASE.READY);
      }
      return;
    }

    setSceneHoldAction(null);
    setPhase(PHASE.HAZARD);
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  }

  if (loading) {
    return (
      <div className="screen-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <>
      {error && <p className="global-error global-error-floating">{error}</p>}
      <GameScene
        scenario={scenario}
        phase={phase}
        hud={{
          playerName: player.name,
          current: currentIndex + 1,
          total: questions.length,
          score: session?.score ?? 0,
          maxScore: MAX_SCORE,
          journeyProgress,
        }}
        feedback={feedback}
        actionSteps={actionSteps}
        activeAction={activeAction}
        geared={geared}
        onAnswer={handleAnswer}
        onStepChange={setActiveAction}
        onAnimationComplete={handleAnimationComplete}
        onContinue={handleContinue}
        isLastScenario={currentIndex >= questions.length - 1}
        journeyProgress={journeyProgress}
        correctActions={scenarioActions[scenario.id]?.correct || []}
        sceneHoldAction={sceneHoldAction}
      />
    </>
  );
}
