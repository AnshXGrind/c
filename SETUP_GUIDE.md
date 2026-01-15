# 🚀 Complete Setup Guide - AI Resume Intelligence System

**Last Updated:** January 15, 2026  
**Version:** 1.0.0  
**Difficulty:** ⭐⭐ (Beginner-Friendly)

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Git** installed ([download](https://git-scm.com))
- ✅ **Python 3.11+** ([download](https://www.python.org))
- ✅ **Node.js 18+** ([download](https://nodejs.org))
- ✅ **Docker** (optional, for containerized setup) ([download](https://docker.com))
- ✅ **GitHub account** (to fork/clone the repo)

Verify installations:
```bash
git --version          # Should show git version
python --version       # Should show Python 3.11+
node --version        # Should show Node 18+
docker --version      # Only if using Docker
```

---

## 🌟 STEP 1: Clone the Repository

### 1.1 Clone from GitHub
```bash
# Clone the repository
git clone https://github.com/AnshXGrind/c.git
cd c

# Or if you forked it:
git clone https://github.com/YOUR_USERNAME/c.git
cd c
```

### 1.2 Verify files are present
```bash
# Should see:
# backend/, frontend/, docker-compose.yml, BUILD_COMPLETE.md, etc.
ls -la
```

---

## 🔑 STEP 2: Get API Keys (Free!)

### 2.1 Groq API Key (Recommended - Fastest & Free)

1. Go to https://console.groq.com
2. Click "Sign in" or "Sign up"
3. Create account (free, no credit card needed)
4. Navigate to **API Keys** section
5. Click **Create API Key**
6. Copy the key (looks like: `gsk_...`)
7. Save somewhere safe ✅

**Why Groq?**
- ✅ Free forever (no paid tier)
- ✅ Super fast responses (70+ tokens/sec)
- ✅ Modern models (Llama 3.3, Mixtral)
- ✅ No rate limit complaints on free tier
- ⏱️ Average response: 2-3 seconds

### 2.2 OpenAI API Key (Optional - Fallback)

1. Go to https://platform.openai.com
2. Sign in/up
3. Go to **API Keys** → **Create new secret key**
4. Copy the key (looks like: `sk-...`)
5. Add credit card for billing ($5-20 free credits)
6. Save the key ✅

**Note:** You only need ONE API key. Start with Groq!

### 2.3 Supabase Setup (Optional - For Database)

For saving analysis history and user accounts (optional):

1. Go to https://app.supabase.com
2. Sign in/up with GitHub
3. Click **New Project**
4. Fill in:
   - Name: `resume-intelligence`
   - Database Password: Save this!
   - Region: Pick closest to you
   - Click **Create new project**
5. Wait for project to initialize (5-10 min)
6. Go to **Settings** → **API**
7. Copy:
   - Project URL → `SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
8. Save all three ✅

---

## ⚙️ STEP 3: Environment Configuration

### 3.1 Root Environment (.env)

In project root, create `.env` file:

```bash
# Windows (PowerShell)
echo. > .env

# Mac/Linux
touch .env
```

**Add to `.env`:**
```bash
# BACKEND
BACKEND_PORT=8000
BACKEND_ENV=development

# FRONTEND
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# LLM (Choose ONE: groq or openai)
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_key_from_step_2.1
GROQ_MODEL=llama-3.3-70b-versatile

# Alternative: OpenAI
# OPENAI_API_KEY=your_openai_key_from_step_2.2
# OPENAI_MODEL=gpt-4o-mini

# EMBEDDING
EMBEDDING_MODEL=all-MiniLM-L6-v2

# CORS
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# OPTIONAL: Supabase (leave blank if not using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_from_step_2.3
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3.2 Backend Environment (`backend/.env`)

In `backend/` folder, create `.env`:

```bash
# Windows (PowerShell)
echo. > backend\.env

# Mac/Linux
touch backend/.env
```

**Add to `backend/.env`:**
```bash
ENV=development
PORT=8000
HOST=0.0.0.0

# LLM (same as root)
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_key_from_step_2.1
GROQ_MODEL=llama-3.3-70b-versatile

# EMBEDDING
EMBEDDING_MODEL=all-MiniLM-L6-v2

# CORS
FRONTEND_URL=http://localhost:3000

# OPTIONAL: Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3.3 Frontend Environment (`frontend/.env.local`)

In `frontend/` folder, create `.env.local`:

```bash
# Windows (PowerShell)
echo. > frontend\.env.local

# Mac/Linux
touch frontend/.env.local
```

**Add to `frontend/.env.local`:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000

# OPTIONAL: Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_from_step_2.3
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🛠️ STEP 4: Install Dependencies

### 4.1 Backend Setup

```bash
# Navigate to backend
cd backend

# Windows: Create virtual environment
python -m venv .venv
.venv\Scripts\activate

# Mac/Linux: Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements-new.txt

# Verify installation
python -c "import fastapi; print('✅ FastAPI installed')"

# Go back to root
cd ..
```

### 4.2 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Verify installation
npm list react next

# Go back to root
cd ..
```

---

## 🚀 STEP 5: Run Locally

### Option A: Run Services Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# ✅ Visit: http://localhost:8000/docs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Should see:
# > ready - started server on 0.0.0.0:3000
# ✅ Visit: http://localhost:3000
```

### Option B: Run with Docker (All-in-One)

```bash
# From project root
docker-compose up --build

# Should see both services starting:
# backend-1: ✅ listening on :8000
# frontend-1: ✅ listening on :3000

# Stop with: Ctrl+C
```

### 4.3 Test It Works

1. **Backend API:** http://localhost:8000/docs
   - Should show interactive API documentation
   - Click **Try it out** on `/health` endpoint
   - Should return `{"status": "healthy"}`

2. **Frontend:** http://localhost:3000
   - Should see beautiful homepage
   - Click "Analyze Resume"
   - Should show upload area

---

## 🧪 STEP 6: Test the System

### 6.1 Test Resume Upload & Analysis

```bash
# Sample test - run this in a new terminal

curl -X POST http://localhost:8000/health

# Should return:
# {"status":"healthy"}
```

### 6.2 Test Full Workflow

1. Go to http://localhost:3000
2. Click **"Analyze Resume"**
3. **Upload resume:** Drag a PDF or DOCX file
4. **Paste JD:** Copy this sample:

```
Senior Full-Stack Developer

Requirements:
- 5+ years experience with React, Node.js, PostgreSQL
- AWS cloud experience (EC2, S3, Lambda)
- Docker and Kubernetes knowledge
- Team lead experience
- BSc Computer Science or equivalent

We're looking for someone who can lead our platform team and mentor junior developers.
```

5. Click **Analyze**
6. Wait ~10 seconds
7. See results:
   - ✅ Overall Score (0-100)
   - ✅ Sub-scores breakdown
   - ✅ Missing skills
   - ✅ 90-day learning roadmap

---

## 🌐 STEP 7: Environment Variables for Deployment

### 7.1 Render (Backend Deployment)

Go to https://render.com

1. Sign in/up with GitHub
2. Click **New** → **Web Service**
3. Select repository: `AnshXGrind/c` (or your fork)
4. Fill settings:
   - **Name:** `resume-intelligence-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3.11`
   - **Build Command:** `pip install -r requirements-new.txt`
   - **Start Command:** `python -m uvicorn app:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables** → Add:
   ```
   LLM_PROVIDER=groq
   GROQ_API_KEY=your_groq_key
   GROQ_MODEL=llama-3.3-70b-versatile
   EMBEDDING_MODEL=all-MiniLM-L6-v2
   ENV=production
   FRONTEND_URL=your_frontend_url_from_step_7.2
   ```
6. Click **Create Web Service**
7. Wait for deployment (~5 min)
8. Copy URL (looks like: `https://resume-intelligence-backend.onrender.com`)

**Environment Variables for Render:**
```
GROQ_API_KEY=sk_live_your_key
LLM_PROVIDER=groq
GROQ_MODEL=llama-3.3-70b-versatile
EMBEDDING_MODEL=all-MiniLM-L6-v2
ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 7.2 Vercel (Frontend Deployment)

Go to https://vercel.com

1. Sign in/up with GitHub
2. Click **Import Project**
3. Select `AnshXGrind/c` (or your fork)
4. Fill settings:
   - **Framework:** Next.js
   - **Root Directory:** `frontend`
5. **Environment Variables** → Add:
   ```
   NEXT_PUBLIC_API_URL=https://resume-intelligence-backend.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url (optional)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key (optional)
   ```
6. Click **Deploy**
7. Wait for deployment (~3 min)
8. Copy URL (looks like: `https://your-app.vercel.app`)
9. Add this URL to Render backend → **Environment Variables** → Update `FRONTEND_URL`

**Environment Variables for Vercel:**
```
NEXT_PUBLIC_API_URL=https://resume-intelligence-backend.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co (optional)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key (optional)
```

### 7.3 Supabase (Optional - Database)

Already set up in Step 2.3, but configure in production:

```bash
# Backend (.env or Render variables)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Frontend (.env or Vercel variables)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

To create tables, run in backend:
```bash
python services/supabase_schema.py
```

---

## 📊 All Environment Variables Reference

### Backend Required
| Variable | Value | Example |
|----------|-------|---------|
| `LLM_PROVIDER` | groq or openai | `groq` |
| `GROQ_API_KEY` | Your Groq key | `gsk_...` |
| `GROQ_MODEL` | Model name | `llama-3.3-70b-versatile` |
| `EMBEDDING_MODEL` | SBERT model | `all-MiniLM-L6-v2` |
| `ENV` | development/production | `development` |
| `PORT` | Server port | `8000` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:3000` |

### Frontend Required
| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Backend URL | `http://localhost:8000` |

### Optional (For Database Features)
| Variable | Service | Where |
|----------|---------|-------|
| `SUPABASE_URL` | Supabase | Backend |
| `SUPABASE_KEY` | Supabase | Backend |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Backend |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Frontend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Frontend |

---

## 🚨 Troubleshooting

### Backend Won't Start

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
.venv\Scripts\activate  # Activate venv
pip install -r requirements-new.txt
python -m uvicorn app:app --reload
```

---

### "Connection refused" when Frontend tries Backend

**Problem:** Frontend can't reach backend at `http://localhost:8000`

**Solution:**
1. Verify backend is running:
   ```bash
   curl http://localhost:8000/health
   ```
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
3. Verify it's correct:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

---

### Groq API Key Not Working

**Problem:** `Error: Invalid Groq API key`

**Solution:**
1. Go to https://console.groq.com/keys
2. Create NEW key (old one might be revoked)
3. Update in `.env`:
   ```
   GROQ_API_KEY=your_new_key
   ```
4. Restart backend

---

### Port 8000 Already In Use

**Problem:** `Address already in use`

**Solution:**
```bash
# Find what's using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Mac/Linux

# Kill the process or use different port:
python -m uvicorn app:app --port 9000
# Then update frontend: NEXT_PUBLIC_API_URL=http://localhost:9000
```

---

### Docker Build Fails

**Problem:** `failed to solve with frontend dockerfile`

**Solution:**
```bash
# Clean and rebuild
docker system prune -a
docker-compose up --build
```

---

## 📱 Deployment Checklist

Before deploying to production:

- [ ] Created `.env` files (never commit these!)
- [ ] Got Groq API key from https://console.groq.com
- [ ] Tested locally (http://localhost:3000 works)
- [ ] Pushed to GitHub
- [ ] Deployed backend to Render
- [ ] Deployed frontend to Vercel
- [ ] Updated Vercel env vars with Render URL
- [ ] Tested production URLs
- [ ] Supabase set up (optional)

---

## 🎯 Quick Summary

| Step | Command | Time |
|------|---------|------|
| 1. Clone repo | `git clone ...` | 1 min |
| 2. Get API keys | Go to groq.com | 5 min |
| 3. Create .env files | Copy templates | 2 min |
| 4. Install deps | `pip install`, `npm install` | 5 min |
| 5. Run locally | `npm run dev` + backend | 2 min |
| 6. Test it | http://localhost:3000 | 2 min |
| **TOTAL** | | **17 min** |

---

## 🎓 Learning Resources

- **FastAPI:** https://fastapi.tiangolo.com
- **Next.js:** https://nextjs.org/docs
- **Groq:** https://groq.com/docs
- **Supabase:** https://supabase.com/docs
- **Docker:** https://docker.com/get-started

---

## 📞 Support

**Stuck?**

1. Check troubleshooting section above
2. Verify all `.env` files are set correctly
3. Check terminal logs for error messages
4. Ensure Python 3.11+ and Node 18+ installed

**Common Issues:**

- Port 8000 in use → Use different port
- API key invalid → Get new key from console
- `npm install` fails → Delete `node_modules`, try again
- Docker won't start → Run `docker system prune -a`

---

## ✅ You're Ready!

Your system is now ready to:

✅ Run locally in development
✅ Test with sample resumes
✅ Deploy to production (free tier)
✅ Save analyses (with Supabase)
✅ Scale as needed

**Next Steps:**
1. Run locally first
2. Test thoroughly
3. Deploy to Render + Vercel
4. Get live URL
5. Share with team!

---

**Deployed & Ready? 🎉**

Your app should be live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://resume-intelligence-backend.onrender.com`
- API Docs: `https://resume-intelligence-backend.onrender.com/docs`

Congratulations! You've deployed a production-ready AI system! 🚀
