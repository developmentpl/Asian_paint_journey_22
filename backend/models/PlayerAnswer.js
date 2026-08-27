const { pool } = require("../config/db");

/**
 * PlayerAnswer model — thin data-access layer around the `player_answers` table.
 * The UNIQUE (session_id, question_id) constraint in the DB is the final
 * safety net against duplicate/duplicate-scoring answers, in addition to
 * the in-application check done in gameController.
 */
const PlayerAnswer = {
  async findExisting(sessionId, questionId) {
    const [rows] = await pool.execute(
      `SELECT * FROM player_answers WHERE session_id = ? AND question_id = ?`,
      [sessionId, questionId]
    );
    return rows[0] || null;
  },

  async create({ sessionId, playerId, questionId, selectedAnswer, correctAnswer, isCorrect, points }) {
    const [result] = await pool.execute(
      `INSERT INTO player_answers
        (session_id, player_id, question_id, selected_answer, correct_answer, is_correct, points_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [sessionId, playerId, questionId, selectedAnswer, correctAnswer, isCorrect ? 1 : 0, points]
    );
    return result.insertId;
  },

  async findBySession(sessionId) {
    const [rows] = await pool.execute(
      `SELECT * FROM player_answers WHERE session_id = ? ORDER BY question_id ASC`,
      [sessionId]
    );
    return rows;
  },
};

module.exports = PlayerAnswer;
