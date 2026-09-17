import { useCallback, useEffect, useState } from "react";
import Registration from "./pages/Registration.jsx";
import Instructions from "./pages/Instructions.jsx";
import Game from "./pages/Game.jsx";
import Results from "./pages/Results.jsx";
import LanguageSelection from "./components/LanguageSelection.jsx";
import { AudioProvider, MuteButton } from "./components/AudioManager.jsx";
import brandLogo from "./assets/images/brand-logo.png";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext.jsx";
import { GameEngine } from "./services/gameEngine.js";

const STORAGE_KEY = "roadSafetyGame.session";

function loadStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* sessionStorage may be unavailable in some contexts; game still works,
       it just won't survive a refresh. */
  }
}

function clearStoredSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

/**
 * AppShell — top-level screen router / state machine. Rendered inside
 * <LanguageProvider> by the default-exported App() below, so it can read
 * the current language via useLanguage().
 *
 * screen order: 'registration' (name+email, then employee id+plant) ->
 * 'language' (Hindi/English) -> 'welcome' (instructions in that language,
 * then its own internal 3-2-1-GO countdown) -> 'game' -> 'results'.
 * Registration itself is always shown in English (the player hasn't
 * picked a language yet at that point) — every screen from 'welcome'
 * onward reads through useLanguage() so it switches the instant a
 * language is chosen.
 *
 * Game state (score, progress, status) is kept by services/gameEngine.js,
 * which stores it in sessionStorage so a refresh resumes the same game.
 * STORAGE_KEY here only remembers *which* session/player to reconnect to.
 * The selected language is stored the same way (see i18n/LanguageContext)
 * so it persists across a refresh but is asked again in a fresh tab —
 * "for the complete game session", not forever.
 */
function AppShell() {
  const { language } = useLanguage();
  const [screen, setScreen] = useState("loading");
  const [player, setPlayer] = useState(null); // { id, name, employeeId, plant }
  const [sessionId, setSessionId] = useState(null);
  // Set only when resuming an existing session (refresh mid-game) that
  // was created before a language had been picked yet — a narrow edge
  // case (refreshing exactly between registration and language-select,
  // or between language-select and welcome). In that case the language
  // screen is still shown, but choosing a language should drop the
  // player back into their in-progress game/results, not restart them at
  // the welcome/instructions screen.
  const [resumeTarget, setResumeTarget] = useState(null); // 'game' | 'results' | null

  // On first load: try to recover an in-progress or completed session
  // (registration already happened); otherwise start at registration.
  // Deliberately runs once on mount only, reading `language` at that
  // point in time rather than reacting to it — language changes are
  // handled by handleLanguageSelected below instead.
  useEffect(() => {
    const stored = loadStoredSession();
    if (!stored?.sessionId) {
      setScreen("registration");
      return;
    }

    GameEngine.getSession(stored.sessionId)
      .then((data) => {
        setSessionId(stored.sessionId);
        setPlayer(stored.player);
        const target = data.session.status === "COMPLETED" ? "results" : "game";
        if (!language) {
          setResumeTarget(target);
          setScreen("language");
        } else {
          // Resume directly in the game (or results) — skip
          // welcome/countdown so the player can't replay the intro to
          // "reset" anything.
          setScreen(target);
        }
      })
      .catch(() => {
        clearStoredSession();
        setScreen("registration");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegistered = useCallback(({ player: newPlayer, session }) => {
    setPlayer(newPlayer);
    setSessionId(session.id);
    persistSession({ sessionId: session.id, player: newPlayer });
    setScreen("language");
  }, []);

  const handleLanguageSelected = useCallback(() => {
    if (resumeTarget) {
      setScreen(resumeTarget);
      setResumeTarget(null);
    } else {
      setScreen("instructions");
    }
  }, [resumeTarget]);

  const handleStartJourney = useCallback(() => {
    const timedPlayer = { ...player, gameStartedAt: Date.now(), gameDurationSeconds: null };
    setPlayer(timedPlayer);
    persistSession({ sessionId, player: timedPlayer });
    setScreen("game");
  }, [player, sessionId]);

  const handleGameComplete = useCallback(() => {
    const timedPlayer = {
      ...player,
      gameDurationSeconds: player?.gameStartedAt
        ? Math.max(0, Math.round((Date.now() - player.gameStartedAt) / 1000))
        : null,
    };
    setPlayer(timedPlayer);
    persistSession({ sessionId, player: timedPlayer });
    setScreen("results");
  }, [player, sessionId]);

  const handlePlayAgain = useCallback(() => {
    GameEngine.clear(sessionId);
    clearStoredSession();
    setPlayer(null);
    setSessionId(null);
    setScreen("registration");
  }, [sessionId]);

  return (
    <AudioProvider>
      <div className="app-root">
        {/* Persistent brand mark, top-center, on every screen (including
            gameplay, where it sits directly above the HUD's centered
            progress route) — the HUD's own top padding/positioning is
            offset in index.css so it never sits under this. */}
        <img src={brandLogo} alt="Asian Paints — Humsafar Premier League" className="brand-logo" />
        {/* The game screen has its own mute control inside the HUD
            (top-right, next to the score) — rendering this fixed global
            one there too stacked two speaker icons on top of each other
            and clipped the score. Only show it outside gameplay. */}
        {screen !== "game" && screen !== "language" && <MuteButton className="global-mute" />}
        {screen === "loading" && (
          <div className="screen-center">
            <div className="loader" />
          </div>
        )}
        {screen === "registration" && <Registration onRegistered={handleRegistered} />}
        {screen === "language" && (
          <div className="rain-backdrop">
            <div className="reg-bg" aria-hidden="true">
              <div className="reg-bg-sky" />
              <div className="rain-layer rain-layer-back" />
              <div className="rain-layer rain-layer-front" />
              <div className="reg-bg-road" />
            </div>
            <div className="screen-center">
              <LanguageSelection onSelected={handleLanguageSelected} />
            </div>
          </div>
        )}
        {screen === "instructions" && player && (
          <Instructions player={player} onStart={handleStartJourney} />
        )}
        {screen === "game" && player && sessionId && (
          <Game player={player} sessionId={sessionId} onComplete={handleGameComplete} />
        )}
        {screen === "results" && player && sessionId && (
          <Results
            player={player}
            sessionId={sessionId}
            onPlayAgain={handlePlayAgain}
            onFinish={handlePlayAgain}
          />
        )}
      </div>
    </AudioProvider>
  );
}

/**
 * App — the actual default export. Just wraps AppShell in
 * <LanguageProvider> so every screen (including AppShell's own routing
 * decision for the language screen) can call useLanguage().
 */
export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
