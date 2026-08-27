const express = require("express");
const router = express.Router();
const questions = require("../data/questions");

/**
 * GET /api/questions
 * Returns the scenario bank (including correct answers/explanations).
 * Note: this is provided for convenience/tooling. The frontend ships its
 * own local copy (frontend/src/data/questions.js) for rendering, and the
 * backend independently re-checks every answer in gameController — so
 * exposing this list does not affect score integrity.
 */
router.get("/", (req, res) => {
  res.json({ success: true, questions });
});

module.exports = router;
