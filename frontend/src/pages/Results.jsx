import { useEffect, useMemo, useRef, useState } from "react";
import ScoreBoard from "../components/ScoreBoard.jsx";
import ResultsReview from "../components/ResultsReview.jsx";
import { GameEngine } from "../services/gameEngine.js";
import { saveResultToSheet } from "../services/googleSheets.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import RainEffect from "../components/RainEffect.jsx";
import { useAudio } from "../components/AudioManager.jsx";
import resultsEnglishAudio from "../assets/audio/results-en.mp3";
import finishEnglishAudio from "../assets/audio/finish-en.mp3";
import resultsHindiAudio from "../assets/audio/results-hi.mp3";
import finishHindiAudio from "../assets/audio/finish-hi.mp3";

/**
 * Results page — loads the final results from the game engine and shows
 * the scoreboard, performance message, decision review and the
 * Play Again / Finish actions.
 */
export default function Results({ player, sessionId, onPlayAgain }) {
  const { t, questions, language } = useLanguage();
  const { playNarration, stopNarration } = useAudio();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [resultSaveError, setResultSaveError] = useState("");
  const resultSaveLockRef = useRef(false);
  const playedScreenAudioRef = useRef(null);

  useEffect(() => {
    GameEngine.getResults(sessionId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [sessionId]);

  useEffect(() => {
    if (!data) return;
    const screenAudio = finished ? "finish" : "scoreboard";
    const playbackKey = `${language}-${screenAudio}`;
    if (playedScreenAudioRef.current === playbackKey) return;
    const source = language === "hi"
      ? (finished ? finishHindiAudio : resultsHindiAudio)
      : (finished ? finishEnglishAudio : resultsEnglishAudio);
    if (playNarration(source)) playedScreenAudioRef.current = playbackKey;
  }, [data, finished, language, playNarration]);

  // The engine returns question/options/explanation in English. Swap that
  // display text for the current language's copy, matched by questionId;
  // selectedAnswer/correctAnswer/isCorrect are option indices, so they
  // stay the same in every language.
  const localizedReview = useMemo(() => {
    if (!data?.review) return null;
    return data.review.map((item) => {
      const q = questions.find((q2) => q2.id === item.questionId);
      return q ? { ...item, question: q.question, options: q.options, explanation: q.explanation } : item;
    });
  }, [data, questions]);

  async function saveFinalResultOnce() {
    if (resultSaved) return true;
    if (resultSaveLockRef.current) return false;

    resultSaveLockRef.current = true;
    setIsSavingResult(true);
    setResultSaveError("");
    try {
      await saveResultToSheet({
        sessionId: player?.sheetSessionId,
        gameDurationSeconds: player?.gameDurationSeconds ?? null,
        answers: data.answers,
        language: language === "hi" ? "Hindi" : "English",
      });
      setResultSaved(true);
      return true;
    } catch (saveError) {
      setResultSaveError(saveError.message || "The final result could not be saved.");
      return false;
    } finally {
      resultSaveLockRef.current = false;
      setIsSavingResult(false);
    }
  }

  async function handlePlayAgain() {
    if (await saveFinalResultOnce()) {
      stopNarration();
      onPlayAgain();
    }
  }

  async function handleFinish() {
    if (await saveFinalResultOnce()) setFinished(true);
  }

  if (error) {
    return (
      <div className="screen-center">
        <p className="global-error">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="screen-center">
        <div className="loader" />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="rain-backdrop">
        <div className="screen-center">
          <div className="glass-card welcome-card">
            <h1 className="welcome-title">{t.results.thanksTitle}</h1>
            <p className="welcome-intro">{t.results.thanksBody}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rain-backdrop results-screen">
      <div className="results-destination-backdrop" aria-hidden="true">
        <div className="results-destination-sky" />
        <div className="results-destination-plant"><b>ASIAN PAINTS</b><span>PLANT</span><i/><i/><i/><i/><i/><i/></div>
        <div className="results-destination-gate"><span>WELCOME</span></div>
        <div className="results-destination-road"><i/></div>
        <div className="results-parked-bike"><i/><i/><b>RIDER</b></div>
        <div className="results-destination-light results-light-one"><i/></div>
        <div className="results-destination-light results-light-two"><i/></div>
        <div className="results-ambient-orb results-orb-one" />
        <div className="results-ambient-orb results-orb-two" />
      </div>
      <RainEffect intensity="light" />
      <div className="screen-center">
        <div className="glass-card results-card results-card-reveal">
          <ScoreBoard player={player || data.player} session={data.session} />
          <ResultsReview review={localizedReview} />
          {resultSaveError && <p className="global-error">{resultSaveError}</p>}
          <div className="btn-row results-actions">
            <button type="button" className="btn btn-primary results-play-again" onClick={handlePlayAgain} disabled={isSavingResult}>
              {t.results.playAgain}
            </button>
            <button type="button" className="btn btn-ghost results-finish" onClick={handleFinish} disabled={isSavingResult}>
              {t.results.finish}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
