const Player = require("../models/Player");

/**
 * POST /api/players
 * Creates an anonymous identity used only by existing MySQL game-session
 * and answer foreign keys. Registration PII is stored in Google Sheets.
 * Body: empty
 */
async function createPlayer(req, res, next) {
  try {
    const playerId = await Player.createAnonymous();

    const player = await Player.findById(playerId);
    res.status(201).json({ success: true, player });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPlayer };
