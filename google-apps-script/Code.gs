const SPREADSHEET_ID = '1wUv2q7TFVqTb0_4M5Xm0QNB37zS-nBUwS_hyjjn8xDE';
const SHEET_NAME = 'GameData';
const HEADERS = [
  'Session ID', 'Name', 'Email', 'Employee ID', 'Plant', 'Language',
  'Start Date', 'Start Time', 'Final Score', 'Correct Answers',
  'Wrong Answers', 'Completion Date', 'Completion Time', 'Status', 'Game Duration (hh:mm:ss)',
];
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
  if (sheet.getRange(row, 14).getDisplayValue() === 'Completed') {
    return jsonResponse_({
      success: true,
      message: 'Result was already saved',
      sessionId: sessionId,
      alreadyCompleted: true,
    });
  }

  const timestamp = timestamp_(spreadsheet);
  sheet.getRange(row, 6).setValue(clean_(data.language));
  sheet.getRange(row, 15).setNumberFormat('[hh]:mm:ss');
  sheet.getRange(row, 9, 1, 7).setValues([[
    Number(data.score),
    Number(data.correctAnswers),
    Number(data.wrongAnswers),
    timestamp.date,
    timestamp.time,
    'Completed',
    data.gameDurationSeconds == null ? '' : Number(data.gameDurationSeconds) / 86400,
  ]]);
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
  ['score', 'correctAnswers', 'wrongAnswers'].forEach(function (field) {
    if (data[field] === '' || data[field] === null || !Number.isFinite(Number(data[field]))) {
      throw new Error(field + ' must be a number.');
    }
  });
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
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (headersMatch_(existing, HEADERS)) return;

  // Convert the earlier seconds column to native Sheets durations once.
  if (headersMatch_(existing, HEADERS.slice(0, 14)) && existing[14] === 'Game Duration (seconds)') {
    const count = sheet.getLastRow() - 1;
    if (count > 0) {
      const range = sheet.getRange(2, 15, count, 1);
      const values = range.getValues().map(function (row) {
        return [typeof row[0] === 'number' ? row[0] / 86400 : row[0]];
      });
      range.setValues(values);
      range.setNumberFormat('[hh]:mm:ss');
    }
    sheet.getRange(1, 15).setValue(HEADERS[14]);
    return;
  }

  // Append duration to the existing result layout without moving old data.
  if (headersMatch_(existing, HEADERS.slice(0, 14)) && !existing[14]) {
    sheet.getRange(1, 15).setValue(HEADERS[14]);
    return;
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
