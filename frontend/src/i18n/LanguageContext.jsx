import { createContext, useContext, useMemo, useState } from "react";
import { uiText } from "./uiText.js";
import questionsEn from "../data/questions.js";
import questionsHi from "../data/questions.hi.js";
import scenarioActionsEn from "../data/scenarioActions.js";
import scenarioActionsHi from "../data/scenarioActions.hi.js";

const STORAGE_KEY = "roadSafetyGame.language";

const QUESTIONS_BY_LANG = { en: questionsEn, hi: questionsHi };
const ACTIONS_BY_LANG = { en: scenarioActionsEn, hi: scenarioActionsHi };

const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "hi" ? stored : null;
  } catch {
    return null;
  }
}

function writeStoredLanguage(lang) {
  try {
    sessionStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* sessionStorage may be unavailable in some contexts; the game still
       works, it just re-asks for a language on the next reload. */
  }
}

/**
 * LanguageProvider — makes the selected language (and everything that
 * depends on it: UI strings, the 10 scenarios, and their action
 * captions) available to the whole app via useLanguage().
 *
 * The language is picked ONCE on the Language Selection screen and then
 * persisted in sessionStorage for "the complete game session" (same tab,
 * survives refresh, exactly like the existing player/session recovery in
 * App.jsx) — see the STORAGE_KEY read/write above. Scoring is not
 * affected: translated scenario option arrays keep the exact same
 * order/index as the English source, so the canonical option index the
 * game engine and Apps Script score against is unaffected by which language is showing (see data/questions.hi.js's
 * top comment and utils/shuffle.js for why that's safe).
 */
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  const value = useMemo(() => {
    const lang = language || "en";
    return {
      language, // null until the player has actually chosen one
      setLanguage: (lang2) => {
        writeStoredLanguage(lang2);
        setLanguageState(lang2);
      },
      t: uiText[lang],
      questions: QUESTIONS_BY_LANG[lang],
      scenarioActions: ACTIONS_BY_LANG[lang],
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() must be used inside a <LanguageProvider>.");
  }
  return ctx;
}

export default LanguageContext;
