# CareerAI - Deployment Architecture Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│           Frontend (Next.js) - Deployed to Vercel                │
│  • Static pages & React components                               │
│  • Next.js API Routes (API Gateway)                             │
│  • Handles routing, UI, and forwarding to ML service            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS/JSON
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│      Python ML Service (FastAPI) - Render/Fly.io               │
│  • Resume parsing (PDF/DOCX)                                     │
│  • ML-based analysis & scoring                                  │
│  • Skills extraction & gap analysis                             │
│  • Keyword matching & recommendations                            │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Frontend - Next.js (Vercel)
**Location:** `/frontend`
**Deployment:** Vercel
**Responsibilities:**
- User interface and experience
- API Gateway (Next.js API routes forward requests to Python ML service)
- Authentication & session management (future)
- Static asset serving

**API Gateway Routes:**
- `/api/analyze-resume` → forwards to Python ML `/api/analyze`
- `/api/skills-gap` → forwards to Python ML `/api/skills-gap`
- `/api/compare-resumes` → forwards to Python ML `/api/compare`
- `/api/roadmap` → forwards to Python ML `/api/roadmap`
- `/api/market-data` → forwards to Python ML `/api/market-data`

### 2. Python ML Service - FastAPI (Render/Fly.io)
**Location:** `/backend`
**Deployment:** Render or Fly.io
**Responsibilities:**
- Resume text extraction (PDF, DOCX)
- Natural language processing with spaCy
- ATS score calculation
- Skills extraction and matching
- Gap analysis and recommendations
- Roadmap generation

**Key Features:**
- Stateless design (no database required for MVP)
- CORS enabled for Vercel frontend
- File upload handling (max 10MB)
- Health check endpoint for monitoring

## Deployment Steps

### Step 1: Deploy Python ML Service (Render)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select branch: `main`
   - Root directory: `backend`

3. **Configure Service**
   ```yaml
   Name: careerai-ml-service
   Environment: Python 3
   Build Command: pip install -r requirements.txt && python -m spacy download en_core_web_sm
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Set Environment Variables**
   ```
   SECRET_KEY=your_random_secret_key_here
   DEBUG=false
   CORS_ORIGINS=https://your-app.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your service URL: `https://careerai-ml-service.onrender.com`

### Step 2: Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Set Environment Variables**
   ```
   PYTHON_ML_SERVICE_URL=https://careerai-ml-service.onrender.com
   NEXT_PUBLIC_APP_NAME=CareerAI
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at: `https://your-app.vercel.app`

### Step 3: Connect Services

1. **Update Render CORS Settings**
   - Go to Render dashboard → Your service → Environment
   - Update `CORS_ORIGINS` with your Vercel URL:
     ```
     CORS_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
     ```

2. **Test the Connection**
   - Visit your Vercel URL
   - Upload a test resume
   - Verify analysis works end-to-end

## Local Development

### 1. Python ML Service

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Create .env file
cp .env.example .env
# Edit .env with your settings

# Run service
uvicorn main:app --reload --port 8000
```

Service will be available at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local:
PYTHON_ML_SERVICE_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:3000

## Environment Variables Reference

### Frontend (.env.local)
```bash
# Python ML Service URL
PYTHON_ML_SERVICE_URL=http://localhost:8000  # Local
# PYTHON_ML_SERVICE_URL=https://your-ml.onrender.com  # Production

# App Config
NEXT_PUBLIC_APP_NAME=CareerAI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)
```bash
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true

# CORS - Frontend URLs
CORS_ORIGINS=http://localhost:3000,https://*.vercel.app

# Security
SECRET_KEY=your_secret_key_change_in_production

# File Upload
MAX_FILE_SIZE=10485760
```

## API Flow Example

1. **User uploads resume on frontend**
   ```
   User → Frontend UI (React)
   ```

2. **Frontend calls Next.js API Gateway**
   ```
   Frontend → POST /api/analyze-resume
   ```

3. **Next.js API route forwards to Python ML service**
   ```
   Next.js API → POST https://ml-service.onrender.com/api/analyze
   ```

4. **Python ML service processes request**
   ```
   - Extract text from PDF/DOCX
   - Parse resume sections
   - Calculate scores
   - Extract skills
   - Generate recommendations
   ```

5. **Response flows back to user**
   ```
   Python ML → Next.js API → Frontend → User
   ```

## Monitoring & Maintenance

### Render (Python ML Service)
- Monitor logs in Render dashboard
- Check /health endpoint: `https://your-ml.onrender.com/health`
- Free tier: Service sleeps after 15 min inactivity (wakes on request)

### Vercel (Frontend)
- Monitor deployments in Vercel dashboard
- Check build logs for errors
- Review analytics for performance

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure Render `CORS_ORIGINS` includes your Vercel URL
- Check browser console for specific CORS error

**2. ML Service Timeout**
- Free tier Render services sleep after inactivity
- First request may be slow (cold start ~30s)
- Solution: Upgrade to paid tier or implement keep-alive ping

**3. File Upload Errors**
- Check file size (max 10MB)
- Verify file type (PDF or DOCX only)
- Check Render logs for parsing errors

**4. Environment Variable Issues**
- Verify all required env vars are set
- Restart services after updating env vars
- Check for typos in variable names

## Cost Breakdown

### Free Tier (MVP)
- **Vercel:** Free for personal projects
- **Render:** 750 hours/month free (with cold starts)
- **Total:** $0/month

### Paid Tier (Production)
- **Vercel Pro:** $20/month (better performance, analytics)
- **Render Starter:** $7/month (no cold starts, better uptime)
- **Total:** $27/month

## Next Steps

After deployment:
1. ✅ Test all features end-to-end
2. ✅ Monitor error rates and performance
3. ⏳ Set up custom domain (optional)
4. ⏳ Add authentication (future)
5. ⏳ Implement database for user data (future)
6. ⏳ Add analytics and monitoring (future)

## Support

- Frontend Issues: Check Vercel deployment logs
- Backend Issues: Check Render service logs
- API Errors: Check both services' logs to trace request flow
- General: Check `/health` endpoints on both services
