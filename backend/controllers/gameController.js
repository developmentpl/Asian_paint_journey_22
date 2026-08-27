const Player = require("../models/Player");
const GameSession = require("../models/GameSession");
const PlayerAnswer = require("../models/PlayerAnswer");
const questions = require("../data/questions");

const POINTS_PER_CORRECT_ANSWER = 10;

function getQuestionById(id) {
  return questions.find((q) => q.id === Number(id)) || null;
}

/**
 * POST /api/game/start
 * Body: { playerId }
 * Creates a new IN_PROGRESS session for the player and returns the
 * session id plus the public (answer-free-on-the-wire-doesn't-matter-but-
 * still-clean) scenario list so the frontend can render the journey.
 */
async function startGame(req, res, next) {
  try {
    const { playerId } = req.body || {};
    if (!playerId || Number.isNaN(Number(playerId))) {
      return res.status(400).json({ success: false, message: "A valid playerId is required." });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ success: false, message: "Player not found." });
    }

    const sessionId = await GameSession.create(playerId);
    const session = await GameSession.findById(sessionId);

    res.status(201).json({
      success: true,
      session,
      totalQuestions: questions.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/game/:sessionId
 * Used on load/refresh to recover the true game state from the server
 * (never trust localStorage alone for score/progress).
 */
async function getGame(req, res, next) {
  try {
    const { sessionId } = req.params;
    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Game session not found." });
    }

    const answers = await PlayerAnswer.findBySession(sessionId);
    const answeredQuestionIds = answers.map((a) => a.question_id);

    res.json({
      success: true,
      session,
      answeredQuestionIds,
      totalQuestions: questions.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/game/answer
 * Body: { sessionId, questionId, selectedAnswer }
 *
 * SECURITY: the frontend only ever sends the selected option index.
 * The backend independently looks up the correct answer and computes
 * points — the client can never set its own score.
 */
async function submitAnswer(req, res, next) {
  try {
    const { sessionId, questionId, selectedAnswer } = req.body || {};

    if (
      sessionId === undefined ||
      questionId === undefined ||
      selectedAnswer === undefined ||
      Number.isNaN(Number(sessionId)) ||
      Number.isNaN(Number(questionId)) ||
      Number.isNaN(Number(selectedAnswer))
    ) {
      return res.status(400).json({
        success: false,
        message: "sessionId, questionId and selectedAnswer are all required.",
      });
    }

    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Game session not found." });
    }
    if (session.status === "COMPLETED") {
      return res.status(400).json({ success: false, message: "This game session has already been completed." });
    }

    const question = getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    if (selectedAnswer < 0 || selectedAnswer >= question.options.length) {
      return res.status(400).json({ success: false, message: "Invalid answer option." });
    }

    // Prevent duplicate / repeat scoring for the same question in this session.
    const existing = await PlayerAnswer.findExisting(sessionId, questionId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This scenario has already been answered in this session.",
        alreadyAnswered: true,
        result: {
          isCorrect: !!existing.is_correct,
          correctAnswer: existing.correct_answer,
          selectedAnswer: existing.selected_answer,
          pointsAwarded: existing.points_awarded,
          explanation: question.explanation,
        },
      });
    }

    const isCorrect = Number(selectedAnswer) === Number(question.correctAnswer);
    const points = isCorrect ? POINTS_PER_CORRECT_ANSWER : 0;

    await PlayerAnswer.create({
      sessionId,
      playerId: session.player_id,
      questionId: question.id,
      selectedAnswer: Number(selectedAnswer),
      correctAnswer: question.correctAnswer,
      isCorrect,
      points,
    });

    await GameSession.addPoints(sessionId, { isCorrect, points });
    const updatedSession = await GameSession.findById(sessionId);

    res.json({
      success: true,
      result: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        selectedAnswer: Number(selectedAnswer),
        pointsAwarded: points,
        explanation: question.explanation,
      },
      session: updatedSession,
    });
  } catch (err) {
    // Handles the rare race where two answer requests for the same
    // question land at once and the DB unique constraint rejects the 2nd.
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "This scenario has already been answered." });
    }
    next(err);
  }
}

/**
 * POST /api/game/complete
 * Body: { sessionId }
 * Marks the session COMPLETED and stamps completed_at.
 */
async function completeGame(req, res, next) {
  try {
    const { sessionId } = req.body || {};
    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Game session not found." });
    }

    if (session.status !== "COMPLETED") {
      await GameSession.complete(sessionId);
    }

    const updatedSession = await GameSession.findById(sessionId);
    const player = await Player.findById(session.player_id);

    res.json({ success: true, session: updatedSession, player });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/game/:sessionId/results
 * Full breakdown for the final scoreboard + "Review Your Decisions".
 */
async function getResults(req, res, next) {
  try {
    const { sessionId } = req.params;
    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Game session not found." });
    }

    const player = await Player.findById(session.player_id);
    const answers = await PlayerAnswer.findBySession(sessionId);

    const review = answers.map((a) => {
      const question = getQuestionById(a.question_id);
      return {
        questionId: a.question_id,
        title: question?.title,
        question: question?.question,
        options: question?.options,
        selectedAnswer: a.selected_answer,
        correctAnswer: a.correct_answer,
        isCorrect: !!a.is_correct,
        explanation: question?.explanation,
      };
    });

    res.json({
      success: true,
      player,
      session,
      review,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { startGame, getGame, submitAnswer, completeGame, getResults };
