# CareerAI - AI-Powered Career Growth Platform

Transform your career with AI-powered resume analysis, skills gap identification, and personalized learning roadmaps.

## 🎯 Architecture

```
Frontend (Next.js) ──────────▶ Vercel
        │
        │ REST API
        ▼
Backend Gateway (Next API) ──▶ Vercel
        │
        │ HTTP (JSON)
        ▼
Python ML Service ───────────▶ Render / Fly.io
```

## 🚀 Features

- **Resume Analyzer** - Get instant AI analysis with ATS compatibility scores
- **Skills Gap Analysis** - Identify missing skills and learning priorities
- **90-Day Roadmap** - Personalized improvement plan
- **Resume Comparison** - Compare with recruiter-approved samples
- **Career Guidance** - AI-powered insights and recommendations

## 🛠️ Tech Stack

### Frontend & API Gateway
- **Framework**: Next.js 14, TypeScript, React
- **Styling**: Tailwind CSS, shadcn/ui
- **API Gateway**: Next.js API Routes (forwards to Python ML service)
- **Deployment**: Vercel

### Python ML Service
- **Framework**: FastAPI, Python 3.11+
- **NLP**: spaCy for text processing
- **ML**: scikit-learn for analysis
- **Parsing**: PyPDF2, python-docx
- **Deployment**: Render or Fly.io

## 📦 Installation & Setup

### Option 1: Local Development (Full Stack)

#### 1. Python ML Service

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Run ML service
uvicorn main:app --reload --port 8000
```

Service runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

#### 2. Frontend & API Gateway

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local:
# PYTHON_ML_SERVICE_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend runs at: http://localhost:3000

### Option 2: Frontend Only (Mock Data)

```bash
cd frontend
npm install
npm run dev
```

The app will use mock data when Python ML service is unavailable.

## 🔑 Environment Variables

### Frontend (.env.local)
```env
# Python ML Service URL
PYTHON_ML_SERVICE_URL=http://localhost:8000

# App Config
NEXT_PUBLIC_APP_NAME=CareerAI
```

### Backend (.env)
```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true

# CORS - Allow Vercel frontend
CORS_ORIGINS=http://localhost:3000,https://*.vercel.app

# Security
SECRET_KEY=your_secret_key_change_in_production
```

## 🚀 Deployment

For complete deployment instructions, see [ARCHITECTURE.md](ARCHITECTURE.md)

### Quick Deploy Summary

#### 1. Deploy Python ML Service (Render)
```bash
# Push your code to GitHub

# On Render:
# - New Web Service
# - Connect GitHub repo
# - Root: backend
# - Build: pip install -r requirements.txt && python -m spacy download en_core_web_sm
# - Start: uvicorn main:app --host 0.0.0.0 --port $PORT
# - Add env var: SECRET_KEY
```

#### 2. Deploy Frontend (Vercel)
```bash
# On Vercel:
# - Import GitHub repo
# - Root Directory: frontend
# - Framework: Next.js
# - Add env var: PYTHON_ML_SERVICE_URL=https://your-ml.onrender.com
# - Deploy
```

#### 3. Connect Services
Update Render CORS settings with your Vercel URL:
```
CORS_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

## 📁 Project Structure

```
├── frontend/                    # Next.js Frontend & API Gateway
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/            # API Gateway routes
│   │   │   │   ├── analyze-resume/
│   │   │   │   ├── skills-gap/
│   │   │   │   ├── compare-resumes/
│   │   │   │   └── roadmap/
│   │   │   ├── analyze/        # Resume analyzer page
│   │   │   ├── skills/         # Skills gap page
│   │   │   ├── roadmap/        # Career roadmap page
│   │   │   └── compare/        # Resume comparison page
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   └── resume/        # Analyzer components
│   │   └── lib/
│   │       └── api.ts         # API client
│   └── package.json
│
├── backend/                    # Python ML Service
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py      # FastAPI endpoints
│   │   ├── ml/
│   │   │   ├── parser.py      # Resume parsing
│   │   │   └── analyzer.py    # ML analysis
│   │   ├── services/
│   │   │   ├── analyzer_service.py
│   │   │   ├── skills_service.py
│   │   │   └── report_service.py
│   │   └── core/
│   │       └── config.py      # Configuration
│   ├── main.py               # FastAPI app
│   ├── requirements.txt
│   └── render.yaml           # Render config
│
└── ARCHITECTURE.md           # Detailed architecture guide
```
│   └── lib/
│       ├── resume-utils.ts         # Text extraction utilities
│       └── api.ts                  # API client functions
├── public/
└── package.json
```

## 🔧 API Endpoints

### POST /api/analyze-resume
Analyzes resume and returns:
- ATS score
- Verdict
- Missing skills
- Skills gap analysis
- 90-day improvement roadmap

**Request:**
```json
{
  "resumeText": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "ats_score": 75,
  "verdict": "Good resume, needs improvements",
  "missing_skills": ["TypeScript", "Docker"],
  "weak_sections": ["Projects", "Skills"],
  "roadmap": [...],
  "skills_gap": {
    "current_skills": ["JavaScript", "React"],
    "skill_gaps": [...]
  }
}
```

### POST /api/extract-text
Extracts text from PDF/DOCX files server-side.

## 🎨 Customization

### Branding
- Update logo in `src/components/layout/navbar.tsx`
- Modify colors in `tailwind.config.ts`
- Edit metadata in `src/app/layout.tsx`

### AI Model
Change the model in `src/app/api/analyze-resume/route.ts`:
```typescript
model: 'llama-3.1-8b-instant' // or other Groq models
```

## 📊 Why No Separate Backend?

This project uses **Next.js API Routes** (serverless functions) instead of a separate Python backend. This means:

✅ **Simpler deployment** - Everything deploys together on Vercel
✅ **Better performance** - Edge functions close to users
✅ **Automatic scaling** - Serverless = infinite scale
✅ **Lower costs** - Pay only for what you use
✅ **No server management** - Vercel handles everything

The API routes (`/api/*`) run as serverless functions on Vercel's infrastructure and can:
- Call external APIs (Groq)
- Process files (PDF parsing)
- Handle complex logic
- Connect to databases if needed

## 🗄️ Adding a Database (Optional)

If you want to add Supabase for storing user data:

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Add Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Supabase Client

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 4. Example: Store Analysis Results

```typescript
// In your API route
await supabase
  .from('analyses')
  .insert({
    user_id: userId,
    ats_score: results.ats_score,
    analysis_date: new Date(),
  })
```

## 🆘 Troubleshooting

### PDF Upload Not Working
- Clear browser cache
- Try a different PDF file
- Check browser console for errors

### AI Analysis Fails
- Verify GROQ_API_KEY is set correctly
- Check Groq API quota/limits
- Ensure resume has readable text

### Deployment Issues
- Ensure `frontend` is set as root directory in Vercel
- Check build logs for errors
- Verify environment variables are set

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ for job seekers worldwide
