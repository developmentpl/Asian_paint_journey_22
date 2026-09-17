const SPREADSHEET_ID = '1wUv2q7TFVqTb0_4M5Xm0QNB37zS-nBUwS_hyjjn8xDE';
const SHEET_NAME = 'GameData';

// Correct option index (0=A, 1=B, 2=C, 3=D) for scenarios 1-10, in order.
// MUST match `correctAnswer` in frontend/src/data/questions.js. The final
// score is calculated here from the player's answers, so the browser can
// never send its own score.
const ANSWER_KEY = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const POINTS_PER_CORRECT_ANSWER = 10;
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const BASE_HEADERS = [
  'Session ID', 'Name', 'Email', 'Employee ID', 'Plant', 'Language',
  'Start Date', 'Start Time', 'Final Score', 'Correct Answers',
  'Wrong Answers', 'Completion Date', 'Completion Time', 'Status', 'Game Duration (hh:mm:ss)',
];
const ANSWER_HEADERS = ANSWER_KEY.map(function (_, i) { return 'Q' + (i + 1) + ' Answer'; });
const HEADERS = BASE_HEADERS.concat(ANSWER_HEADERS);
const STATUS_COLUMN = 14;
const DURATION_COLUMN = 15;
const LEGACY_HEADERS = ['Name', 'Email', 'Employee ID', 'Plant', 'Date', 'Time'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const data = parseRequest_(e);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Sheet tab "' + SHEET_NAME + '" was not found.');
    ensureHeaders_(sheet);

    const action = data.action || 'register';
    if (action === 'register') return register_(spreadsheet, sheet, data);
    if (action === 'complete') return complete_(spreadsheet, sheet, data);
    throw new Error('Unsupported action: ' + action);
  } catch (error) {
    return jsonResponse_({
      success: false,
      message: error && error.message ? error.message : 'Unable to process the request.',
    });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function register_(spreadsheet, sheet, data) {
  validateRegistration_(data);
  const sessionId = Utilities.getUuid();
  const timestamp = timestamp_(spreadsheet);
  sheet.appendRow([
    sessionId,
    clean_(data.name),
    clean_(data.email).toLowerCase(),
    clean_(data.employeeId),
    clean_(data.plant),
    '',
    timestamp.date,
    timestamp.time,
    '', '', '', '', '',
    'In Progress', '',
  ]);
  return jsonResponse_({
    success: true,
    message: 'Registration saved successfully',
    sessionId: sessionId,
  });
}

function complete_(spreadsheet, sheet, data) {
  validateCompletion_(data);
  const sessionId = clean_(data.sessionId);
  const row = findSessionRow_(sheet, sessionId);
  if (!row) throw new Error('No registration row was found for this session ID.');

  // Repeated Finish/Play Again calls succeed without updating another row.
  if (sheet.getRange(row, STATUS_COLUMN).getDisplayValue() === 'Completed') {
    return jsonResponse_({
      success: true,
      message: 'Result was already saved',
      sessionId: sessionId,
      alreadyCompleted: true,
    });
  }

  const result = scoreAnswers_(data.answers);
  const timestamp = timestamp_(spreadsheet);
  sheet.getRange(row, 6).setValue(clean_(data.language));
  sheet.getRange(row, DURATION_COLUMN).setNumberFormat('[hh]:mm:ss');
  sheet.getRange(row, 9, 1, 7 + ANSWER_HEADERS.length).setValues([[
    result.score,
    result.correctAnswers,
    result.wrongAnswers,
    timestamp.date,
    timestamp.time,
    'Completed',
    data.gameDurationSeconds == null ? '' : Number(data.gameDurationSeconds) / 86400,
  ].concat(result.answerCells)]);
  return jsonResponse_({
    success: true,
    message: 'Final result saved successfully',
    sessionId: sessionId,
  });
}

function parseRequest_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('Request body is missing.');
  const data = JSON.parse(e.postData.contents);
  if (!data || typeof data !== 'object') throw new Error('Invalid JSON payload.');
  return data;
}

function validateRegistration_(data) {
  ['name', 'email', 'employeeId', 'plant'].forEach(function (field) {
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      throw new Error(field + ' is required.');
    }
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    throw new Error('A valid email address is required.');
  }
}

function validateCompletion_(data) {
  if (data.gameDurationSeconds != null &&
      (typeof data.gameDurationSeconds !== 'number' ||
       !Number.isSafeInteger(data.gameDurationSeconds) || data.gameDurationSeconds < 0)) {
    throw new Error('gameDurationSeconds must be a non-negative integer.');
  }
  if (typeof data.sessionId !== 'string' || !data.sessionId.trim()) {
    throw new Error('sessionId is required.');
  }
  if (typeof data.language !== 'string' || !data.language.trim()) {
    throw new Error('language is required.');
  }
  if (!Array.isArray(data.answers) || data.answers.length !== ANSWER_KEY.length) {
    throw new Error('answers must be a list of ' + ANSWER_KEY.length + ' entries.');
  }
  data.answers.forEach(function (answer, i) {
    if (answer === null) return;
    if (!Number.isInteger(answer) || answer < 0 || answer >= OPTION_LETTERS.length) {
      throw new Error('Answer for Q' + (i + 1) + ' is not a valid option.');
    }
  });
}

// Scores the submitted answers against ANSWER_KEY. Unanswered scenarios
// (null) score nothing and count as neither correct nor wrong. Each Q
// cell reads "Correct", "Wrong (A)" or "Not answered".
function scoreAnswers_(answers) {
  let correct = 0;
  let wrong = 0;
  const cells = answers.map(function (answer, i) {
    if (answer === null) return 'Not answered';
    if (answer === ANSWER_KEY[i]) {
      correct += 1;
      return 'Correct';
    }
    wrong += 1;
    // The letter is the option's position in questions.js (A = first),
    // not the position shown on screen — the game shuffles those.
    return 'Wrong (' + OPTION_LETTERS[answer] + ')';
  });
  return {
    score: correct * POINTS_PER_CORRECT_ANSWER,
    correctAnswers: correct,
    wrongAnswers: wrong,
    answerCells: cells,
  };
}

function findSessionRow_(sheet, sessionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const match = sheet.getRange(2, 1, lastRow - 1, 1)
    .createTextFinder(sessionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : null;
}

function ensureHeaders_(sheet) {
  ensureColumnCount_(sheet, HEADERS.length);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (headersMatch_(existing, HEADERS)) return;

  if (headersMatch_(existing, BASE_HEADERS.slice(0, 14))) {
    if (existing[14] === 'Game Duration (seconds)') {
      // Convert the earlier seconds column to native Sheets durations once.
      const count = sheet.getLastRow() - 1;
      if (count > 0) {
        const range = sheet.getRange(2, DURATION_COLUMN, count, 1);
        const values = range.getValues().map(function (row) {
          return [typeof row[0] === 'number' ? row[0] / 86400 : row[0]];
        });
        range.setValues(values);
        range.setNumberFormat('[hh]:mm:ss');
      }
      sheet.getRange(1, DURATION_COLUMN).setValue(BASE_HEADERS[14]);
    } else if (!existing[14]) {
      // Append duration to the earlier 14-column result layout.
      sheet.getRange(1, DURATION_COLUMN).setValue(BASE_HEADERS[14]);
    } else if (existing[14] !== BASE_HEADERS[14]) {
      throw new Error('GameData headers must be: ' + HEADERS.join(', '));
    }

    // Append the Q1-Q10 answer columns to the 15-column layout. Older
    // rows keep these cells blank.
    const tail = existing.slice(BASE_HEADERS.length);
    if (tail.every(function (value) { return !value; })) {
      sheet.getRange(1, BASE_HEADERS.length + 1, 1, ANSWER_HEADERS.length).setValues([ANSWER_HEADERS]);
      return;
    }
    throw new Error('GameData headers must be: ' + HEADERS.join(', '));
  }

  // One-time migration from the earlier six-column registration-only layout.
  const legacy = sheet.getRange(1, 1, 1, LEGACY_HEADERS.length).getDisplayValues()[0];
  if (headersMatch_(legacy, LEGACY_HEADERS)) {
    sheet.insertColumnBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }
  throw new Error('GameData headers must be: ' + HEADERS.join(', '));
}

function ensureColumnCount_(sheet, count) {
  const max = sheet.getMaxColumns();
  if (max < count) sheet.insertColumnsAfter(max, count - max);
}

function headersMatch_(actual, expected) {
  return expected.every(function (header, index) { return actual[index] === header; });
}

function timestamp_(spreadsheet) {
  const now = new Date();
  const timezone = spreadsheet.getSpreadsheetTimeZone();
  return {
    date: Utilities.formatDate(now, timezone, 'yyyy-MM-dd'),
    time: Utilities.formatDate(now, timezone, 'HH:mm:ss'),
  };
}

function clean_(value) {
  const text = String(value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
