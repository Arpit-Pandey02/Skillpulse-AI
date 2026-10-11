# SkillPulse AI — Student Skills Tracker & Career Discovery Platform

SkillPulse AI is a full-stack platform designed for undergraduate and graduate students to track technical skills, manage weekly learning goals, and discover suitable career paths through structured self-reflection, verified market evidence, and intelligent recommendation systems.

---

## Target Audience

- **Undergraduate & Graduate Students:** Students exploring potential career directions, developing technical proficiencies, and planning coursework or self-study.
- **Career Switchers & Early Explorers:** Students undecided between multiple disciplines who want data-grounded insights into skill requirements, salary benchmarks, and practical exploration projects.
- **Academic Mentors & Advisors:** A centralized reference framework for monitoring structured student competencies and milestones.

---

## Implemented Features

### 1. Authentication & Session Management
- **Secure Authentication:** JWT-based user registration and login with `bcryptjs` password hashing.
- **Profile Isolation:** Clean state for new student accounts (no unwanted pre-filled skills or goals).
- **Demo Student Persona:** Pre-configured demo student profile ("Alex Chen") for quick local exploration and evaluation without creating a new account.
- **State Persistence:** Preserves selected career status, shortlists, custom goals, and tracked skills across sessions and browser refreshes.

### 2. Skills & Goals Tracking
- **Competency Tracking:** Track skills by category (Frontend, Backend, AI/ML, Core CS, Cloud/DevOps) with mastery percentages, target hours, and verified project counts.
- **Deliberate Practice Logging:** Log practice sessions with duration and notes, automatically updating hours spent and generating activity stream entries.
- **Weekly Goal Management:** Create, prioritize, and toggle completion of time-bound learning goals.
- **Activity Feed:** Chronological timeline tracking study milestones and XP progression.

### 3. Multi-Domain Career Discovery & Search
- **Multi-Domain Exploration:** Browse careers across Technology, Healthcare, Data & Quantitative Analysis, Policy, and Engineering.
- **Real-Time Search & Filtering:** Case-insensitive search across job titles, descriptions, transferable subjects, and keywords, paired with domain filters.
- **Evidence-Grounded Profiles:** Each career profile includes explicitly labeled geographic salary benchmarks (e.g., US BLS, UK ONS), verified publication years, educational prerequisites, and clear limitations disclosure notes.
- **Exploration Mini-Projects:** Practical starter tasks to help students evaluate interest before committing to a specialty.

### 4. Deterministic Career Matcher & Recommendation Engine
- **Structured Questionnaire:** Skippable assessment covering favorite subjects, confident activities, broad interests, work environments, priorities, and education willingness.
- **Heuristic Rule-Based Scoring:** Transparent, deterministic scoring algorithm that ranks catalog careers by compatibility percentage and assigns match tiers (Strong Match, Good Match, Moderate Match) with itemized rationales.
- **Three Onboarding Flows:**
  - *Decided:* Students who already know their target role directly select their path.
  - *Comparing:* Students shortlisting and contrasting multiple roles.
  - *Undecided / Discovery:* Students seeking guidance through the questionnaire.

### 5. Optional Gemini AI Personalized Insights
- **Official SDK Integration:** Powered by the official Google `@google/genai` SDK using configurable models (defaulting to upstream-supported `gemini-3.8-flash`).
- **Personalized Synthesis:** Generates qualitative synthesis, actionable next steps, and potential blind spots based on the student's questionnaire responses.
- **Non-Destructive Augmentation:** Gemini enhances recommendations with qualitative insights; it never overrides deterministic match scores, official statistics, salary figures, or evidence citations.
- **Graceful Fallback:** If `GEMINI_API_KEY` is missing, invalid, times out, or exceeds quota, the platform continues to function seamlessly with deterministic recommendations (`geminiActive: false`).

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts |
| **Backend** | Node.js (ES Modules), Express, TypeScript (`tsx`), Mongoose |
| **Database** | MongoDB (Local Community Server or MongoDB Atlas Cloud) |
| **AI Integration** | Google Gen AI SDK (`@google/genai`), Google Gemini API |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv` |

---

## Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: A running local instance of MongoDB (Community Server) **or** a connection URI for MongoDB Atlas.
- **Google Gemini API Key (Optional):** Required only if you want live AI synthesis. If omitted, the platform functions fully using deterministic rule-based matching.

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "AI Students Skills Tracker andd Management"
```

### 2. Install Dependencies

Install root (frontend) dependencies:
```bash
npm install
```

Install server (backend) dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Configure Backend Environment Variables

In the `server` directory, copy the example environment file:
```bash
# On Linux/macOS:
cp server/.env.example server/.env

# On Windows PowerShell:
Copy-Item server/.env.example server/.env
```

Open `server/.env` in an editor and configure your variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_skills_tracker
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional Gemini Integration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

> [!NOTE]
> `server/.env` is ignored by Git and must never be committed. `server/.env.example` contains safe placeholders.

### 4. Start MongoDB

If using a local MongoDB instance, ensure the service is running:
```bash
# Example for local service on Linux/macOS:
brew services start mongodb-community

# On Windows (if installed as a service):
net start MongoDB
```
If using MongoDB Atlas, set `MONGODB_URI` in `server/.env` to your cluster connection string. If MongoDB is unavailable, the backend gracefully utilizes an in-memory database store for demonstration.

### 5. Run the Application

Open **two separate terminals**:

**Terminal 1 — Backend Server:**
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`.

**Terminal 2 — Frontend Application:**
```bash
npm run dev
```
The Vite client will start on `http://localhost:5173`.

---

## Environment Variables Reference

| Variable | Required | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `PORT` | No | Port for Express server | `5000` |
| `MONGODB_URI` | No | MongoDB connection string | `mongodb://localhost:27017/student_skills_tracker` |
| `JWT_SECRET` | Yes (in prod) | Secret key for signing JWT tokens | `replace_with_a_long_random_secret` |
| `CLIENT_URL` | No | Frontend URL for CORS configuration | `http://localhost:5173` |
| `NODE_ENV` | No | Runtime environment (`development` / `production`) | `development` |
| `GEMINI_API_KEY` | No | Google Gemini API key for personalized insights | `your_gemini_api_key_here` |
| `GEMINI_MODEL` | No | Gemini model identifier | `gemini-3.8-flash` |

---

## Verification & Health Check

- **Backend Health Check:** Visit [http://localhost:5000/api/health](http://localhost:5000/api/health).
  Expected response:
  ```json
  {
    "status": "ok",
    "databaseConnected": true,
    "timestamp": "2026-10-11T..."
  }
  ```
- **Frontend Application:** Open [http://localhost:5173](http://localhost:5173) in any modern browser.

---

## Development & Test Scripts

The `server/` directory includes standalone test scripts for automated end-to-end and regression audits:

```bash
# Verify database connection and persistence
node server/test-db-connection.js

# Verify search, clean state, and session persistence regressions
node server/test-bugfixes.js

# Verify career discovery questionnaire and recommendation routing
node server/test-discovery.js

# Verify Gemini AI integration and fallback behavior
node server/test-gemini-fallback.js

# Full end-to-end multi-path onboarding audit
node server/test-e2e-audit.js
```

> [!WARNING]
> **Test Database Safety Notice:** Several of these test scripts register test student records and mutate skills or goals to verify persistence. **Do not execute test scripts against a production MongoDB Atlas database.** Always point `MONGODB_URI` to a local test instance or dedicated sandbox database when running tests.

---

## Current Project Limitations

1. **Curated Career Catalog Scope:** The career database currently contains 8 curated roles across diverse domains (Software Engineering, Data Science, Cybersecurity, Robotics, Financial Analysis, Clinical Psychology, Tech Policy, and Mechanical Engineering). It serves as a representative foundation and does not cover all occupations.
2. **Production Hardening Required:** This project is configured for local development and demonstration. Before a public production launch, additional steps are required:
   - Configuring rate limiting on authentication routes.
   - Enabling production-grade secret management and CSRF / security headers (`helmet`).
   - Configuring production CORS and cookie policies.
   - Establishing production backup, monitoring, and disaster recovery infrastructure.

---

## License

This project is developed for educational and skill tracking purposes.
