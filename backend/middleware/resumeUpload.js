const multer = require("multer");
const path = require("path");

// Store uploaded file in memory instead of Render's local disk
const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  const allowedExtensions = [".pdf", ".docx"];

  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed."));
  }
};

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: fileFilter,
});

module.exports = upload;