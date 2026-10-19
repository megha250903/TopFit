# TopFit — AI Resume Screening & Candidate Shortlisting

A production-quality React frontend for **TopFit**, an AI-powered resume screening and candidate ranking application built with React 18, Vite, TypeScript, and a light-pink modern UI design system.

---

## 🎨 Design System & Theme
- **Color Palette:**
  - Background: `blush` (`#fff6f9`)
  - Accent / Surfaces: `petal` (`#ffe4ed`), `petal-dark` (`#ffd1e1`)
  - Borders / Dividers: `line` (`#f7cfdd`)
  - Soft Highlights: `rose` (`#f28fb0`)
  - Primary Action / Brand: `berry` (`#d6336c`), `berry-dark` (`#b02458`)
  - Text: `plum` (`#3a1b29`), muted: `#8c6676`
  - Positive match: `success` (`#2f9e72`)
- **Typography:**
  - Headings: `Bricolage Grotesque` (via `@fontsource/bricolage-grotesque`)
  - Body: `DM Sans` (via `@fontsource/dm-sans`)
- **Components:**
  - Custom Tailwind & Radix UI primitives (`Button`, `Card`, `Badge`, `Progress`, `Tabs`, `Tooltip`, `Slider`, `Switch`)
  - Animated SVG circular score rings with live counters
  - Framer Motion orchestrated staggered entrances (respecting `prefers-reduced-motion`)
  - Sonner toasts for notifications and feedback

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+ (tested on Node v22)
- **Python**: 3.10+ (for running the FastAPI backend)

### 2. Frontend Setup & Run
From the root directory:

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

Vite is pre-configured to proxy all `/api/*` requests directly to `http://localhost:8000`.

---

### 3. Backend Setup & Run (FastAPI)
The backend service handles role analysis and resume scoring using Groq's high-speed inference.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Verify backend .env file has your GROQ_API_KEY:
# GROQ_API_KEY=gsk_...

# 5. Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The FastAPI backend will run on **http://localhost:8000**.
API Documentation (Swagger) will be accessible at: **http://localhost:8000/docs**

---

## 🔄 Application Flow

1. **Step 1: Job Description**
   - Paste job requirements or upload a PDF/DOCX/TXT job file.
   - Requires at least 30 characters.
   - Includes a **"Load sample job"** button for instant testing with a Full-Stack Developer role.

2. **Step 2: Candidate Resumes**
   - Drag & drop or select multiple resumes (PDF, DOCX, TXT).
   - Displayed as chips with file type badges and individual remove buttons.
   - Duplicate uploads are automatically prevented.

3. **Step 3: Screening & Live Ranking**
   - Click **"Rank candidates"**.
   - `POST /api/job` is called once to parse role criteria, required skills, preferred skills, and minimum experience.
   - Then `POST /api/score` is called for each resume sequentially with a live progress bar (*"Scoring resume 3 of 10"*).
   - **Fault-Tolerant:** If an unreadable or scanned PDF fails, it produces a clear error card and the batch continues without interruption.
   - Candidates are automatically inserted and re-sorted live by score (highest first).

4. **Step 4: Results & Filters**
   - Circular score rings (>=75 green, 50-74 berry, <50 muted pink-grey).
   - Match label pills (*Strong match*, *Possible match*, *Weak match*).
   - Recruiter verdict box in petal tint.
   - Two-column skill tags: **Matching skills** (green) and **Missing skills** (dashed pink outline).
   - Top candidate gets a highlighted border.
   - Filter bar with minimum score slider and "Experience met only" switch.
   - **Download CSV** button exporting the ranked shortlist.

---

## 📁 Project Structure

```text
├── index.html                   # HTML template with metadata and fonts
├── package.json                 # React 18, Vite, Tailwind, Radix UI, TanStack Query
├── tailwind.config.js           # Custom light-pink palette & typography tokens
├── vite.config.ts               # Proxy configuration to http://localhost:8000
├── tsconfig.app.json            # Path alias @ -> ./src
│
├── src/
│   ├── main.tsx                 # QueryClientProvider & React StrictMode
│   ├── App.tsx                  # Main layout: Navbar, Hero, Sticky Workspace
│   ├── index.css                # Font imports & custom scrollbar / utility classes
│   │
│   ├── components/
│   │   ├── Navbar.tsx           # Brand mark, status indicator & CTA
│   │   ├── Hero.tsx             # Headline, scroll action, tilted sample cards
│   │   ├── JobInput.tsx         # Paste / upload tabs, validation, sample loader
│   │   ├── ResumeDropzone.tsx   # React Dropzone with chips and duplicate check
│   │   ├── BatchProgress.tsx    # Progress bar and isolated error cards
│   │   ├── ResultsPanel.tsx     # Shortlist container, filters, and CSV export
│   │   ├── CandidateCard.tsx    # Candidate card with score ring, verdict, skills
│   │   ├── ScoreRing.tsx        # Animated circular score ring (SVG)
│   │   ├── EmptyState.tsx       # Illustrated placeholder before screening
│   │   └── ui/                  # Radix UI + Tailwind design components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── progress.tsx
│   │       ├── slider.tsx
│   │       ├── switch.tsx
│   │       ├── tabs.tsx
│   │       └── tooltip.tsx
│   │
│   ├── hooks/
│   │   └── useScreening.ts      # Batch pipeline state, live sorting & demo data
│   │
│   └── lib/
│       ├── api.ts               # Typed fetch client with friendly error formatting
│       ├── csv.ts               # UTF-8 BOM CSV exporter with escaped cells
│       ├── types.ts             # Backend API & candidate UI TypeScript interfaces
│       └── utils.ts             # Tailwind class merging & format helpers
│
└── backend/
    ├── main.py                  # FastAPI implementation of /api/job & /api/score
    ├── requirements.txt         # FastAPI, Groq, PyPDF, python-docx
    └── .env                     # GROQ_API_KEY and service credentials
```

---

## 🛡️ Quality & Accessibility
- **Responsive**: Fully responsive down to 360px mobile viewports.
- **Accessible**: ARIA live regions for batch updates (`aria-live="polite"`), visible focus rings (`focus-ring`), and respect for `prefers-reduced-motion`.
- **Text Safety**: All candidate text and descriptions are safely escaped by React (zero `dangerouslySetInnerHTML`).
