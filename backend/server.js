const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutesModule = require("./routes/auth");
const resumeRoutesModule = require("./routes/resume");
const analysisRoutesModule = require("./routes/analysis");

const authMiddlewareModule = require("./middleware/authMiddleware");

// Vercel compatibility
const getModuleExport = (module) => {
  if (typeof module === "function") {
    return module;
  }

  if (module && typeof module.default === "function") {
    return module.default;
  }

  return module;
};

const authRoutes = getModuleExport(authRoutesModule);
const resumeRoutes = getModuleExport(resumeRoutesModule);
const analysisRoutes = getModuleExport(analysisRoutesModule);
const authMiddleware = getModuleExport(authMiddlewareModule);

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/analysis", analysisRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyser Backend is running!",
  });
});

// Database test route
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

// Protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route successfully!",
    user: req.user,
  });
});

// Local development server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Backend server running on http://localhost:${PORT}`
    );
  });
}

module.exports = app;