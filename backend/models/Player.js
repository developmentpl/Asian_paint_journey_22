const { pool } = require("../config/db");
const crypto = require("crypto");

/**
 * Player model — thin data-access layer around the `players` table.
 */
const Player = {
  async createAnonymous() {
    const token = crypto.randomUUID();
    const [result] = await pool.execute(
      `INSERT INTO players (name, email, employee_id, plant) VALUES (?, ?, ?, ?)`,
      ["Anonymous Game Player", `game-${token}@anonymous.invalid`, `GAME-${token}`, "External Registration"]
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM players WHERE id = ?`, [id]);
    return rows[0] || null;
  },
};

module.exports = Player;
