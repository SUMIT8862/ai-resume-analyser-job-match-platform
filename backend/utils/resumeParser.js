const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractResumeText = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("Resume file buffer is missing.");
    }

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    // =========================
    // PDF Resume
    // =========================
    if (extension === ".pdf") {
      const pdfParser = new pdfParse.PDFParse({
        data: file.buffer,
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
        buffer: file.buffer,
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