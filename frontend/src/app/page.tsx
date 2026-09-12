"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold sm:text-2xl">
            AI Resume <span className="text-cyan-400">Analyser</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              AI-Powered Resume & Job Matching
            </p>

            <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl">
              Analyse Your Resume.
              <span className="block text-cyan-400">
                Match Your Dream Job.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Upload your resume and compare it with a job description.
              Get an AI-powered match score, missing skills, skill gaps,
              weaknesses, and personalized recommendations.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-cyan-500 px-7 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Start Analysing →
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/20 px-7 py-4 text-center font-semibold transition hover:bg-white/10"
              >
                Login to Dashboard
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-400">
              <span>✓ Resume Analysis</span>
              <span>✓ AI Matching</span>
              <span>✓ Skill Gap Analysis</span>
              <span>✓ Analysis History</span>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <div className="mb-6 flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <p className="text-sm text-slate-400">
                  Analysis Result
                </p>

                <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
                  <p className="text-sm text-slate-400">
                    Overall Match Score
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-5xl font-extrabold text-cyan-400">
                      85%
                    </span>

                    <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                      Strong Match
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold">
                      Matched Skills
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Skill text="React.js" />
                      <Skill text="Next.js" />
                      <Skill text="Node.js" />
                      <Skill text="MongoDB" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold">
                      Missing Skills
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      <p>• TypeScript</p>
                      <p>• PostgreSQL</p>
                      <p>• Docker</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-purple-400/20 bg-purple-400/5 p-4">
                  <p className="text-sm text-slate-400">
                    AI Recommendation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Highlight relevant backend and database experience
                    and strengthen your TypeScript skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Features
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Everything you need to improve your resume
            </h2>

            <p className="mt-4 text-slate-400">
              Understand how well your resume matches a specific job and
              discover where you can improve.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="📄"
              title="Resume Parsing"
              text="Upload PDF or DOCX resumes and extract useful resume information."
            />

            <Feature
              icon="🎯"
              title="Match Score"
              text="Compare your resume against a job description and receive a match score."
            />

            <Feature
              icon="🧠"
              title="AI Skill Analysis"
              text="Identify matched skills, missing skills, and important skill gaps."
            />

            <Feature
              icon="💡"
              title="Recommendations"
              text="Get practical AI-powered suggestions to improve your job alignment."
            />

            <Feature
              icon="📊"
              title="Analysis History"
              text="Save and review your previous resume analyses from your dashboard."
            />

            <Feature
              icon="🔐"
              title="Secure Authentication"
              text="Protected accounts with secure authentication and personalized analysis."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Upload Resume"
              text="Upload your PDF or DOCX resume."
            />

            <Step
              number="02"
              title="Add Job Description"
              text="Paste the job description of your target role."
            />

            <Step
              number="03"
              title="Get AI Insights"
              text="Receive your match score, gaps, weaknesses, and recommendations."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to analyse your resume?
          </h2>

          <p className="mt-4 text-slate-400">
            Start your AI-powered resume analysis today.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-center text-sm text-slate-500 sm:flex-row sm:justify-between">
          <p>
            © 2026 AI Resume Analyser and Job Match Platform
          </p>

          <p>
            Built with Next.js, Node.js, PostgreSQL & Gemini AI
          </p>
        </div>
      </footer>
    </main>
  );
}

function Skill({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
      {text}
    </span>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 font-bold text-cyan-400">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}