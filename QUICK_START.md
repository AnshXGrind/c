# ⚡ Quick Start Reference Card

**One-page setup guide for quick reference**

---

## 📦 Prerequisites Check

```bash
git --version      # Git 2.0+
python --version   # Python 3.11+
node --version     # Node 18+
```

---

## 🔑 Get API Keys (5 minutes)

### Groq (Required)
1. Go: https://console.groq.com
2. Sign up (no credit card!)
3. Get API key: Copy `gsk_...`
4. Save it

### OpenAI (Optional Backup)
1. Go: https://platform.openai.com
2. Get key: `sk-...`
3. Save it

### Supabase (Optional Database)
1. Go: https://app.supabase.com
2. New project
3. Copy URL + Keys
4. Save them

---

## 🛠️ Local Setup (15 minutes)

```bash
# 1. Clone repo
git clone https://github.com/AnshXGrind/c.git
cd c

# 2. Create .env files
echo. > .env                          # Windows
echo. > backend\.env
echo. > frontend\.env.local

# 3. Backend setup
cd backend
python -m venv .venv
.venv\Scripts\activate                # Windows
pip install -r requirements-new.txt
python -m uvicorn app:app --reload

# Terminal 2: Frontend setup
cd frontend
npm install
npm run dev

# Open: http://localhost:3000
```

---

## 📝 .env Template (Copy This)

```bash
# .env (root)
BACKEND_PORT=8000
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8000
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_YOUR_KEY
GROQ_MODEL=llama-3.3-70b-versatile
EMBEDDING_MODEL=all-MiniLM-L6-v2
FRONTEND_URL=http://localhost:3000
```

```bash
# backend/.env
ENV=development
PORT=8000
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_YOUR_KEY
GROQ_MODEL=llama-3.3-70b-versatile
EMBEDDING_MODEL=all-MiniLM-L6-v2
FRONTEND_URL=http://localhost:3000
```

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## ✅ Verify Setup

| Check | Command | Expected |
|-------|---------|----------|
| Backend | `curl http://localhost:8000/health` | `{"status":"healthy"}` |
| API Docs | Visit http://localhost:8000/docs | Swagger UI |
| Frontend | Visit http://localhost:3000 | Homepage |

---

## 🚀 Deploy (30 minutes)

### Backend → Render

1. Go: https://render.com (sign with GitHub)
2. New → Web Service
3. Select your fork
4. Settings:
   - Root: `backend`
   - Runtime: Python 3.11
   - Build: `pip install -r requirements-new.txt`
   - Start: `python -m uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Env vars (add):
   ```
   GROQ_API_KEY=your_key
   LLM_PROVIDER=groq
   EMBEDDING_MODEL=all-MiniLM-L6-v2
   FRONTEND_URL=https://your-vercel.vercel.app
   ```
6. Deploy

### Frontend → Vercel

1. Go: https://vercel.com (sign with GitHub)
2. Import → Select repo
3. Framework: Next.js
4. Root: `frontend`
5. Env vars (add):
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
   ```
6. Deploy

---

## 🔄 Workflow

```
┌─────────────┐
│  Edit Code  │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Test Locally     │
│ npm run dev      │
│ python -m ... .. │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Git Commit      │
│  git add .       │
│  git commit      │
│  git push        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Auto Deploy      │
│ Render + Vercel  │
│ (automatic)      │
└──────────────────┘
```

---

## 🧪 Test Features

1. **Score:** Upload resume + JD → Get 0-100 score
2. **Skills:** See missing skills
3. **Roadmap:** View 90-day learning plan
4. **Rejection:** See explanation if score < 70

---

## 🐛 Quick Fixes

| Issue | Solution |
|-------|----------|
| Port in use | `python -m uvicorn app:app --port 9000` |
| API key invalid | Get new key from console |
| CORS error | Check `FRONTEND_URL` in backend |
| npm install fails | `rm -r node_modules && npm install` |
| Import error | `pip install -r requirements-new.txt` |

---

## 📱 Deployment URLs

After deployment, you get:

```
Frontend:  https://your-app.vercel.app
Backend:   https://your-backend.onrender.com
API Docs:  https://your-backend.onrender.com/docs
```

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files
- [ ] Add `.env*` to `.gitignore`
- [ ] Use different keys for dev/prod
- [ ] Rotate keys monthly
- [ ] Don't share keys in chat

---

## 📚 Full Guides

- **Setup:** See `SETUP_GUIDE.md` (comprehensive)
- **Env Vars:** See `ENV_VARIABLES_GUIDE.md` (detailed)
- **Architecture:** See `SYSTEM_ARCHITECTURE.md` (technical)
- **Testing:** See `TESTING_GUIDE.md` (test cases)
- **Deployment:** See `DEPLOYMENT_GUIDE.md` (step-by-step)

---

## ⏱️ Time Breakdown

| Phase | Time |
|-------|------|
| Clone + setup | 5 min |
| Install deps | 5 min |
| Get API key | 5 min |
| Run locally | 2 min |
| Deploy | 20 min |
| **Total** | **37 min** |

---

## 🎯 Success Criteria

✅ Backend responds to health check  
✅ Frontend loads at http://localhost:3000  
✅ Can upload resume  
✅ Can paste job description  
✅ Gets score (0-100)  
✅ Shows missing skills  
✅ Shows learning roadmap  

---

## 📞 Help

1. Check logs: `docker logs [service]`
2. Test API: http://localhost:8000/docs
3. Read: SETUP_GUIDE.md (section: Troubleshooting)
4. Verify keys at: console.groq.com

---

**Ready to launch? 🚀**

```bash
# Start local development
docker-compose up

# Open browser
http://localhost:3000

# Test with sample resume + JD
# See analysis in ~10 seconds
```

---

**Deployed to production?**

```
Frontend: Your Vercel URL
Backend: Your Render URL
Docs: Backend URL + /docs
```

Done! 🎉
