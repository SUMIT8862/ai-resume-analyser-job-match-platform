# AI Resume Analyser and Job Match Platform

An AI-powered full-stack web application that analyses a resume against a job description and provides a detailed job-matching report.

The platform helps job seekers understand how well their resume matches a target role, identify missing skills, discover skill gaps, understand resume weaknesses, and receive personalized improvement recommendations.

## 🚀 Features

* User Registration and Login
* Secure JWT Authentication
* Strong Password Validation
* Forgot Password functionality
* Email-based Password Reset
* PDF Resume Upload
* DOCX Resume Upload
* Resume Text Extraction
* Job Description Analysis
* AI-Powered Resume and Job Matching
* Overall Match Score
* Matched Skills Detection
* Missing Skills Detection
* Skill Gap Analysis
* Resume Weakness Detection
* AI-Powered Recommendations
* AI-Generated Resume Summary
* Analysis History
* Previous Analysis Viewing
* Protected Dashboard
* File Type Validation
* File Size Validation
* Responsive and Mobile-Friendly UI

## 🧠 How It Works

```text
User
  ↓
Upload Resume
  ↓
Paste Job Description
  ↓
Resume Text Extraction
  ↓
AI Analysis
  ↓
Resume vs Job Description Comparison
  ↓
Match Score + Skill Analysis
  ↓
Save Result to PostgreSQL
  ↓
View Analysis History
```

## 🛠️ Tech Stack

### Frontend

* Next.js
* React.js
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* REST API

### Database

* PostgreSQL

### AI

* Google Gemini API

### Resume Processing

* PDF Parser
* Mammoth

### Authentication & Security

* JWT
* bcrypt
* Password Reset Tokens

### Email

* Nodemailer
* Gmail SMTP

### Development Tools

* Git
* GitHub
* VS Code
* npm
* Nodemon

## 📂 Project Structure

```text
AI Resume Analyser and Job Match Platform
│
├── frontend
│   ├── src
│   │   └── app
│   │       ├── dashboard
│   │       ├── forgot-password
│   │       ├── login
│   │       ├── register
│   │       ├── reset-password
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   │
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 🔐 Authentication

The application uses JWT-based authentication to protect user-specific functionality.

Password security is handled using bcrypt hashing.

The application also provides a secure password recovery flow:

```text
Forgot Password
      ↓
Email Reset Link
      ↓
Reset Password
      ↓
Password Updated
      ↓
Login with New Password
```

## 🤖 AI Analysis

The Gemini API analyses the resume and job description and returns:

* Match Score
* Matched Skills
* Missing Skills
* Skill Gaps
* Resume Weaknesses
* AI Recommendations
* AI Summary

The analysis prompt is designed to use evidence from the provided resume and job description and avoid unsupported assumptions.

## 📊 Example Analysis

A typical analysis can contain:

```text
Overall Match Score: 85%

Matched Skills:
- JavaScript
- React.js
- Next.js
- Node.js
- MongoDB
- JWT Authentication

Missing Skills:
- TypeScript
- PostgreSQL
- Docker

Skill Gaps:
- Backend API framework requirements
- PostgreSQL database experience
- TypeScript and modern frontend tooling

Recommendations:
- Highlight relevant backend experience
- Strengthen missing technical skills
- Improve alignment between resume skills and target job requirements
```

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Move into the project directory:

```bash
cd "AI Resume Analyser and Job Match Platform"
```

## 📦 Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail_address
SMTP_PASS=your_gmail_app_password
```

Start the backend:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

## 💻 Frontend Setup

Open another terminal and move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:3000
```

## 🗄️ Database

The project uses PostgreSQL.

The database stores:

* User accounts
* Password hashes
* Password reset information
* Resume analysis records
* Match scores
* Skill analysis
* Recommendations
* Analysis history

Make sure PostgreSQL is installed and running before starting the backend.

## 🔑 Environment Variables

Do not commit `.env` files or API keys to GitHub.

The following values must remain private:

```text
JWT_SECRET
GEMINI_API_KEY
SMTP_USER
SMTP_PASS
DATABASE_URL
```

Add `.env` to `.gitignore` before pushing the project to GitHub.

## 🧪 Testing

The project has been tested for:

* User registration
* User login
* Strong password validation
* JWT authentication
* Protected dashboard access
* Resume upload
* PDF/DOCX validation
* File size validation
* Resume text extraction
* Job description analysis
* Gemini AI analysis
* PostgreSQL data storage
* Analysis history
* Forgot password
* Email password reset
* Invalid reset token handling
* Logout protection
* Responsive desktop UI
* Responsive mobile UI

## 📱 Responsive Design

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

## 🎯 Future Improvements

Possible future improvements include:

* Resume keyword optimization
* ATS score analysis
* Resume recommendations
* Multiple resume versions
* Multiple job comparison
* Job recommendation system
* PDF report generation
* LinkedIn profile analysis
* Advanced analytics dashboard
* Cloud deployment
* Role-based administration
* More AI providers

## 🔮 Project Goal

The goal of this project is to build an intelligent platform that helps job seekers understand the gap between their current resume and the requirements of a target job.

Instead of only showing a generic resume score, the platform provides actionable insights that help users improve their skills, resume content, and job alignment.

## 👨‍💻 Developer

**Sumit Kumar**

B.Tech in Computer Science and Engineering

Arka Jain University, Jamshedpur, Jharkhand

## 📄 License

This project is developed for educational, portfolio, and demonstration purposes.
