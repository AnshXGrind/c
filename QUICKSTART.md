# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### For Testing/Demo (Frontend Only - Mock Data)

```bash
# Clone repository
git clone <your-repo-url>
cd c/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 - App will use mock data for demo.

---

### For Full Development (Frontend + Backend)

#### Terminal 1: Python ML Service

```bash
# Navigate to backend
cd backend

# Setup Python environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Create environment file
cp .env.example .env

# Run ML service
uvicorn main:app --reload --port 8000
```

✅ Service running at http://localhost:8000
✅ API docs at http://localhost:8000/docs

#### Terminal 2: Next.js Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local - add this line:
# PYTHON_ML_SERVICE_URL=http://localhost:8000

# Run development server
npm run dev
```

✅ Frontend running at http://localhost:3000

---

## 📝 Testing the Application

### Test Resume Analysis

1. Go to http://localhost:3000/analyze
2. Upload a sample resume (PDF or DOCX)
3. Select target job role
4. Click "Analyze Resume"
5. View comprehensive analysis results

### Test Skills Gap Analysis

1. Go to http://localhost:3000/skills
2. Upload your resume
3. Select target role
4. View missing skills and recommendations

### Test Career Roadmap

1. Go to http://localhost:3000/roadmap
2. Enter current skills
3. Select target role
4. Generate personalized 90-day roadmap

---

## 🐛 Troubleshooting

### Frontend Issues

**Port 3000 already in use**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

**Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Port 8000 already in use**
```bash
# Change port in .env file
PORT=8001

# Or kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

**spaCy model not found**
```bash
# Download spaCy model
python -m spacy download en_core_web_sm
```

**Import errors**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS Errors

If frontend can't connect to backend:

1. Check backend `.env` file has:
   ```
   CORS_ORIGINS=http://localhost:3000
   ```

2. Restart backend service after changing .env

3. Check browser console for specific error

---

## 📚 Next Steps

1. ✅ Test all features locally
2. 📖 Read [ARCHITECTURE.md](ARCHITECTURE.md) for deployment
3. 🚀 Deploy to Render (backend) and Vercel (frontend)
4. 🎨 Customize UI and features
5. 🔐 Add authentication (future)

---

## 💡 Tips

- **Mock Data:** Frontend works without backend using mock data
- **Hot Reload:** Both frontend and backend support hot reload
- **API Docs:** FastAPI auto-generates docs at `/docs`
- **TypeScript:** Frontend uses TypeScript for type safety
- **Linting:** Run `npm run lint` in frontend to check code

---

## 🆘 Need Help?

- **Frontend errors:** Check browser console (F12)
- **Backend errors:** Check terminal where `uvicorn` is running
- **CORS issues:** Verify CORS_ORIGINS in backend .env
- **File upload issues:** Check file size (max 10MB) and type (PDF/DOCX)

---

## 🎯 Quick Commands Reference

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Check code quality
```

### Backend
```bash
uvicorn main:app --reload              # Development server
uvicorn main:app --host 0.0.0.0       # Production server
python -m pytest                       # Run tests (if available)
```

---

Happy Coding! 🚀
