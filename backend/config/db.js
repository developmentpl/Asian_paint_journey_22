const mysql = require("mysql2/promise");
require("dotenv").config();

// Centralized MySQL connection pool (reused across the whole backend).
const pool = mysql.createPool({
  host: process.env.DB_HOST || "192.168.31.150",
  user: process.env.DB_USER || "developer",
  password: process.env.DB_PASSWORD || "Developer@123",
  database: process.env.DB_NAME || "road_safety_game",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// Quick startup check so misconfiguration fails fast with a clear message.
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected:", process.env.DB_NAME || "road_safety_game");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    console.error(
      "   Check backend/.env values and confirm MySQL is running, and that database.sql has been imported."
    );
  }
}

module.exports = { pool, testConnection };
