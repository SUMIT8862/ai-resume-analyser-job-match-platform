const { extractResumeText } = require("./utils/resumeParser");

const resumePath =
  "./uploads/1789152811049-126571570.docx";

const testExtraction = async () => {
  try {
    const text = await extractResumeText(resumePath);

    console.log("\n==============================");
    console.log("RESUME TEXT EXTRACTION TEST");
    console.log("==============================\n");

    console.log(text);

    console.log("\n==============================");
    console.log("TEXT EXTRACTION SUCCESSFUL");
    console.log("==============================\n");
  } catch (error) {
    console.error("\nExtraction failed:", error.message);
  }
};

testExtraction();