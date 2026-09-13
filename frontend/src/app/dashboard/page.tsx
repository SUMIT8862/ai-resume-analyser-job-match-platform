"use client";

import { useEffect, useState } from "react";

interface AnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  skillGaps: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}

interface HistoryItem {
  id: number;
  job_role: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  skill_gaps: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
  created_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");

  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [selectedAnalysis, setSelectedAnalysis] =
    useState<HistoryItem | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        setLoadingHistory(true);

        const response = await fetch(
          "/api/backend/api/analysis/history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch analysis history."
          );
        }

        setHistory(data.analyses || []);
      } catch (error: any) {
        console.error(
          "Authentication/History error:",
          error.message
        );
      } finally {
        setLoadingHistory(false);
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "/api/backend/api/analysis/history",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch analysis history."
        );
      }

      setHistory(data.analyses || []);
    } catch (error: any) {
      console.error("History error:", error.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessage("");
    setError("");
    setResumeText("");
    setAnalysisResult(null);

    const file = event.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PDF or DOCX files.");
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file must be smaller than 5 MB.");
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setLoadingUpload(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const formData = new FormData();

      formData.append("resume", resumeFile);

      const response = await fetch(
        "/api/backend/api/resume/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to upload resume."
        );
      }

      setResumeText(data.resumeText || "");

      setMessage(
        "Resume uploaded and text extracted successfully."
      );
    } catch (error: any) {
      console.error(
        "Resume upload error:",
        error.message
      );

      setError(
        error.message || "Unable to upload resume."
      );
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleAnalyse = async () => {
    if (!jobRole.trim()) {
      setError("Please enter the target job role.");
      return;
    }

    if (!resumeText.trim()) {
      setError(
        "Please upload your resume and extract the resume text first."
      );
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    try {
      setLoadingAnalysis(true);
      setMessage("");
      setError("");
      setAnalysisResult(null);

      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "/api/backend/api/analysis/analyse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobRole,
            resumeText,
            jobDescription,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to analyse resume."
        );
      }

      setAnalysisResult(data.analysis);

      setMessage(
        "Resume analysis completed successfully!"
      );

      await fetchHistory();
    } catch (error: any) {
      console.error(
        "Analysis error:",
        error.message
      );

      setError(
        error.message ||
          "Unable to analyse the resume using AI."
      );
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />

          <p className="mt-4 text-sm text-slate-400">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              AI Resume Analyser
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Resume & Job Match Platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="font-semibold">
                {user?.name || "User"}
              </p>

              <p className="text-sm text-slate-400">
                {user?.email || ""}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-10">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/50 via-slate-900 to-violet-950/40 p-8 shadow-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
              AI-Powered Resume Analysis
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back,{" "}
              <span className="text-blue-400">
                {user?.name || "User"}
              </span>
              ! 👋
            </h2>

            <p className="mt-4 max-w-2xl text-slate-400">
              Compare your resume with a specific job role and
              job description, identify skill gaps, and get
              personalized AI recommendations.
            </p>
          </div>
        </section>

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-300">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-300">
            ✕ {error}
          </div>
        )}

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              New Resume Analysis
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Enter your target job role, upload your resume,
              and paste the job description.
            </p>
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-400">
                01
              </div>

              <div>
                <h3 className="font-bold">
                  Target Job Role
                </h3>

                <p className="text-xs text-slate-500">
                  Enter the position you are targeting
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <input
                type="text"
                value={jobRole}
                onChange={(e) => {
                  setJobRole(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Full Stack Developer"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50"
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-400">
                  02
                </div>

                <div>
                  <h3 className="font-bold">
                    Upload Resume
                  </h3>

                  <p className="text-xs text-slate-500">
                    PDF or DOCX • Maximum 5 MB
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-6">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-6 py-10 text-center transition hover:border-blue-500/40 hover:bg-blue-500/5">
                  <div className="mb-4 text-4xl">
                    📄
                  </div>

                  <p className="font-semibold">
                    {resumeFile
                      ? resumeFile.name
                      : "Choose your resume"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Click to select PDF or DOCX
                  </p>

                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {resumeFile && (
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-xl">
                        📄
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {resumeFile.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {(
                            resumeFile.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>

                    <span className="text-green-400">
                      ✓
                    </span>
                  </div>
                )}

                <button
                  onClick={handleResumeUpload}
                  disabled={
                    !resumeFile || loadingUpload
                  }
                  className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loadingUpload
                    ? "Uploading & extracting..."
                    : "Upload Resume"}
                </button>

                {resumeText && (
                  <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">
                        ✓
                      </span>

                      <p className="font-semibold text-green-300">
                        Resume ready for analysis
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-green-400/70">
                      Resume text extracted successfully.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-400">
                  03
                </div>

                <div>
                  <h3 className="font-bold">
                    Job Description
                  </h3>

                  <p className="text-xs text-slate-500">
                    Paste the job requirements
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <textarea
                  value={jobDescription}
                  onChange={(e) =>
                    setJobDescription(e.target.value)
                  }
                  placeholder="Paste the job description here..."
                  className="h-72 w-full resize-none rounded-xl border border-white/10 bg-slate-900 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
                />

                <div className="mt-3 text-right text-xs text-slate-500">
                  {jobDescription.length} characters
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleAnalyse}
              disabled={
                !jobRole.trim() ||
                !resumeText ||
                !jobDescription.trim() ||
                loadingAnalysis
              }
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-lg shadow-blue-900/20 transition hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loadingAnalysis ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  AI is analysing your resume...
                </span>
              ) : (
                "Analyse Resume with AI 🚀"
              )}
            </button>
          </div>
        </section>

        {analysisResult && (
          <section className="mt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Analysis Result
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                AI-powered comparison between your resume and
                the selected job role and description.
              </p>
            </div>

            <div className="mb-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Target Job Role
              </p>

              <p className="mt-2 text-xl font-bold">
                {jobRole}
              </p>
            </div>

            <div className="mb-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl">
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Overall Match Score
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Resume Compatibility
                  </h3>
                </div>

                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-8 border-blue-500/30 bg-blue-500/10">
                  <span className="text-4xl font-extrabold text-blue-400">
                    {analysisResult.matchScore}%
                  </span>

                  <span className="text-xs text-slate-500">
                    Match
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-green-500/20 bg-slate-900/70 p-6">
                <h3 className="text-lg font-bold text-green-400">
                  ✓ Matched Skills
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysisResult.matchedSkills.length > 0 ? (
                    analysisResult.matchedSkills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-green-500/10 px-3 py-1.5 text-sm text-green-300"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-sm text-slate-500">
                      No matched skills found.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-slate-900/70 p-6">
                <h3 className="text-lg font-bold text-red-400">
                  ✕ Missing Skills
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysisResult.missingSkills.length > 0 ? (
                    analysisResult.missingSkills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-red-500/10 px-3 py-1.5 text-sm text-red-300"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-sm text-slate-500">
                      No major missing skills found.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
              <h3 className="text-lg font-bold">
                🎯 Skill Gaps
              </h3>

              <div className="mt-4 space-y-3">
                {analysisResult.skillGaps.length > 0 ? (
                  analysisResult.skillGaps.map(
                    (gap, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-white/[0.03] p-4 text-sm leading-6 text-slate-300"
                      >
                        <span className="mr-2 font-bold text-blue-400">
                          {index + 1}.
                        </span>

                        {gap}
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No major skill gaps identified.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
              <h3 className="text-lg font-bold">
                ⚠️ Resume Weaknesses
              </h3>

              <div className="mt-4 space-y-3">
                {analysisResult.weaknesses.length > 0 ? (
                  analysisResult.weaknesses.map(
                    (weakness, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-white/[0.03] p-4 text-sm leading-6 text-slate-300"
                      >
                        <span className="mr-2 font-bold text-orange-400">
                          {index + 1}.
                        </span>

                        {weakness}
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No major weaknesses identified.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
              <h3 className="text-lg font-bold text-blue-400">
                💡 AI Recommendations
              </h3>

              <div className="mt-4 space-y-3">
                {analysisResult.recommendations.length > 0 ? (
                  analysisResult.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-slate-900/70 p-4 text-sm leading-6 text-slate-300"
                      >
                        <span className="mr-2 font-bold text-blue-400">
                          {index + 1}.
                        </span>

                        {recommendation}
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No recommendations available.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
              <h3 className="text-lg font-bold text-violet-400">
                🤖 AI Summary
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {analysisResult.summary}
              </p>
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold">
                Your Records
              </h2>

              <h3 className="mt-5 text-xl font-bold">
                Analysis History
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Review your previous resume analyses.
              </p>
            </div>

            <button
              onClick={fetchHistory}
              disabled={loadingHistory}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-40"
            >
              {loadingHistory
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center">
              <div className="text-4xl">📊</div>

              <h3 className="mt-4 font-bold">
                No analyses yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your completed analyses will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg transition hover:border-blue-500/20"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-400">
                          {item.match_score}%
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold">
                            Resume Analysis #{index + 1}
                          </h3>

                          <p className="mt-1 text-sm font-semibold text-violet-300">
                            {item.job_role ||
                              "Job role not available"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-green-300">
                          {item.matched_skills?.length || 0}{" "}
                          matched
                        </span>

                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-300">
                          {item.missing_skills?.length || 0}{" "}
                          missing
                        </span>

                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-300">
                          {item.recommendations?.length || 0}{" "}
                          recommendations
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedAnalysis(item)
                      }
                      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold transition hover:bg-blue-500"
                    >
                      View Analysis →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedAnalysis && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedAnalysis(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  {formatDate(
                    selectedAnalysis.created_at
                  )}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Previous Analysis
                </h2>

                <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Target Job Role
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {selectedAnalysis.job_role ||
                      "Job role not available"}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedAnalysis(null)
                }
                className="rounded-lg bg-white/5 px-3 py-2 text-lg transition hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
              <p className="text-sm text-slate-500">
                Match Score
              </p>

              <p className="mt-2 text-5xl font-extrabold text-blue-400">
                {selectedAnalysis.match_score}%
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-bold text-green-400">
                ✓ Matched Skills
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedAnalysis.matched_skills?.length > 0 ? (
                  selectedAnalysis.matched_skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-green-500/10 px-3 py-1.5 text-sm text-green-300"
                      >
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No matched skills found.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-bold text-red-400">
                ✕ Missing Skills
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedAnalysis.missing_skills?.length > 0 ? (
                  selectedAnalysis.missing_skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-red-500/10 px-3 py-1.5 text-sm text-red-300"
                      >
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No major missing skills found.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-bold">
                🎯 Skill Gaps
              </h3>

              <div className="mt-4 space-y-3">
                {selectedAnalysis.skill_gaps?.length > 0 ? (
                  selectedAnalysis.skill_gaps.map(
                    (gap, index) => (
                      <p
                        key={index}
                        className="text-sm leading-6 text-slate-300"
                      >
                        {index + 1}. {gap}
                      </p>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No major skill gaps identified.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-bold">
                ⚠️ Resume Weaknesses
              </h3>

              <div className="mt-4 space-y-3">
                {selectedAnalysis.weaknesses?.length > 0 ? (
                  selectedAnalysis.weaknesses.map(
                    (weakness, index) => (
                      <p
                        key={index}
                        className="text-sm leading-6 text-slate-300"
                      >
                        {index + 1}. {weakness}
                      </p>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No major weaknesses identified.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <h3 className="font-bold text-blue-400">
                💡 AI Recommendations
              </h3>

              <div className="mt-4 space-y-3">
                {selectedAnalysis.recommendations?.length > 0 ? (
                  selectedAnalysis.recommendations.map(
                    (recommendation, index) => (
                      <p
                        key={index}
                        className="text-sm leading-6 text-slate-300"
                      >
                        {index + 1}. {recommendation}
                      </p>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No recommendations available.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
              <h3 className="font-bold text-violet-400">
                🤖 AI Summary
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {selectedAnalysis.summary}
              </p>
            </div>

            <button
              onClick={() =>
                setSelectedAnalysis(null)
              }
              className="mt-6 w-full rounded-xl bg-white/10 px-5 py-3 font-bold transition hover:bg-white/15"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}