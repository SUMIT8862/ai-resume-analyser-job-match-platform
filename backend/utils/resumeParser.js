const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const mammoth = require("mammoth");

const extractResumeText = async (filePath) => {
  try {
    const extension = path.extname(filePath).toLowerCase();

    // =========================
    // PDF Resume
    // =========================
    if (extension === ".pdf") {
      const fileBuffer = fs.readFileSync(filePath);

      const pdfParser = new pdfParse.PDFParse({
        data: fileBuffer,
      });

      const result = await pdfParser.getText();

      await pdfParser.destroy();

      return result.text.trim();
    }

    // =========================
    // DOCX Resume
    // =========================
    if (extension === ".docx") {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      return result.value.trim();
    }

    throw new Error(
      "Unsupported file format. Only PDF and DOCX are allowed."
    );
  } catch (error) {
    console.error(
      "Resume text extraction error:",
      error.message
    );

    throw new Error("Unable to extract text from resume.");
  }
};

module.exports = {
  extractResumeText,
};