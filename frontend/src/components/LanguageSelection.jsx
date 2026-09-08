import { useLanguage } from "../i18n/LanguageContext.jsx";

/**
 * Shown right after registration (name/email, employee id/plant) — picks
 * English or हिंदी for the rest of the session (instructions, countdown,
 * every scenario, feedback, and the final results). Shown in both
 * languages simultaneously (this screen itself isn't localized to a
 * chosen language yet, since none is chosen yet) so either speaker can
 * read it, and deliberately offers only these two buttons — no other
 * choice to make here.
 */
export default function LanguageSelection({ onSelected }) {
  const { setLanguage } = useLanguage();

  function choose(lang) {
    setLanguage(lang);
    onSelected?.(lang);
  }

  return (
    <div className="glass-card language-select-card">
      <p className="language-select-title">
        Choose Your Language
        <span className="language-select-title-divider" />
        अपनी भाषा चुनें
      </p>
      <p className="language-select-subtitle">
        Select the language you'd like to play in.
        <br />
        वह भाषा चुनें जिसमें आप खेलना चाहते हैं।
      </p>

      {/* Text-only buttons — deliberately no flag icons or other
          decoration, just the language name each button switches to. */}
      <div className="language-select-options">
        <button type="button" className="language-option-btn" onClick={() => choose("en")}>
          <span className="language-option-name">English</span>
        </button>
        <button type="button" className="language-option-btn" onClick={() => choose("hi")}>
          <span className="language-option-name">हिंदी</span>
        </button>
      </div>

      <p className="language-select-hint">
        You can't change this once your journey begins. · यात्रा शुरू होने के बाद आप इसे बदल नहीं सकेंगे।
      </p>
    </div>
  );
}
