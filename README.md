# CareerGap AI

> **"Don't just know your match. Know your next move."**

An AI-powered career fit and skill-gap engine that compares a candidate's resume with a target job description, identifies matched and missing skills, explains the evidence strength behind the match, detects weak project citations, proposes multi-skill portfolio projects, generates an actionable roadmap with attached learning resources, and simulates role-specific mock interviews with rubric scoring.

---

## 🌟 Key Differentiators vs Legacy ATS Scorers

| Capability | Legacy ATS Resume Scorers | CareerGap AI |
| :--- | :--- | :--- |
| **Matching Logic** | Brittle keyword counting / exact string search | Semantic embedding similarity + Taxonomy normalization |
| **Evidence Quality** | Treats listed buzzwords same as production experience | Deep Evidence Checker (**Strong**, **Moderate**, **Weak**, **Not Demonstrated**) with citations |
| **Gap Resolution** | Vague suggestions to "add keywords" | **Project Gap Detector**: Generates multi-skill portfolio project architectures & quantified bullets |
| **Actionable Roadmap** | None | Milestone roadmap with verified learning resources (Docs, YouTube, Labs) |
| **Mock Interview Prep** | None | **Interview Simulator**: Gap & strength probing questions with AI rubric scoring (Relevance, Depth, Clarity 1–5) |
| **Peer Benchmarking** | Opaque black-box percentile | Anonymized aggregate cohort benchmarks per role with ahead/behind skill insights |
| **Public Sharing** | None or leaks raw resume text | Privacy-safe, read-only shareable readiness card with instant revocation |

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (React + Vite + PWA)"]
        UI[SaaS Dashboard & Analysis UI]
        State[Auth Context & TanStack Query]
    end

    subgraph Backend ["FastAPI Backend Engine"]
        API[FastAPI Routers]
        ResumeParser[Resume Parser (pypdf + Heuristics)]
        JobParser[Job Parser & URL Fetcher (BS4)]
        EvidenceEngine[Evidence Verification Engine]
        MatchingEngine[Semantic Matching & Scoring]
        GapEngine[Project Gap & Architecture Engine]
        RoadmapEngine[Roadmap & Learning Resource Matcher]
        InterviewEngine[Mock Interview & Rubric Engine]
        BenchmarkEngine[Peer Benchmark Engine]
    end

    subgraph AI_Cloud ["External Intelligence & Cloud"]
        Gemini[Google Gemini 2.5 Flash API]
        Firebase[Cloud Firestore & Auth]
        Catalog[(Skills & Learning Resource Catalog)]
    end

    UI -->|HTTPS / REST| API
    API --> ResumeParser
    API --> JobParser
    API --> EvidenceEngine
    API --> MatchingEngine
    API --> GapEngine
    API --> RoadmapEngine
    API --> InterviewEngine
    API --> BenchmarkEngine

    MatchingEngine --> Gemini
    GapEngine --> Gemini
    InterviewEngine --> Gemini
    RoadmapEngine --> Catalog
    API --> Firebase
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Sleek Dark Theme design system
- **Routing & State**: React Router DOM v7 + TanStack Query
- **Charts & Visualization**: Recharts (Radar charts, Bar distribution)
- **Gamification & Export**: Canvas Confetti, jsPDF, html2canvas
- **PWA**: Vite Plugin PWA (Installable, offline app shell)

### Backend
- **Framework**: FastAPI + Uvicorn
- **Data Validation**: Pydantic v2 + Pydantic Settings
- **AI & NLP**: Google Gemini API (`gemini-2.5-flash`), Semantic token embeddings & skill normalization taxonomy
- **Document & Web Parsing**: `pypdf`, `BeautifulSoup4`, `httpx` with SSRF domain allowlisting
- **Task Scheduling**: APScheduler

---

## 📂 Project Structure

```text
careergap-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── resume.py
│   │   │   ├── jobs.py
│   │   │   ├── analysis.py
│   │   │   ├── roadmap.py
│   │   │   ├── projects.py
│   │   │   ├── interview.py
│   │   │   ├── benchmarks.py
│   │   │   ├── sharing.py
│   │   │   └── skills.py
│   │   ├── services/
│   │   │   ├── gemini_service.py
│   │   │   ├── resume_parser.py
│   │   │   ├── job_parser.py
│   │   │   ├── job_url_fetcher.py
│   │   │   ├── embedding_service.py
│   │   │   ├── matching_engine.py
│   │   │   ├── evidence_engine.py
│   │   │   ├── gap_engine.py
│   │   │   ├── roadmap_engine.py
│   │   │   ├── resource_matcher.py
│   │   │   ├── interview_engine.py
│   │   │   ├── benchmark_engine.py
│   │   │   └── firebase_service.py
│   │   ├── models/
│   │   │   └── schemas.py
│   │   ├── config.py
│   │   └── main.py
│   ├── tests/
│   │   └── test_core.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SkillMatrixTable.tsx
│   │   │   ├── SkillDetailDrawer.tsx
│   │   │   ├── EvidenceAnalysisCard.tsx
│   │   │   ├── ProjectPlanModal.tsx
│   │   │   ├── RoadmapTimeline.tsx
│   │   │   └── ScoreBreakdownCard.tsx
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AnalyzePage.tsx
│   │   │   ├── AnalysisResultPage.tsx
│   │   │   ├── RoadmapPage.tsx
│   │   │   ├── InterviewPage.tsx
│   │   │   ├── MultiComparePage.tsx
│   │   │   ├── BenchmarksPage.tsx
│   │   │   └── SharedProfilePage.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── firebase.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── firebase/
│   ├── firestore.rules
│   └── storage.rules
│
└── README.md
```

---

## ⚡ Quick Start & Local Development

### 1. Backend Setup

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env

# Run FastAPI backend server
uvicorn app.main:app --reload --port 8000
```

Backend Swagger documentation available at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```

Frontend application available at: `http://localhost:5173`

---

## 🧪 Running Automated Tests

```bash
cd backend
.\venv\Scripts\python.exe -m pytest tests/
```

All 5 core unit tests covering skill normalization, evidence evaluation, transparent score formula, and benchmark calculations will run and validate.

---

## 🎯 4-Minute Hackathon Demo Flow

1. **Landing Page**: Click **"Try Live Demo Analysis"** (instant 1-click presentation entry).
2. **Analysis Result Page**:
   - Show **78% Job Readiness** score with transparent breakdown (Critical 40/40, High 16/30, Medium 14/20, Evidence 8/10).
   - Review **Skill Matrix**: Click `Docker` (Missing) or `AWS` (Weak) to slide open the **Skill Detail Drawer** showing exact reason and recommended action.
   - Switch to **Evidence Analysis**: Demonstrate the 4-tier distribution with direct resume citations.
   - Switch to **Project Gap Detector**: Click **"Generate Project Plan"** on *"Containerized AI Resume Analysis & Embedding API"* to inspect architecture, features, steps, and resume bullets.
   - Switch to **Personalized Roadmap**: Toggle milestone completion to trigger celebratory confetti and advance the streak counter.
3. **Mock Interview Practice**:
   - Click **"Practice Mock Interview"** from action bar.
   - Select a gap question (e.g. *Docker isolation & multi-stage builds*), type an answer, and click **Submit**.
   - Review instant **AI Rubric Scoring** (Relevance, Depth, Clarity) and improved model snippet.
4. **Peer Benchmarking & Multi-Job Compare**:
   - Review how the candidate ranks vs the 1,420 peer candidate cohort for AI/ML Engineer.
   - Inspect the **Highest-Leverage Skill Ranker** across multiple target job openings.
5. **Share Public Profile**:
   - Toggle **"Share Profile"** to generate privacy-protected read-only link `/share/demo-share-careergap-2026`.
