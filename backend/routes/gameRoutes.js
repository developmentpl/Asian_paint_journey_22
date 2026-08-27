const express = require("express");
const router = express.Router();
const {
  startGame,
  getGame,
  submitAnswer,
  completeGame,
  getResults,
} = require("../controllers/gameController");

router.post("/start", startGame);
router.post("/answer", submitAnswer);
router.post("/complete", completeGame);
router.get("/:sessionId/results", getResults);
router.get("/:sessionId", getGame);

module.exports = router;
