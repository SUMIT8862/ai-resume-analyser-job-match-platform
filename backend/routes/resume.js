const express = require("express");
const path = require("path");
const fs = require("fs");

const upload = require("../middleware/resumeUpload");
const authMiddleware = require("../middleware/authMiddleware");
const { extractResumeText } = require("../utils/resumeParser");

const router = express.Router();

// =========================
// Upload Resume
// =========================
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resume file.",
        });
      }

      // =========================
      // Extract Resume Text
      // =========================
      const resumeText = await extractResumeText(
        req.file.path
      );

      if (!resumeText) {
        return res.status(400).json({
          success: false,
          message: "Unable to extract text from the resume.",
        });
      }

      console.log(
        `Resume text extracted successfully: ${req.file.originalname}`
      );

      res.status(200).json({
        success: true,
        message: "Resume uploaded and text extracted successfully.",
        file: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          filePath: req.file.path,
          fileSize: req.file.size,
          fileType: path
            .extname(req.file.originalname)
            .toLowerCase(),
        },
        resumeText: resumeText,
      });
    } catch (error) {
      console.error(
        "Resume upload/extraction error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to process the resume.",
      });
    }
  }
);

// =========================
// Delete Uploaded Resume
// =========================
router.delete(
  "/delete/:fileName",
  authMiddleware,
  async (req, res) => {
    try {
      const fileName = req.params.fileName;

      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        fileName
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: "Resume file not found.",
        });
      }

      fs.unlinkSync(filePath);

      res.status(200).json({
        success: true,
        message: "Resume deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Resume delete error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to delete resume.",
      });
    }
  }
);

module.exports = router;