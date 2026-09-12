require("dotenv").config();

const ai = require("./utils/gemini");

const testGemini = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Say only: Gemini API connection successful.",
    });

    console.log("\n==============================");
    console.log("GEMINI CONNECTION TEST");
    console.log("==============================\n");

    console.log(response.text);

    console.log("\n==============================");
    console.log("GEMINI API TEST SUCCESSFUL");
    console.log("==============================\n");
  } catch (error) {
    console.error("\nGemini API test failed:");
    console.error(error.message);
  }
};

testGemini();