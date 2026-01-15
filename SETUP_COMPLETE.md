# ✅ Environment Setup Complete!

Your credentials are now configured. Follow these steps:

## 📊 Step 1: Apply Database Schema

Since psql is not installed, use Supabase SQL Editor:

1. Go to: https://app.supabase.com
2. Select your project (xxkyahxxcnumfsvjykxp)
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy entire contents of `backend/db/init.sql`
6. Paste into SQL editor
7. Click **Run** (or Ctrl+Enter)
8. Verify: Should see "Success" messages

## 🚀 Step 2: Test Backend Locally

```powershell
# In PowerShell (from project root)
cd backend
pip install -r requirements-new.txt
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Open another terminal and test:
```powershell
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

## 🎨 Step 3: Test Frontend Locally

```powershell
# In new PowerShell terminal
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

## 🌐 Step 4: Deploy to Render (Backend)

### Render Settings:
- **Name:** resume-intelligence-backend
- **Root Directory:** backend
- **Environment:** Docker (recommended)
- **Health Check Path:** /health

### Environment Variables (Add in Render):
```
DATABASE_URL=your_supabase_postgres_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
EMBEDDING_MODEL=all-MiniLM-L6-v2
FRONTEND_URL=https://your-app-name.vercel.app
ENV=production
```

**Use the values from your `backend/.env` file (already configured locally)**

After deployment, copy your Render URL (e.g., `https://resume-intelligence-backend.onrender.com`)

## 🎯 Step 5: Deploy to Vercel (Frontend)

### Vercel Settings:
- **Framework Preset:** Next.js
- **Root Directory:** frontend
- **Build Command:** npm run build
- **Install Command:** npm ci

### Environment Variables (Add in Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Use the values from your `frontend/.env.local` file (already configured locally)**

## 🔄 Step 6: Update CORS

After Vercel deploys, go back to Render and update:
```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

Then redeploy the backend.

## ✅ Verification Checklist

- [ ] Database schema applied in Supabase SQL Editor
- [ ] Backend runs locally: `curl http://localhost:8000/health`
- [ ] Frontend runs locally: http://localhost:3000
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] FRONTEND_URL updated in Render with Vercel URL
- [ ] Backend redeployed
- [ ] Production test: Upload resume → Get results

## 🎉 Your System is Ready!

**Local URLs:**
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

**Production URLs (after deployment):**
- Backend: https://your-backend.onrender.com
- API Docs: https://your-backend.onrender.com/docs
- Frontend: https://your-frontend.vercel.app

## 🔐 Security Note

✅ All credentials are in `.env` files (NOT tracked in Git)
✅ Service role key only in backend
✅ Anon key safe for frontend
✅ Never commit `.env` files!

---

**Next:** Run `cd backend && python -m uvicorn app:app --reload` to start!
