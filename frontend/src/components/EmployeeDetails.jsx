import { useState } from "react";
import { plants } from "../data/plants.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

/**
 * Screen 2 — Employee Details (Employee ID + Plant dropdown).
 * The plant list comes from src/data/plants.js so it's trivial to edit.
 * Plant names themselves aren't translated (they're facility identifiers,
 * not narrative content) — only the surrounding form text is.
 */
export default function EmployeeDetails({ initialValues, onBack, onContinue, submitting }) {
  const { t } = useLanguage();
  const [employeeId, setEmployeeId] = useState(initialValues?.employeeId || "");
  const [plant, setPlant] = useState(initialValues?.plant || "");
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!employeeId.trim()) next.employeeId = t.employeeDetails.idError;
    if (!plant) next.plant = t.employeeDetails.plantError;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      onContinue({ employeeId: employeeId.trim(), plant });
    }
  }

  return (
    <form className="glass-card auth-card" onSubmit={handleSubmit} noValidate>
      <p className="auth-step">{t.employeeDetails.step}</p>
      <h1 className="auth-title">{t.employeeDetails.title}</h1>
      <p className="auth-subtitle">{t.employeeDetails.subtitle}</p>

      <label className="field-label" htmlFor="employee-id">
        {t.employeeDetails.idLabel}
      </label>
      <input
        id="employee-id"
        className={`field-input ${errors.employeeId ? "field-input-error" : ""}`}
        type="text"
        placeholder={t.employeeDetails.idPlaceholder}
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      {errors.employeeId && <p className="field-error">{errors.employeeId}</p>}

      <label className="field-label" htmlFor="plant-select">
        {t.employeeDetails.plantLabel}
      </label>
      <select
        id="plant-select"
        className={`field-input field-select ${errors.plant ? "field-input-error" : ""}`}
        value={plant}
        onChange={(e) => setPlant(e.target.value)}
      >
        <option value="" disabled>
          {t.employeeDetails.plantPlaceholder}
        </option>
        {plants.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      {errors.plant && <p className="field-error">{errors.plant}</p>}

      <div className="btn-row">
        <button type="button" className="btn btn-ghost" onClick={onBack} disabled={submitting}>
          {t.employeeDetails.back}
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t.employeeDetails.settingUp : t.employeeDetails.continue}
        </button>
      </div>
    </form>
  );
}
