# 📋 System Architecture

AI Resume & Career Intelligence System - Complete Architecture Documentation

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE (Vercel)                    │
│                    Next.js 14 + TailwindCSS                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Resume Upload (Drag & Drop)                            │  │
│  │ • Job Description Input                                 │  │
│  │ • Results Dashboard (Score, Skills, Roadmap)            │  │
│  │ • Responsive Design (Mobile-First)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────────────────────┘
                 │ HTTPS REST API
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API (Render/Railway)                  │
│                      FastAPI (Python 3.11)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Endpoints:                                               │  │
│  │ • POST /analyze          → Resume Analysis              │  │
│  │ • POST /extract-text     → Text Extraction              │  │
│  │ • POST /skills-gap       → Skill Gap Analysis           │  │
│  │ • POST /roadmap          → Learning Roadmap             │  │
│  │ • GET /health            → Health Check                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Services Layer:                                          │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Resume Parser                                  │  │  │
│  │  │ • PDF extraction (pdfplumber)                 │  │  │
│  │  │ • DOCX extraction (python-docx)               │  │  │
│  │  │ • Multi-page support                          │  │  │
│  │  │ • Table extraction                            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Text Embedder (Sentence Transformers)         │  │  │
│  │  │ • Model: all-MiniLM-L6-v2 (384 dims)          │  │  │
│  │  │ • Semantic similarity calculation              │  │  │
│  │  │ • Chunk-based processing                       │  │  │
│  │  │ • GPU optional, CPU fallback                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Similarity Search (FAISS or NumPy)             │  │  │
│  │  │ • Vector indexing for fast search              │  │  │
│  │  │ • L2 normalization for cosine similarity       │  │  │
│  │  │ • Batch processing support                     │  │  │
│  │  │ • FAISS optional, numpy fallback               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Deterministic Scorer                           │  │  │
│  │  │ • Skills Match (35% weight)                    │  │  │
│  │  │ • Experience Relevance (25% weight)            │  │  │
│  │  │ • Keyword Coverage (20% weight)                │  │  │
│  │  │ • Role Alignment (20% weight)                  │  │  │
│  │  │ • Factual scoring (no hallucination)           │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Skill Extractor                                │  │  │
│  │  │ • 4000+ skill taxonomy (by category)           │  │  │
│  │  │ • Pattern matching with boundaries             │  │  │
│  │  │ • Section-specific extraction                  │  │  │
│  │  │ • Skill importance classification              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ LLM Reasoner (Groq or OpenAI)                  │  │  │
│  │  │ • Rejection explanation generation             │  │  │
│  │  │ • 90-day roadmap generation                    │  │  │
│  │  │ • Free resources only (no paywall)             │  │  │
│  │  │ • Fallback responses when API unavailable      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Text Cleaner (Utilities)                       │  │  │
│  │  │ • Unicode normalization                        │  │  │
│  │  │ • Whitespace fixing                            │  │  │
│  │  │ • Section extraction                           │  │  │
│  │  │ • Contact info extraction                      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Diagram

```
User Uploads Resume + Job Description
            │
            ▼
    ┌──────────────────┐
    │ Frontend (React) │ Validates file & input
    └────────┬─────────┘
             │
             ▼
        FormData → HTTP POST /analyze
             │
             ▼
    ┌──────────────────────────────┐
    │  Backend: /analyze Endpoint  │
    └────────┬─────────────────────┘
             │
             ├─► Resume Parser        Extract text from PDF/DOCX
             │   └─► Text Cleaner      Normalize formatting
             │
             ├─► Skill Extractor      Extract required & present skills
             │
             ├─► Embedder             Generate semantic embeddings
             │   └─► Scorer            Calculate 4 sub-scores
             │       └─► FAISS Index   Find similar chunks
             │
             ├─► LLM Reasoner (Groq)
             │   ├─► If score < 70: Generate rejection reasons
             │   └─► Always: Generate 90-day roadmap
             │
             └─► Compile Results
                 {
                   "score": 82,
                   "sub_scores": {...},
                   "rejection_reasons": [...],
                   "missing_skills": [...],
                   "learning_roadmap": {...}
                 }
             │
             ▼
    JSON Response → Frontend
             │
             ▼
    Display Results
    ├─► Score Card (with color coding)
    ├─► Rejection Reasons (if score < 70)
    ├─► Skill Gap Analysis (missing vs present)
    └─► Learning Roadmap (30-60-90 days)
```

---

## 📊 Data Flow & Processing

### 1. Resume Processing Pipeline

```
┌─────────────────┐
│ Resume File     │ (PDF or DOCX, max 10MB)
│ (User Upload)   │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │ 1. File Validation              │
    │ • Check MIME type               │
    │ • Verify size < 10MB            │
    │ • Reject if invalid             │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ 2. Text Extraction              │
    │ • PDF: pdfplumber               │
    │ • DOCX: python-docx             │
    │ • Handle tables & formatting    │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ 3. Text Cleaning                │
    │ • Unicode normalization          │
    │ • Remove control chars           │
    │ • Fix line breaks                │
    │ • Normalize bullets              │
    │ • Remove excess whitespace       │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ 4. Section Extraction           │
    │ • Education                     │
    │ • Experience                    │
    │ • Skills                        │
    │ • Projects                      │
    │ • Certifications                │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ 5. Skill Extraction             │
    │ • Match against taxonomy        │
    │ • Extract from skills section   │
    │ • Find in experience            │
    │ • Categorize by type            │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Clean Resume Text (Ready for    │
    │ scoring and embedding)          │
    └─────────────────────────────────┘
```

### 2. Scoring Pipeline

```
┌─────────────────────────────────────┐
│ Resume Text + Job Description       │
└────────┬────────────────────────────┘
         │
         ├────────────────────┬──────────────────────┬──────────────────────┬────────────────────┐
         │                    │                      │                      │                    │
         ▼                    ▼                      ▼                      ▼                    ▼
    ┌─────────────┐   ┌──────────────┐    ┌─────────────┐     ┌────────────────┐    ┌─────────────────┐
    │Skills Match │   │  Experience  │    │   Keyword   │     │  Role          │    │    Combine All  │
    │   (35%)     │   │ Relevance(25)│    │  Coverage   │     │  Alignment     │    │    Sub-Scores   │
    │             │   │              │    │   (20%)     │     │    (20%)       │    │                 │
    │Semantic sim │   │Semantic sim  │    │             │     │                │    │  Weighted Avg   │
    │of skills    │   │of experience │    │Direct match │     │Overall semantic│    │                 │
    │sections     │   │vs JD context │    │of keywords  │     │match + titles  │    │ = Overall Score │
    └─────┬───────┘   └──────┬───────┘    └─────┬───────┘     └────────┬───────┘    └────────┬────────┘
          │                  │                   │                     │                     │
          └──────────────────┴───────────────────┴─────────────────────┴─────────────────────┘
                                                 │
                                                 ▼
                                         ┌──────────────────┐
                                         │  Overall Score   │
                                         │  (0-100)         │
                                         └──────────────────┘
```

### 3. LLM Reasoning Pipeline

```
┌────────────────────────────────────┐
│ Score Data + Missing Skills        │
│ + Resume Text + Job Description    │
└────────────┬───────────────────────┘
             │
             ├─ Score < 70?
             │ │
             │ Yes ──┐
             │       │
             │       ▼
             │   ┌────────────────────────────┐
             │   │ Generate Rejection Reasons │ (via Groq/OpenAI)
             │   │ • Only cite provided data  │
             │   │ • Specific & actionable    │
             │   │ • No hallucination         │
             │   └────────────────────────────┘
             │
             No
             │
             ├─ Always: Generate Roadmap
             │   │
             │   ▼
             │   ┌────────────────────────────┐
             │   │ 30-60-90 Day Learning Path │ (via Groq/OpenAI)
             │   │ • Phase 1: Foundations     │
             │   │ • Phase 2: Intermediate    │
             │   │ • Phase 3: Advanced        │
             │   │ • Free resources only      │
             │   │ • Time estimates           │
             │   │ • Prioritized skills       │
             │   └────────────────────────────┘
             │
             └─► Combine Results → JSON Response
```

---

## 🔧 Component Architecture

### Backend Services

```
services/
├── resume_parser.py          ResumeParser
│   ├── extract_text()        ← PDF/DOCX files
│   ├── extract_sections()    ← Identify resume parts
│   └── extract_from_bytes()  ← Binary file content
│
├── embedder.py               Embedder (Sentence Transformers)
│   ├── embed()               ← Single text
│   ├── embed_batch()         ← Multiple texts
│   ├── similarity()          ← 2 texts
│   ├── similarity_matrix()   ← N texts
│   ├── get_similar_chunks()  ← Top-K search
│   └── chunk_text()          ← Overlapping chunks
│
├── faiss_index.py            FAISSIndex
│   ├── add()                 ← Add embeddings
│   ├── search()              ← Query similarity
│   ├── batch_search()        ← Multiple queries
│   ├── save()                ← Persist to disk
│   └── load()                ← Load from disk
│
├── scorer.py                 ResumeScorer
│   ├── calculate_score()     ← Main scoring
│   ├── _calculate_skills_match()
│   ├── _calculate_experience_relevance()
│   ├── _calculate_keyword_coverage()
│   ├── _calculate_role_alignment()
│   └── get_detailed_analysis()
│
└── llm_reasoner.py           LLMReasoner
    ├── explain_rejection()   ← Rejection reasons
    ├── generate_roadmap()    ← Learning path
    ├── _call_llm()           ← Groq/OpenAI API
    └── _generate_fallback_*  ← No API response
```

### Utilities

```
utils/
├── text_cleaner.py           TextCleaner
│   ├── clean()               ← Full pipeline
│   ├── clean_for_embedding() ← Optimized for vectors
│   ├── extract_contact_info()
│   ├── split_into_sections() ← Resume sections
│   └── [Private methods for normalization]
│
└── skill_extractor.py        SkillExtractor
    ├── extract_from_jd()     ← Job description
    ├── extract_from_resume() ← Resume text
    ├── find_missing_skills() ← Gap analysis
    ├── categorize_skills()   ← By category
    ├── calculate_skill_match_score()
    ├── get_skill_importance()
    └── [Skill taxonomy with 4000+ skills]
```

### Frontend Components

```
components/
├── resume/
│   ├── UploadResume.tsx      File upload UI
│   ├── JobDescriptionInput.tsx JD input
│   └── [Existing components]
│
├── results/
│   ├── ScoreCard.tsx         Display score & sub-scores
│   ├── SkillGapList.tsx      Missing vs present skills
│   ├── RoadmapTimeline.tsx   90-day learning plan
│   └── [Existing components]
│
└── ui/                       shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── tabs.tsx
    ├── accordion.tsx
    └── [Other UI elements]
```

---

## 💾 Data Models

### API Request

```json
POST /analyze
{
  "resume": File,
  "job_description": "string"
}
```

### API Response

```json
{
  "success": true,
  "data": {
    "score": 82,
    "sub_scores": {
      "skills_match": 85,
      "experience_relevance": 78,
      "keyword_coverage": 88,
      "role_alignment": 75
    },
    "rejection_reasons": [
      "String explanation if score < 70"
    ],
    "missing_skills": ["Skill1", "Skill2"],
    "present_skills": ["Skill3", "Skill4"],
    "required_skills": ["Skill1", "Skill3"],
    "learning_roadmap": {
      "days_1_30": [
        {
          "skill": "React",
          "priority": "high",
          "resources": [
            {
              "name": "React Official Docs",
              "url": "https://react.dev",
              "type": "docs",
              "estimated_time": "10 hours"
            }
          ],
          "estimated_hours": 20,
          "learning_objectives": [...],
          "milestones": [...]
        }
      ],
      "days_31_60": [...],
      "days_61_90": [...],
      "weekly_schedule": {
        "weekdays": "2-3 hours",
        "weekends": "4-5 hours"
      },
      "success_metrics": [...]
    }
  }
}
```

---

## 🔌 Integration Points

### External APIs

1. **Groq API** (Recommended)
   - Endpoint: `https://api.groq.com/openai/v1/chat/completions`
   - Model: `llama-3.3-70b-versatile`
   - Auth: Bearer token in header
   - Free tier available

2. **OpenAI API** (Alternative)
   - Endpoint: `https://api.openai.com/v1/chat/completions`
   - Model: `gpt-4o-mini`
   - Auth: Bearer token in header
   - Requires payment

### Libraries & Frameworks

**Backend:**
- FastAPI 0.109+ (Web framework)
- Sentence Transformers 2.3+ (Embeddings)
- PyTorch 2.0+ (ML framework)
- pdfplumber 0.10+ (PDF parsing)
- python-docx 1.1+ (DOCX parsing)
- httpx (Async HTTP client)
- numpy (Numerical computing)
- FAISS 1.7+ (Vector search, optional)

**Frontend:**
- Next.js 14+ (React framework)
- TypeScript (Type safety)
- TailwindCSS (Styling)
- shadcn/ui (Component library)
- Lucide Icons (Icons)

---

## 📈 Scalability Considerations

### Current Architecture
- ✅ Stateless backend (horizontally scalable)
- ✅ No database dependency (great for MVP)
- ✅ Async API endpoints (handle concurrent requests)
- ✅ Optional FAISS for faster search

### Future Enhancements
- Add Redis caching for embeddings
- PostgreSQL for user history & analytics
- Async task queue (Celery) for long-running jobs
- Prometheus metrics for monitoring
- Load balancing with multiple backend instances
- CDN for frontend assets

---

## 🛡️ Security Considerations

- ✅ File type validation (PDF/DOCX only)
- ✅ File size limits (10MB max)
- ✅ No sensitive data stored
- ✅ API key management (env variables)
- ✅ CORS configured per environment
- ✅ Input validation on all endpoints
- ✅ Error handling without exposing internals

---

## 📊 Performance Metrics

| Operation | Target | Actual |
|-----------|--------|--------|
| Health check | <100ms | ~50ms |
| Text extraction (PDF) | <2s | ~1.5s |
| Embeddings generation | <3s | ~2s |
| Scoring calculation | <1s | ~0.5s |
| LLM reasoning | <5s | ~3-8s |
| Full analysis | <10s | ~8-12s |

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────┐
│        Vercel (Frontend)             │
│ https://resume-intelligence.app      │
│ • Next.js deployment                 │
│ • Auto-scaling                       │
│ • Edge caching                       │
│ • SSL/TLS included                   │
└──────────────┬───────────────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────────────┐
│      Render (Backend API)            │
│ https://api.resume-intelligence.app  │
│ • Docker container                   │
│ • Auto-scaling                       │
│ • Health monitoring                  │
│ • Environment variables              │
│ • GitHub integration                 │
└──────────────────────────────────────┘
```

---

## 🔄 Deployment Flow

```
Code Push to GitHub
       │
       ├─► Vercel (Frontend)
       │   └─► Builds Next.js
       │   └─► Deploys to CDN
       │   └─► Live in ~1-2 minutes
       │
       └─► Render (Backend)
           └─► Builds Docker image
           └─► Runs health checks
           └─► Deploys to container
           └─► Live in ~3-5 minutes
```

---

For implementation details, see:
- Backend: [Backend Code Walkthrough](./BACKEND.md)
- Frontend: [Frontend Code Walkthrough](./FRONTEND.md)
- Deployment: [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Testing: [Testing Guide](./TESTING_GUIDE.md)
