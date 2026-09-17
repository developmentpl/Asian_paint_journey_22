import { useRef, useState } from "react";
import PlayerForm from "../components/PlayerForm.jsx";
import EmployeeDetails from "../components/EmployeeDetails.jsx";
import { GameEngine } from "../services/gameEngine.js";
import { savePlayerToSheet } from "../services/googleSheets.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

/**
 * Registration page — Screen 1 (name/email) then Screen 2 (employee id/plant).
 * On completion, saves registration details to Google Sheets, then starts
 * an in-browser game session that uses the Sheet's session ID.
 */
export default function Registration({ onRegistered }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ name: "", email: "", employeeId: "", plant: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submissionLockRef = useRef(false);

  function handleStep1Next(values) {
    setDetails((d) => ({ ...d, ...values }));
    setStep(2);
  }

  async function handleStep2Continue(values) {
    if (submissionLockRef.current) return;
    submissionLockRef.current = true;

    const merged = { ...details, ...values };
    setDetails(merged);
    setSubmitting(true);
    setError("");
    try {
      const sheetRegistration = await savePlayerToSheet(merged);
      const { session } = GameEngine.start(sheetRegistration.sessionId);
      onRegistered({
        player: {
          id: sheetRegistration.sessionId,
          name: merged.name,
          email: merged.email,
          employeeId: merged.employeeId,
          plant: merged.plant,
          sheetSessionId: sheetRegistration.sessionId,
        },
        session,
      });
    } catch (err) {
      setError(err.message || t.errors.startGameFailed);
      setSubmitting(false);
      submissionLockRef.current = false;
    }
  }

  return (
    <div className="rain-backdrop">
      <RegistrationBackground />
      <div className="screen-center">
        {step === 1 && <PlayerForm initialValues={details} onNext={handleStep1Next} />}
        {step === 2 && (
          <EmployeeDetails
            initialValues={details}
            onBack={() => setStep(1)}
            onContinue={handleStep2Continue}
            submitting={submitting}
          />
        )}
        {error && <p className="global-error">{error}</p>}
      </div>
    </div>
  );
}

/** Lightweight decorative rain/road backdrop for the registration screens. */
function RegistrationBackground() {
  return (
    <div className="reg-bg" aria-hidden="true">
      <div className="reg-bg-sky" />
      <div className="rain-layer rain-layer-back" />
      <div className="rain-layer rain-layer-front" />
      <div className="reg-bg-road" />
    </div>
  );
}
