const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/db");
const playerRoutes = require("./routes/playerRoutes");
const gameRoutes = require("./routes/gameRoutes");
const questionRoutes = require("./routes/questionRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Road Safety Game API is running." });
});

app.use("/api/players", playerRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/questions", questionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Centralized error handler (must be last)
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚦 Road Safety Game backend running on http://localhost:${PORT}`);
  await testConnection();
});
