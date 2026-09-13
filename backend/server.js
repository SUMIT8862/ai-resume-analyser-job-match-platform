const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
const analysisRoutes = require("./routes/analysis");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// =========================
// CORS
// =========================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// =========================
// JSON Middleware
// =========================

app.use(express.json());

// =========================
// API Routes
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/analysis", analysisRoutes);

// =========================
// Home Route
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyser Backend is running!",
  });
});

// =========================
// Test Database
// =========================

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "PostgreSQL is connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database test error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =========================
// Protected Route Test
// =========================

app.get(
  "/api/protected",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "You accessed a protected route successfully!",
      user: req.user,
    });
  }
);

// =========================
// Export App for Vercel
// =========================

module.exports = app;

// =========================
// Start Server Locally
// =========================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Backend server running on http://localhost:${PORT}`
    );
  });
}