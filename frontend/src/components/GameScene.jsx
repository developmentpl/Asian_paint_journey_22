import RoadEnvironment from "./RoadEnvironment.jsx";
import ScoreHUD from "./ScoreHUD.jsx";
import QuestionPanel from "./QuestionPanel.jsx";
import FeedbackModal from "./FeedbackModal.jsx";
import ScenarioController from "./ScenarioController.jsx";
import { roadSceneConfig } from "../data/roadSceneConfig.js";

/**
 * GameScene — composes the animated rainy-road scene, the HUD, the
 * current scenario/question, and the post-answer action/feedback flow
 * into one full-screen gameplay view.
 *
 * `phase` drives what's on screen, per the state machine owned by
 * Game.jsx: 'question' -> 'answerSelected' -> 'animation' -> 'feedback'
 * -> 'readyToContinue'. The bike scene (and the rider on it) stays
 * mounted across every phase; only the foreground panel changes.
 */
export default function GameScene({
  scenario,
  phase,
  hud,
  feedback,
  actionSteps,
  activeAction,
  geared,
  splash,
  onAnswer,
  onStepChange,
  onAnimationComplete,
  onContinue,
  isLastScenario,
  journeyProgress,
  correctActions,
  sceneHoldAction,
}) {
  const isQuestion = phase === "question";
  const isAnswering = phase === "answerSelected";
  const isAnswerReveal = phase === "answerReveal";
  const isAnimating = phase === "animation";
  const showFeedback = phase === "feedback" || phase === "readyToContinue";
  const readyToContinue = phase === "readyToContinue";
  const riderPercent = 18 + journeyProgress * 6;
  const sceneConfig = roadSceneConfig[scenario.id];
  const isFpv = sceneConfig?.camera === "fpv";
  const questionSide = scenario.id === 9 ? "right" : (isFpv ? "left" : (riderPercent < 50 ? "right" : "left"));
  const motionState = phase === "hazard"
    ? "riding"
    : phase === "decelerating"
      ? "decelerating"
      : (isAnimating || phase === "advancing" || showFeedback)
        ? "accelerating"
        : "stopped";

  return (
    <div className="game-screen">
      <RoadEnvironment
        sceneConfig={sceneConfig}
        splash={splash}
        geared={geared}
        scenarioId={scenario.id}
        activeAction={isAnimating ? activeAction : sceneHoldAction}
        journeyProgress={journeyProgress}
        paused={motionState === "stopped"}
        motionState={motionState}
      />
      <ScoreHUD {...hud} />

      {/* Scenario renders its own two pieces (a compact floating intro
          card during the situation beat, then a slim answer dock once the
          question appears) so the road scene behind it — the rider,
          traffic, hazards — stays visible instead of a big card covering
          the lower half of the screen. The answer panel stays mounted
          (and, once answered, red/green highlighted) all the way through
          animation and feedback — it does NOT disappear the moment a
          choice is made, which is what keeps that result visible while
          the rider's action/consequence plays and the explanation shows. */}
      <QuestionPanel
        scenario={scenario}
        onAnswer={onAnswer}
        disabled={!isQuestion}
        checking={isAnswering}
        feedback={feedback}
        phase={phase}
        visible={isQuestion || isAnswering || isAnswerReveal}
        side={questionSide}
        isFpv={isFpv}
      />

      <ScenarioController
        steps={actionSteps}
        running={isAnimating}
        onStepChange={onStepChange}
        onComplete={onAnimationComplete}
      />

      {showFeedback && (
        <FeedbackModal
          feedback={feedback}
          correctAnswerText={scenario.options[feedback?.correctAnswer ?? 0]}
          onContinue={onContinue}
          isLastScenario={isLastScenario}
          readyToContinue={readyToContinue}
          scenario={scenario}
          sceneConfig={sceneConfig}
          correctActions={correctActions}
          geared={geared || (scenario.id === 1 && feedback?.isCorrect)}
          journeyProgress={journeyProgress}
        />
      )}
    </div>
  );
}
