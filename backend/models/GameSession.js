const { pool } = require("../config/db");
const questions = require("../data/questions");

const TOTAL_QUESTIONS = questions.length;

/**
 * GameSession model — thin data-access layer around the `game_sessions` table.
 */
const GameSession = {
  async create(playerId) {
    const [result] = await pool.execute(
      `INSERT INTO game_sessions (player_id, score, correct_answers, wrong_answers, total_questions, status)
       VALUES (?, 0, 0, 0, ?, 'IN_PROGRESS')`,
      [playerId, TOTAL_QUESTIONS]
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM game_sessions WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async addPoints(sessionId, { isCorrect, points }) {
    await pool.execute(
      `UPDATE game_sessions
       SET score = score + ?,
           correct_answers = correct_answers + ?,
           wrong_answers = wrong_answers + ?
       WHERE id = ?`,
      [points, isCorrect ? 1 : 0, isCorrect ? 0 : 1, sessionId]
    );
  },

  async complete(sessionId) {
    await pool.execute(
      `UPDATE game_sessions
       SET status = 'COMPLETED', completed_at = NOW()
       WHERE id = ?`,
      [sessionId]
    );
  },
};

module.exports = GameSession;
