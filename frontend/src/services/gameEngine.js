import { questions } from "../data/questions.js";

/**
 * gameEngine — runs the game entirely in the browser (there is no backend
 * server or database). It keeps the same function names and response
 * shapes the old server API had, so the pages barely changed.
 *
 * - The answer key is `correctAnswer` in data/questions.js (English copy).
 *   questions.hi.js keeps the same option order, so the index a player
 *   picks means the same thing in both languages.
 * - Progress lives in sessionStorage, so a page refresh resumes the same
 *   game, and each scenario can only be scored once per game.
 * - The Google Apps Script re-checks the submitted answers against its
 *   own copy of the answer key when the result is saved, so the score in
 *   the Sheet can't be faked by editing this browser state.
 */

const POINTS_PER_CORRECT_ANSWER = 10;
const STORAGE_PREFIX = "roadSafetyGame.state.";

// Fallback for browsers/contexts where sessionStorage is blocked: the
// game still works, it just won't survive a refresh.
const memoryStore = new Map();

function storageKey(sessionId) {
  return `${STORAGE_PREFIX}${sessionId}`;
}

function readState(sessionId) {
  const key = storageKey(sessionId);
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to the in-memory copy */
  }
  return memoryStore.get(key) || null;
}

function writeState(state) {
  const key = storageKey(state.id);
  memoryStore.set(key, state);
  try {
    sessionStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* in-memory copy is enough for this page load */
  }
}

function removeState(sessionId) {
  const key = storageKey(sessionId);
  memoryStore.delete(key);
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* no-op */
  }
}

function nowIso() {
  return new Date().toISOString();
}

function getQuestionById(id) {
  return questions.find((q) => q.id === Number(id)) || null;
}

/** Public session object (snake_case names are what the pages expect). */
function toSession(state) {
  return {
    id: state.id,
    score: state.score,
    correct_answers: state.correct_answers,
    wrong_answers: state.wrong_answers,
    total_questions: state.total_questions,
    status: state.status,
    started_at: state.started_at,
    completed_at: state.completed_at,
  };
}

function requireState(sessionId) {
  const state = sessionId ? readState(sessionId) : null;
  if (!state) throw new Error("Game session not found. Please register again.");
  return state;
}

/**
 * Answers in question-id order (1..N): the chosen option index, or null
 * if that scenario wasn't answered. This is what gets sent to Google
 * Sheets so the Apps Script can score it independently.
 */
function answersInOrder(state) {
  return questions
    .map((q) => q.id)
    .sort((a, b) => a - b)
    .map((id) => {
      const a = state.answers[id];
      return a ? a.selectedAnswer : null;
    });
}

export const GameEngine = {
  /** Creates a new in-progress game. `sessionId` is the Sheet's session ID. */
  start(sessionId) {
    if (!sessionId) throw new Error("A session ID is required to start the game.");
    const state = {
      id: sessionId,
      score: 0,
      correct_answers: 0,
      wrong_answers: 0,
      total_questions: questions.length,
      status: "IN_PROGRESS",
      started_at: nowIso(),
      completed_at: null,
      answers: {}, // { [questionId]: { selectedAnswer, correctAnswer, isCorrect, points } }
    };
    writeState(state);
    return { success: true, session: toSession(state), totalQuestions: questions.length };
  },

  /** Current state, used to resume after a refresh. */
  async getSession(sessionId) {
    const state = requireState(sessionId);
    return {
      success: true,
      session: toSession(state),
      answeredQuestionIds: Object.keys(state.answers).map(Number).sort((a, b) => a - b),
      totalQuestions: questions.length,
    };
  },

  /** Scores one answer. A scenario can only be scored once per game. */
  async submitAnswer({ sessionId, questionId, selectedAnswer }) {
    const state = requireState(sessionId);
    const question = getQuestionById(questionId);
    const choice = Number(selectedAnswer);

    if (!question) return { success: false, message: "Question not found." };
    if (state.status === "COMPLETED") {
      return { success: false, message: "This game session has already been completed." };
    }
    if (!Number.isInteger(choice) || choice < 0 || choice >= question.options.length) {
      return { success: false, message: "Invalid answer option." };
    }

    const existing = state.answers[question.id];
    if (existing) {
      return {
        success: false,
        message: "This scenario has already been answered in this session.",
        alreadyAnswered: true,
        result: { ...existing, pointsAwarded: existing.points, explanation: question.explanation },
        session: toSession(state),
      };
    }

    const isCorrect = choice === Number(question.correctAnswer);
    const points = isCorrect ? POINTS_PER_CORRECT_ANSWER : 0;

    state.answers[question.id] = {
      selectedAnswer: choice,
      correctAnswer: question.correctAnswer,
      isCorrect,
      points,
      answeredAt: nowIso(),
    };
    state.score += points;
    state.correct_answers += isCorrect ? 1 : 0;
    state.wrong_answers += isCorrect ? 0 : 1;
    writeState(state);

    return {
      success: true,
      result: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        selectedAnswer: choice,
        pointsAwarded: points,
        explanation: question.explanation,
      },
      session: toSession(state),
    };
  },

  /** Marks the game as completed. Safe to call more than once. */
  async complete(sessionId) {
    const state = requireState(sessionId);
    if (state.status !== "COMPLETED") {
      state.status = "COMPLETED";
      state.completed_at = nowIso();
      writeState(state);
    }
    return { success: true, session: toSession(state) };
  },

  /** Final score plus the per-question review. */
  async getResults(sessionId) {
    const state = requireState(sessionId);
    const review = Object.keys(state.answers)
      .map(Number)
      .sort((a, b) => a - b)
      .map((id) => {
        const a = state.answers[id];
        const q = getQuestionById(id);
        return {
          questionId: id,
          title: q?.title,
          question: q?.question,
          options: q?.options,
          selectedAnswer: a.selectedAnswer,
          correctAnswer: a.correctAnswer,
          isCorrect: a.isCorrect,
          explanation: q?.explanation,
        };
      });
    return {
      success: true,
      session: toSession(state),
      answers: answersInOrder(state),
      review,
    };
  },

  /** Forgets a finished game (used by Play Again). */
  clear(sessionId) {
    if (sessionId) removeState(sessionId);
  },
};

export default GameEngine;
