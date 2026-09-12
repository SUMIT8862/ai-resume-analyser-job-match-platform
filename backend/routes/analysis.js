const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const ai = require("../utils/gemini");
const pool = require("../config/db");

const router = express.Router();

// ======================================================
// Analyse Resume + Job Description
// ======================================================

router.post("/analyse", authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    // =========================
    // Validate Resume Text
    // =========================

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required.",
      });
    }

    // =========================
    // Validate Job Description
    // =========================

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required.",
      });
    }

    // =========================
    // Gemini Prompt
    // =========================

    const prompt = `
You are an expert AI Resume Analyser and Job Matching Assistant.

Your task is to compare a candidate's resume with a job description and provide an accurate, evidence-based analysis.

IMPORTANT:
You must analyze ONLY the information explicitly available in the resume and job description.

Do NOT invent, assume, or speculate about candidate information.

======================================================
RESUME
======================================================

${resumeText}

======================================================
JOB DESCRIPTION
======================================================

${jobDescription}

======================================================
ANALYSIS REQUIREMENTS
======================================================

Return ONLY valid JSON using exactly this structure:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "skillGaps": [],
  "weaknesses": [],
  "recommendations": [],
  "summary": ""
}

======================================================
RULES FOR MATCH SCORE
======================================================

1. matchScore must be a number between 0 and 100.

2. The score should represent how closely the resume matches the important requirements of the job description.

3. Consider:
   - Required technical skills
   - Relevant experience
   - Relevant projects
   - Education when relevant
   - Tools and technologies
   - AI/API experience when relevant

4. Do not give a high score simply because many generic skills match.

5. Do not give a low score simply because a few optional skills are missing.

6. Required skills should have more importance than "Good to Have" skills.

======================================================
RULES FOR MATCHED SKILLS
======================================================

1. Include skills that are clearly present in the resume AND relevant to the job description.

2. Skills may appear in:
   - Technical Skills
   - Professional Experience
   - Projects
   - Certifications
   - Other clearly stated resume sections

3. Do not infer a skill just because another related skill is present.

Example:
If the resume says "Node.js", do NOT automatically claim "Express.js".

If the resume says "React.js", do NOT automatically claim "TypeScript".

If the resume says "MongoDB", do NOT automatically claim "PostgreSQL".

4. Preserve the actual technology names where possible.

======================================================
RULES FOR MISSING SKILLS
======================================================

1. Include important skills that are required or strongly preferred by the job description but are NOT clearly present in the resume.

2. Do not include every optional skill automatically.

3. Prioritize important missing skills.

4. Do not mark a skill as missing if the resume clearly mentions an equivalent technology that genuinely satisfies the requirement.

5. However, do not treat related technologies as identical when they are technically different.

Example:
MongoDB does not equal PostgreSQL.

MySQL does not equal PostgreSQL.

Node.js does not automatically equal Express.js.

React.js does not automatically equal TypeScript.

6. If a skill is only listed under "Good to Have" and is absent from the resume, it should normally have lower priority than missing required skills.

======================================================
RULES FOR SKILL GAPS
======================================================

1. Explain the most important differences between the resume and job description.

2. Each skill gap must be based on explicit evidence from the resume and job description.

3. Keep skill gaps concise and useful.

4. Do not repeat the entire job description.

5. Do not invent experience, projects, technologies, or qualifications.

6. A skill gap should explain WHY the difference matters for the target role.

======================================================
STRICT RULES FOR WEAKNESSES
======================================================

This section is extremely important.

Only report a resume weakness when there is clear evidence in the resume.

DO NOT make speculative assumptions.

Do NOT treat the following as weaknesses by themselves:

- Being a student
- Having an expected graduation year
- Being an undergraduate
- Not having full-time work experience
- Being a fresher
- Missing an optional skill
- Not mentioning availability
- Not mentioning a salary
- Not mentioning a location preference
- Not mentioning a driver's license
- Not mentioning unrelated information
- A graduation year that is in the future
- A normal past employment date
- A current employment date

Do NOT say that a candidate may have an availability conflict unless the resume explicitly creates such a contradiction.

Do NOT describe a date as "future" simply because it is later than another date.

A date should only be flagged when there is an actual logical contradiction, such as:

- An impossible sequence of education or employment
- Clearly overlapping roles that cannot reasonably coexist
- A date that conflicts with another explicitly stated date
- An internally contradictory timeline

IMPORTANT DATE RULE:

A normal historical date such as June 2025 - July 2025 is NOT a future date when analyzing a resume in 2026.

An achievement such as "IBM Hackathon 2026" is NOT automatically a timeline problem.

"Expected Graduation: 2027" is NOT a timeline problem.

Only identify a timeline weakness if the resume contains an actual contradiction.

If there are no meaningful evidence-based weaknesses, return an empty weaknesses array.

======================================================
RULES FOR RECOMMENDATIONS
======================================================

1. Recommendations must be practical and personalized.

2. Recommendations should directly address:
   - Important missing skills
   - Genuine resume weaknesses
   - Missing evidence of relevant experience
   - Opportunities to improve alignment with the job

3. Do not recommend learning a technology that is already clearly present in the resume.

4. Do not recommend correcting a date unless an actual date inconsistency exists.

5. Do not recommend changes based on assumptions.

6. If the candidate already has a skill but it is not clearly presented, you may recommend making that skill more visible in the resume.

Example:
If Express.js is actually used in a project but only Node.js is listed, recommend explicitly mentioning Express.js.

======================================================
RULES FOR SUMMARY
======================================================

1. Write a short professional assessment.

2. Mention the candidate's strongest relevant areas.

3. Mention the most important gaps if they exist.

4. Do not make unsupported claims.

5. Do not speculate about hiring decisions.

6. Do not say the candidate will or will not get the job.

======================================================
GENERAL ACCURACY RULES
======================================================

1. Use only evidence from the provided resume and job description.

2. Never invent information.

3. Never assume a related technology is the same technology.

4. Never turn an absence of information into a negative fact.

5. Distinguish between:
   - "Not mentioned in the resume"
   - "Actually missing from the candidate's experience"

If a technology is not mentioned, say it is "not clearly mentioned in the resume" rather than claiming the candidate does not know it.

6. Avoid unnecessary repetition.

7. Keep arrays concise and useful.

8. Return professional language suitable for a job seeker.

9. Do not include markdown.

10. Do not include code fences.

11. Return ONLY the JSON object.

======================================================
FINAL JSON FORMAT
======================================================

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "skillGaps": [],
  "weaknesses": [],
  "recommendations": [],
  "summary": ""
}
`;

    // =========================
    // Call Gemini
    // =========================

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    // =========================
    // Get Gemini Response
    // =========================

    let aiText = response.text.trim();

    aiText = aiText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // =========================
    // Convert Gemini Response
    // into JSON
    // =========================

    let analysis;

    try {
      analysis = JSON.parse(aiText);
    } catch (parseError) {
      console.error(
        "Gemini JSON parsing error:",
        parseError.message
      );

      console.error("Gemini raw response:", aiText);

      return res.status(500).json({
        success: false,
        message:
          "AI returned an invalid analysis format. Please try again.",
      });
    }

    // =========================
    // Validate Gemini Result
    // =========================

    if (
      typeof analysis.matchScore !== "number" ||
      !Array.isArray(analysis.matchedSkills) ||
      !Array.isArray(analysis.missingSkills) ||
      !Array.isArray(analysis.skillGaps) ||
      !Array.isArray(analysis.weaknesses) ||
      !Array.isArray(analysis.recommendations) ||
      typeof analysis.summary !== "string"
    ) {
      return res.status(500).json({
        success: false,
        message: "AI returned an incomplete analysis.",
      });
    }

    // =========================
    // Keep Match Score Safe
    // =========================

    analysis.matchScore = Math.max(
      0,
      Math.min(100, Math.round(analysis.matchScore))
    );

    // =========================
    // Get Logged-in User ID
    // =========================

    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication information is missing.",
      });
    }

    // =========================
    // Save Analysis to PostgreSQL
    // =========================

    const insertQuery = `
      INSERT INTO analyses (
        user_id,
        resume_text,
        job_description,
        match_score,
        matched_skills,
        missing_skills,
        skill_gaps,
        weaknesses,
        recommendations,
        summary
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
      RETURNING id, created_at
    `;

    const values = [
      userId,
      resumeText,
      jobDescription,
      analysis.matchScore,
      JSON.stringify(analysis.matchedSkills),
      JSON.stringify(analysis.missingSkills),
      JSON.stringify(analysis.skillGaps),
      JSON.stringify(analysis.weaknesses),
      JSON.stringify(analysis.recommendations),
      analysis.summary,
    ];

    const result = await pool.query(
      insertQuery,
      values
    );

    // =========================
    // Send Final Response
    // =========================

    res.status(200).json({
      success: true,
      message:
        "Resume analysis completed and saved successfully.",

      analysisId: result.rows[0].id,

      createdAt: result.rows[0].created_at,

      analysis,
    });
  } catch (error) {
    console.error(
      "Gemini resume analysis error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to analyse the resume using AI.",
    });
  }
});

// ======================================================
// Get Analysis History
// ======================================================

router.get("/history", authMiddleware, async (req, res) => {
  try {
    // =========================
    // Get Logged-in User ID
    // =========================

    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication information is missing.",
      });
    }

    // =========================
    // Fetch User's Analyses
    // =========================

    const result = await pool.query(
      `
      SELECT
        id,
        match_score,
        matched_skills,
        missing_skills,
        skill_gaps,
        weaknesses,
        recommendations,
        summary,
        created_at
      FROM analyses
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    // =========================
    // Send History
    // =========================

    res.status(200).json({
      success: true,
      message: "Analysis history fetched successfully.",
      analyses: result.rows,
    });
  } catch (error) {
    console.error(
      "Analysis history error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch analysis history.",
    });
  }
});

module.exports = router;