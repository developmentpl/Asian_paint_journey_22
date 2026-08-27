import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Screen 1 — Player Details (Name + Email).
 */
export default function PlayerForm({ initialValues, onNext }) {
  const { t } = useLanguage();
  const [name, setName] = useState(initialValues?.name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!name.trim()) next.name = t.playerForm.nameError;
    if (!email.trim()) {
      next.email = t.playerForm.emailRequiredError;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = t.playerForm.emailInvalidError;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      onNext({ name: name.trim(), email: email.trim() });
    }
  }

  return (
    <form className="glass-card auth-card" onSubmit={handleSubmit} noValidate>
      <p className="auth-step">{t.playerForm.step}</p>
      <h1 className="auth-title">{t.playerForm.title}</h1>
      <p className="auth-subtitle">{t.playerForm.subtitle}</p>

      <label className="field-label" htmlFor="player-name">
        {t.playerForm.nameLabel}
      </label>
      <input
        id="player-name"
        className={`field-input ${errors.name ? "field-input-error" : ""}`}
        type="text"
        placeholder={t.playerForm.namePlaceholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
      />
      {errors.name && <p className="field-error">{errors.name}</p>}

      <label className="field-label" htmlFor="player-email">
        {t.playerForm.emailLabel}
      </label>
      <input
        id="player-email"
        className={`field-input ${errors.email ? "field-input-error" : ""}`}
        type="email"
        placeholder={t.playerForm.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      {errors.email && <p className="field-error">{errors.email}</p>}

      <button type="submit" className="btn btn-primary btn-block">
        {t.playerForm.next}
      </button>
    </form>
  );
}
