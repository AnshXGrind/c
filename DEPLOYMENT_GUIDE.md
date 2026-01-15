# 🚀 Deployment Guide

AI Resume & Career Intelligence System - Complete Deployment Instructions

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Environment Configuration](#environment-configuration)
5. [Testing & Verification](#testing--verification)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional, for containerized setup)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/AnshXGrind/c.git
cd Talentra01
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements-new.txt

# Create .env file
cp env.example .env

# Edit .env with your API keys
# GROQ_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here (optional)
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Step 4: Run Locally (Without Docker)

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
python -m uvicorn app:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at: **http://localhost:3000**

### Step 5: Run with Docker Compose

```bash
# From project root
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## Backend Deployment (Render)

### Prerequisites
- Render.com account (free tier available)
- GitHub repository with code

### Step 1: Connect GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Select "Deploy an existing repository"
4. Connect your GitHub account and select the repository

### Step 2: Configure Web Service

**Basic Settings:**
- Name: `resume-intelligence-backend`
- Region: `Oregon (us-west)` (or closest to you)
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Python 3.11`

**Build Command:**
```bash
pip install -r requirements-new.txt
```

**Start Command:**
```bash
python -m uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Step 3: Environment Variables

Click "Advanced" and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `ENV` | `production` | |
| `LLM_PROVIDER` | `groq` | Or `openai` |
| `GROQ_API_KEY` | `your_api_key` | Get from https://console.groq.com |
| `OPENAI_API_KEY` | `your_api_key` | (Optional) Get from OpenAI |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | Fast & efficient |
| `FRONTEND_URL` | `https://yourdomain.vercel.app` | Your Vercel frontend URL |

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically deploy your backend
3. Once deployed, you'll get a URL like: `https://resume-intelligence-backend.onrender.com`
4. **Save this URL** - you'll need it for frontend configuration

### Step 5: Verify Deployment

```bash
# Check API health
curl https://resume-intelligence-backend.onrender.com/health

# Expected response:
# {"status": "healthy", "services": {...}}
```

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository access

### Step 1: Deploy from GitHub

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the `frontend` directory as root

### Step 2: Configure Environment Variables

In the Vercel dashboard, go to **Settings** → **Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.onrender.com` | Production |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Development |

### Step 3: Build Settings

**Framework Preset:** `Next.js`

**Build Command:**
```bash
npm run build
```

**Output Directory:** `.next`

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy
3. Once complete, you'll get a URL like: `https://resume-intelligence.vercel.app`

### Step 5: Update Backend CORS

Go back to Render dashboard:
1. Edit the Backend service
2. Update `FRONTEND_URL` environment variable
3. Set it to your Vercel URL
4. Redeploy

---

## Environment Configuration

### Backend `.env` File

Create `backend/.env`:

```bash
# =============================================================================
# LLM PROVIDER CONFIGURATION
# =============================================================================
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Alternative: OpenAI
# LLM_PROVIDER=openai
# OPENAI_API_KEY=sk_your_key_here
# OPENAI_MODEL=gpt-4o-mini

# =============================================================================
# EMBEDDING MODEL
# =============================================================================
EMBEDDING_MODEL=all-MiniLM-L6-v2

# =============================================================================
# APPLICATION
# =============================================================================
ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local` File

Create `frontend/.env.local`:

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production (update after deploying backend)
# NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## Testing & Verification

### Health Checks

**Backend Health:**
```bash
curl http://localhost:8000/health

# Expected:
# {
#   "status": "healthy",
#   "services": {
#     "embedder": true,
#     "scorer": true,
#     "llm_reasoner": true,
#     "skill_extractor": true
#   }
# }
```

### Test Resume Analysis

1. Go to http://localhost:3000/analyze (or your deployed URL)
2. Upload a sample resume (PDF or DOCX)
3. Paste a job description
4. Click "Analyze Resume"
5. Verify you see:
   - Overall score (0-100)
   - Sub-scores (skills, experience, keywords, role alignment)
   - Missing skills
   - Learning roadmap

### API Testing

**Using cURL:**
```bash
curl -X POST http://localhost:8000/analyze \
  -F "resume=@path/to/resume.pdf" \
  -F "job_description=Senior Developer with 5+ years..."
```

**Using Postman:**
1. Create POST request to `http://localhost:8000/analyze`
2. Body → form-data
3. Add `resume` (File type, select PDF/DOCX)
4. Add `job_description` (Text type)
5. Send

---

## Troubleshooting

### Backend Issues

**Problem: "ModuleNotFoundError: No module named 'torch'"**
```bash
pip install torch torchvision torchaudio
```

**Problem: "GROQ_API_KEY not set"**
- Verify `GROQ_API_KEY` in `.env` file
- Check you've activated virtual environment
- Restart the development server

**Problem: "Port 8000 already in use"**
```bash
# Find process on port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
python -m uvicorn app:app --port 8001
```

**Problem: CORS errors in frontend**
- Verify `FRONTEND_URL` environment variable in backend
- Check both URLs have trailing slashes removed
- Restart backend after changing CORS config

### Frontend Issues

**Problem: "API connection failed"**
1. Verify backend is running
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure backend URL doesn't have trailing slash
4. Check browser console for exact error

**Problem: "Resume upload fails"**
- Ensure file is valid PDF or DOCX
- Check file size < 10MB
- Verify backend has pdfplumber installed: `pip install pdfplumber`

### Deployment Issues

**Problem: "Build failed on Render"**
1. Check build logs in Render dashboard
2. Verify `requirements-new.txt` exists
3. Ensure Python version is 3.11+
4. Check for syntax errors in code

**Problem: "Deployed but getting 503 error"**
1. Wait 2-3 minutes for cold start
2. Check "Events" tab in Render dashboard
3. Verify environment variables are set
4. Check health endpoint: `/health`

**Problem: "Vercel deployment stuck"**
1. Check build logs for errors
2. Ensure `next.config.js` exists
3. Clear Vercel cache and redeploy
4. Check for infinite loops in code

---

## Production Checklist

- [ ] Backend deployed to Render (or similar)
- [ ] Frontend deployed to Vercel
- [ ] `GROQ_API_KEY` configured in backend
- [ ] `NEXT_PUBLIC_API_URL` points to backend
- [ ] Backend `FRONTEND_URL` updated to Vercel URL
- [ ] Health endpoints responding
- [ ] Test resume analysis works end-to-end
- [ ] SSL/HTTPS verified
- [ ] CORS properly configured
- [ ] Error handling tested
- [ ] Large file upload tested
- [ ] API rate limiting considered
- [ ] Monitoring/logging configured

---

## Support & Next Steps

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs` (backend)
3. Check browser console for frontend errors
4. Review logs in Render/Vercel dashboards

To add features:
- See ARCHITECTURE.md for system design
- Check backend/services for API endpoints
- Review frontend/src for component structure
