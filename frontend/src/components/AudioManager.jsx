import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import backgroundMusic from "../assets/audio/background.mp3";
import rainSound from "../assets/audio/rain.mp3";
import correctSound from "../assets/audio/correct.mp3";
import wrongSound from "../assets/audio/wrong.mp3";
import correctHindiSound from "../assets/audio/correct-hi.mp3";
import wrongHindiSound from "../assets/audio/wrong-hi.mp3";
import countdownSound from "../assets/audio/countdown.mp3";
import completeSound from "../assets/audio/game-complete.mp3";

/**
 * Centralized audio manager.
 * - Background music + rain ambience loop continuously while unmuted.
 * - One-shot effects (correct/wrong/countdown/complete) play on demand.
 * - A single mute switch controls everything so the whole game can be
 *   silenced with one click (required for shared-desk / factory floor use).
 *
 * Replace the files in src/assets/audio/ to change any sound —
 * no code changes required as long as filenames stay the same.
 */
const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [audioStage, setAudioStage] = useState("idle");
  const bgRef = useRef(null);
  const rainRef = useRef(null);
  const ambienceEnabledRef = useRef(false);
  const narrationRef = useRef(null);
  const narrationFinishRef = useRef(null);
  const effectRef = useRef(null);
  const effectFinishRef = useRef(null);
  const effectRefs = useRef({});

  useEffect(() => {
    const bg = new Audio(backgroundMusic);
    bg.loop = true;
    bg.volume = 0.18;
    bgRef.current = bg;

    const rain = new Audio(rainSound);
    rain.loop = true;
    rain.volume = 0.25;
    rainRef.current = rain;

    effectRefs.current = {
      correct: correctSound,
      wrong: wrongSound,
      "correct-hi": correctHindiSound,
      "wrong-hi": wrongHindiSound,
      countdown: countdownSound,
      complete: completeSound,
    };

    return () => {
      bg.pause();
      rain.pause();
      narrationRef.current?.pause();
      narrationFinishRef.current?.();
      effectRef.current?.pause();
      effectFinishRef.current?.();
    };
  }, []);

  useEffect(() => {
    const bg = bgRef.current;
    const rain = rainRef.current;
    if (!bg || !rain) return;
    if (isMuted) {
      bg.pause();
      rain.pause();
      narrationRef.current?.pause();
      narrationFinishRef.current?.();
      effectRef.current?.pause();
      effectFinishRef.current?.();
    } else if (ambienceEnabledRef.current) {
      // Muting pauses the looping ambience. Explicitly restart it here so
      // unmuting always restores sound without changing volume to zero.
      bg.play().catch(() => {});
      rain.play().catch(() => {});
    }
  }, [isMuted]);

  const startAmbience = useCallback(() => {
    ambienceEnabledRef.current = true;
    if (isMuted) return;
    bgRef.current?.play().catch(() => {});
    rainRef.current?.play().catch(() => {});
  }, [isMuted]);

  const stopAmbience = useCallback(() => {
    ambienceEnabledRef.current = false;
    bgRef.current?.pause();
    rainRef.current?.pause();
  }, []);

  const stopEffect = useCallback(() => {
    const effect = effectRef.current;
    if (effect) {
      effect.pause();
      effect.currentTime = 0;
      effectFinishRef.current?.();
    }
  }, []);

  const playEffect = useCallback(
    (name) => {
      if (isMuted) return false;
      const src = effectRefs.current[name];
      if (!src) return false;

      stopEffect();
      const audio = new Audio(src);
      audio.volume = 0.7;
      effectRef.current = audio;
      setAudioStage("answerSfx");
      const finish = () => {
        if (effectRef.current === audio) effectRef.current = null;
        if (effectFinishRef.current === finish) effectFinishRef.current = null;
        setAudioStage("idle");
      };
      effectFinishRef.current = finish;
      audio.addEventListener("ended", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
      audio.play().catch(finish);
      return true;
    },
    [isMuted, stopEffect]
  );

  // Used when the flow must wait for a spoken feedback clip before the
  // scenario animation begins. Muting or replacing the clip resolves the
  // wait immediately, so the game can never become stuck on audio.
  const playEffectAndWait = useCallback(
    (name) => new Promise((resolve) => {
      if (isMuted) {
        resolve(false);
        return;
      }
      const src = effectRefs.current[name];
      if (!src) {
        resolve(false);
        return;
      }

      stopEffect();

      const audio = new Audio(src);
      audio.volume = 0.7;
      effectRef.current = audio;
      setAudioStage("answerSfx");
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (effectRef.current === audio) effectRef.current = null;
        if (effectFinishRef.current === finish) effectFinishRef.current = null;
        setAudioStage("idle");
        resolve(true);
      };
      effectFinishRef.current = finish;
      audio.addEventListener("ended", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
      audio.play().catch(finish);
    }),
    [isMuted, stopEffect]
  );

  const stopNarration = useCallback(() => {
    const narration = narrationRef.current;
    if (narration) {
      narration.pause();
      narration.currentTime = 0;
      narrationFinishRef.current?.();
    }
    if (bgRef.current) bgRef.current.volume = 0.18;
    if (rainRef.current) rainRef.current.volume = 0.25;
  }, []);

  const playNarration = useCallback(
    (src, stage = "question") => {
      stopNarration();
      stopEffect();
      if (isMuted || !src) return false;

      const narration = new Audio(src);
      narration.preload = "auto";
      narration.volume = 0.9;
      narrationRef.current = narration;
      setAudioStage(stage);

      // Duck ambience without stopping it, then restore it when narration ends.
      if (bgRef.current) bgRef.current.volume = 0.06;
      if (rainRef.current) rainRef.current.volume = 0.1;

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (narrationRef.current === narration) narrationRef.current = null;
        if (narrationFinishRef.current === finish) narrationFinishRef.current = null;
        if (bgRef.current) bgRef.current.volume = 0.18;
        if (rainRef.current) rainRef.current.volume = 0.25;
        setAudioStage("idle");
      };
      narrationFinishRef.current = finish;
      narration.addEventListener("ended", finish, { once: true });
      narration.addEventListener("error", finish, { once: true });
      narration.play().catch(finish);
      return true;
    },
    [isMuted, stopEffect, stopNarration]
  );

  const playNarrationAndWait = useCallback(
    (src, stage = "explanation") => new Promise((resolve) => {
      stopNarration();
      stopEffect();
      if (isMuted || !src) {
        resolve(false);
        return;
      }

      const narration = new Audio(src);
      narration.preload = "auto";
      narration.volume = 0.9;
      narrationRef.current = narration;
      setAudioStage(stage);
      if (bgRef.current) bgRef.current.volume = 0.06;
      if (rainRef.current) rainRef.current.volume = 0.1;

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (narrationRef.current === narration) narrationRef.current = null;
        if (narrationFinishRef.current === finish) narrationFinishRef.current = null;
        if (bgRef.current) bgRef.current.volume = 0.18;
        if (rainRef.current) rainRef.current.volume = 0.25;
        setAudioStage("idle");
        resolve(true);
      };
      narrationFinishRef.current = finish;
      narration.addEventListener("ended", finish, { once: true });
      narration.addEventListener("error", finish, { once: true });
      narration.play().catch(finish);
    }),
    [isMuted, stopEffect, stopNarration]
  );

  const toggleMute = useCallback(() => setIsMuted((muted) => !muted), []);

  return (
    <AudioContext.Provider
      value={{ audioStage, isMuted, toggleMute, startAmbience, stopAmbience, playEffect, playEffectAndWait, playNarration, playNarrationAndWait, stopNarration }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
}

/** Small floating mute/unmute control, usable on any screen. */
export function MuteButton({ className = "" }) {
  const { isMuted, toggleMute } = useAudio();
  return (
    <button
      type="button"
      className={`mute-btn ${className}`}
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      title={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
}
