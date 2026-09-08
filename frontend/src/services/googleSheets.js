const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim();

async function postToSheet(payload) {
  if (!APPS_SCRIPT_URL || !APPS_SCRIPT_URL.endsWith("/exec")) {
    throw new Error("Google Sheets registration is not configured. Add the deployed Apps Script /exec URL to VITE_GOOGLE_APPS_SCRIPT_URL.");
  }

  // text/plain avoids an OPTIONS preflight, which Apps Script Web Apps do
  // not handle. The body itself remains JSON and is parsed by doPost(e).
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  if (!response.ok) throw new Error(`Google Sheets returned HTTP ${response.status}.`);

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Google Sheets returned an invalid response. Check the Apps Script deployment permissions and URL.");
  }

  if (!result?.success) {
    throw new Error(result?.message || "Registration could not be saved to Google Sheets.");
  }
  return result;
}

/** Creates one new Google Sheet row and returns its unique Sheet session ID. */
export async function savePlayerToSheet({ name, email, employeeId, plant }) {
  const result = await postToSheet({ action: "register", name, email, employeeId, plant });
  if (!result.sessionId) throw new Error("Google Sheets did not return a registration session ID.");
  return result;
}

/** Updates the existing registration row with the final game result. */
export async function saveResultToSheet({ sessionId, score, correctAnswers, wrongAnswers, language, gameDurationSeconds }) {
  if (!sessionId) throw new Error("The Google Sheets session ID is missing for this game.");
  return postToSheet({
    action: "complete",
    sessionId,
    score,
    correctAnswers,
    wrongAnswers,
    language,
    gameDurationSeconds,
  });
}

export default savePlayerToSheet;
