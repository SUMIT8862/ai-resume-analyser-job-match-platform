
const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutesModule = require("./routes/auth");
const resumeRoutesModule = require("./routes/resume");
const analysisRoutesModule = require("./routes/analysis");

const authMiddlewareModule = require("./middleware/authMiddleware");

// Handle different module export formats
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

/* =========================
   MIDDLEWARE
========================= */

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// JSON body parser
app.use(express.json());

/* =========================
   API ROUTES
========================= */

// Authentication
app.use("/api/auth", authRoutes);

// Resume upload/extraction
app.use("/api/resume", resumeRoutes);

// AI analysis/history
app.use("/api/analysis", analysisRoutes);

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyser Backend is running!",
  });
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyser backend is running successfully!",
  });
});

/* =========================
   DATABASE TEST
========================= */

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
      error: error.message,
    });
  }
});

/* =========================
   PROTECTED ROUTE
========================= */

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route successfully!",
    user: req.user,
  });
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* =========================
   START SERVER
========================= */

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;

