# 🎯 Environment Variables Cheat Sheet

**Complete Reference for All Configuration**

---

## 📍 File Locations

```
PROJECT_ROOT/
├── .env (root level - for local development)
├── backend/
│   └── .env (backend specific)
└── frontend/
    └── .env.local (frontend specific - dev only)
```

---

## 🔧 Complete Environment Variables

### ROOT `./.env`

```bash
# ============================================================================
# BACKEND CONFIGURATION
# ============================================================================
BACKEND_PORT=8000
BACKEND_ENV=development

# ============================================================================
# FRONTEND CONFIGURATION
# ============================================================================
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# ============================================================================
# LLM PROVIDER (Choose ONE)
# ============================================================================
# Option 1: Groq (RECOMMENDED - Free, Fast)
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_actual_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Option 2: OpenAI (Alternative)
# OPENAI_API_KEY=sk-your_actual_key_here
# OPENAI_MODEL=gpt-4o-mini

# ============================================================================
# EMBEDDING MODEL (Sentence Transformers)
# ============================================================================
EMBEDDING_MODEL=all-MiniLM-L6-v2
# Alternative models:
# all-mpnet-base-v2 (larger, better quality)
# paraphrase-multilingual-MiniLM-L12-v2 (multilingual)

# ============================================================================
# CORS & URLS
# ============================================================================
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# ============================================================================
# SUPABASE (Optional - Database & Auth)
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key
```

---

### BACKEND `./backend/.env`

```bash
# ============================================================================
# APP CONFIGURATION
# ============================================================================
ENV=development
PORT=8000
HOST=0.0.0.0

# ============================================================================
# LLM CONFIGURATION
# ============================================================================
# Primary LLM Provider
LLM_PROVIDER=groq

# Groq Settings (Free tier, no credit card)
# Register: https://console.groq.com
GROQ_API_KEY=gsk_your_actual_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# OpenAI Settings (Optional, requires payment)
# Register: https://platform.openai.com/account/api-keys
# OPENAI_API_KEY=sk-your_actual_key_here
# OPENAI_MODEL=gpt-4o-mini

# ============================================================================
# EMBEDDING CONFIGURATION
# ============================================================================
# Sentence Transformers model for semantic embeddings
EMBEDDING_MODEL=all-MiniLM-L6-v2

# Available options:
# - all-MiniLM-L6-v2 (384-dim, fast, recommended)
# - all-mpnet-base-v2 (768-dim, better quality)
# - paraphrase-multilingual-MiniLM-L12-v2 (384-dim, multilingual)

# ============================================================================
# CORS CONFIGURATION
# ============================================================================
# Frontend URL for CORS headers
FRONTEND_URL=http://localhost:3000

# ============================================================================
# DATABASE (Optional - Supabase)
# ============================================================================
# Register: https://app.supabase.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key

# ============================================================================
# OPTIONAL: REDIS (for caching)
# ============================================================================
# REDIS_URL=redis://localhost:6379

# ============================================================================
# OPTIONAL: POSTGRES DATABASE
# ============================================================================
# DATABASE_URL=postgresql://user:password@localhost:5432/resume_intelligence
```

---

### FRONTEND `./frontend/.env.local` (Development Only)

```bash
# ============================================================================
# API CONFIGURATION
# ============================================================================
# Points to your backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# ============================================================================
# SUPABASE CONFIGURATION (Optional)
# ============================================================================
# These are PUBLIC keys - it's safe to expose in frontend
# Register: https://app.supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key

# WARNING: Never put SERVICE_ROLE_KEY in frontend!
# It's secret and should only be in backend

# ============================================================================
# OPTIONAL: ANALYTICS
# ============================================================================
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_MIXPANEL_TOKEN=xxxxx
```

---

## 🚀 DEPLOYMENT ENVIRONMENT VARIABLES

### Render (Backend) Environment Variables

```
# In Render dashboard: Settings → Environment

LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_production_key
GROQ_MODEL=llama-3.3-70b-versatile
EMBEDDING_MODEL=all-MiniLM-L6-v2
ENV=production
FRONTEND_URL=https://your-app.vercel.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_production_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

### Vercel (Frontend) Environment Variables

```
# In Vercel dashboard: Settings → Environment Variables

NEXT_PUBLIC_API_URL=https://resume-intelligence-backend.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🔑 API Keys: Where to Get Them

### 1️⃣ Groq API Key (RECOMMENDED)

**Cost:** FREE forever  
**Time to Setup:** 2 minutes  
**Speed:** 70+ tokens/second

**Steps:**
1. Go to https://console.groq.com
2. Click "Sign Up" (no credit card needed!)
3. Verify email
4. Go to **API Keys** section
5. Click **Create New API Key**
6. Copy the key (starts with `gsk_`)
7. Paste into `.env` files

**Example:**
```
GROQ_API_KEY=gsk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

### 2️⃣ OpenAI API Key (Optional Fallback)

**Cost:** Pay-as-you-go ($0.001-0.03 per 1K tokens)  
**Time to Setup:** 5 minutes  
**Speed:** 30-50 tokens/second (slower than Groq)

**Steps:**
1. Go to https://platform.openai.com
2. Click "Sign Up" or "Log In"
3. Add phone number verification
4. Go to **API Keys** → **Create new secret key**
5. Copy the key (starts with `sk-`)
6. Add credit card (they give $5 free credits)
7. Paste into `.env` files

**Example:**
```
OPENAI_API_KEY=sk-proj-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

### 3️⃣ Supabase Keys (Optional - For Database)

**Cost:** FREE tier with 500MB  
**Time to Setup:** 10 minutes  
**Purpose:** Save analysis history

**Steps:**

1. Go to https://app.supabase.com
2. Sign up with GitHub
3. Click **New Project**
4. Fill form:
   - **Name:** `resume-intelligence`
   - **Password:** Create secure password (save it!)
   - **Region:** Pick closest to you
5. Wait 5-10 minutes for creation
6. Click on project
7. Go to **Settings** → **API**
8. Copy three values:

   **For Backend:**
   ```
   SUPABASE_URL = Project URL (like: https://xyz123.supabase.co)
   SUPABASE_KEY = service_role key (long, starts with eyJ...)
   SUPABASE_SERVICE_ROLE_KEY = same as above
   ```

   **For Frontend:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = Project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY = anon public key
   ```

9. ⚠️ **IMPORTANT:** Different keys for backend vs frontend!

---

## ⚙️ Model Configuration Reference

### Groq Models Available

```
# Current Recommended
llama-3.3-70b-versatile  ✅ (Fast, accurate, best balance)

# Alternative options
mixtral-8x7b-32768       (Faster, slightly less accurate)
gemma-7b-it              (Lightweight, good for simple tasks)
```

### OpenAI Models Available

```
gpt-4o-mini              ✅ (Recommended - fast & cheap)
gpt-4o                   (More capable, more expensive)
gpt-3.5-turbo            (Legacy, slower)
```

### Embedding Models Available

```
all-MiniLM-L6-v2         ✅ (Default - fast, good quality)
all-mpnet-base-v2        (Larger, better quality, slower)
paraphrase-multilingual-MiniLM-L12-v2 (Multilingual support)
```

---

## 🐳 Docker Environment Variables

### For `docker-compose.yml`

```yaml
environment:
  # Backend
  - BACKEND_PORT=8000
  - ENV=development
  - LLM_PROVIDER=groq
  - GROQ_API_KEY=${GROQ_API_KEY}
  - EMBEDDING_MODEL=all-MiniLM-L6-v2
  - FRONTEND_URL=http://localhost:3000
  
  # Frontend
  - FRONTEND_PORT=3000
  - NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Use `.env` files for local development
- ✅ Add `.env` to `.gitignore` (never commit!)
- ✅ Use service role keys in backend only
- ✅ Use anon keys in frontend only
- ✅ Rotate keys periodically
- ✅ Use different keys for dev vs production
- ✅ Store keys in password manager

### ❌ DON'T:
- ❌ Commit `.env` files to GitHub
- ❌ Share API keys in chat/email
- ❌ Use frontend keys in backend
- ❌ Use service role keys in frontend
- ❌ Hardcode keys in code files
- ❌ Expose keys in error messages
- ❌ Use same key for multiple environments

---

## 🧪 Testing Your Configuration

### Test Groq API Key

```bash
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "test"}],
    "max_tokens": 100
  }'
```

### Test Backend API

```bash
# Check if backend is running
curl http://localhost:8000/health

# Should return:
# {"status":"healthy"}
```

### Test Frontend Connection

```bash
# In browser console (http://localhost:3000)
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🆘 Troubleshooting

### "Invalid API Key" Error

```bash
# Verify key format
echo $GROQ_API_KEY

# Should start with:
# gsk_ (Groq)
# sk- (OpenAI)

# Solution: Get new key from console
```

### "CORS Error"

```bash
# Check .env files match:
# In backend: FRONTEND_URL=http://localhost:3000
# In frontend: NEXT_PUBLIC_API_URL=http://localhost:8000

# In production:
# FRONTEND_URL=https://your-vercel-app.vercel.app
# NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
```

### "Connection Refused"

```bash
# Make sure services are running:
ps aux | grep uvicorn  # Check backend
ps aux | grep node     # Check frontend

# Or with Docker:
docker ps
```

---

## 📋 Environment Checklist

Before starting development:

- [ ] Created `.env` in root folder
- [ ] Created `backend/.env`
- [ ] Created `frontend/.env.local`
- [ ] Added GROQ_API_KEY to backend
- [ ] Set LLM_PROVIDER=groq
- [ ] Set NEXT_PUBLIC_API_URL=http://localhost:8000
- [ ] Set FRONTEND_URL=http://localhost:3000
- [ ] Set EMBEDDING_MODEL=all-MiniLM-L6-v2
- [ ] All files added to `.gitignore`
- [ ] Ran `python -m uvicorn app:app --reload`
- [ ] Ran `npm run dev` in frontend
- [ ] Tested http://localhost:3000
- [ ] Tested http://localhost:8000/docs

Before deploying:

- [ ] Created accounts on Render and Vercel
- [ ] Deployed backend to Render
- [ ] Added backend URL to Vercel frontend variables
- [ ] Deployed frontend to Vercel
- [ ] Updated backend FRONTEND_URL with Vercel URL
- [ ] Tested production URLs
- [ ] Set up Supabase (optional)
- [ ] Configured Supabase keys in both services

---

## 🎯 Quick Start Template

Copy & paste this to `.env`:

```bash
# Development
BACKEND_PORT=8000
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# LLM
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_YOUR_KEY_HERE
GROQ_MODEL=llama-3.3-70b-versatile
EMBEDDING_MODEL=all-MiniLM-L6-v2

# CORS
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

---

## 📞 Getting Help

1. Check Groq status: https://status.groq.com
2. Check OpenAI status: https://status.openai.com
3. Check Vercel status: https://www.vercel-status.com
4. Read full SETUP_GUIDE.md
5. Check backend logs: `docker logs resume-intelligence-backend`

---

**Last Updated:** January 15, 2026  
**Status:** ✅ Production Ready  
**Version:** 1.0.0
