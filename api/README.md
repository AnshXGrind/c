# Legacy API Folder

⚠️ **This folder is no longer used in the current architecture.**

## Previous Architecture
This folder contained a Vercel serverless function wrapper for the Python FastAPI backend, allowing the entire backend to run on Vercel as serverless functions.

## Current Architecture
The backend now runs as a standalone Python ML service on Render/Fly.io instead of Vercel.

**New structure:**
- Frontend + API Gateway (Next.js API routes) → Vercel
- Python ML Service (FastAPI) → Render/Fly.io

## Migration Notes
If you need to revert to Vercel serverless deployment:
1. Use this `api/index.py` file
2. Update `vercel.json` to include Python functions
3. Install Python dependencies in Vercel build

## Current Recommendation
Use the new architecture for better:
- Separation of concerns
- Scalability
- Performance (dedicated Python server vs. serverless functions)
- Cost efficiency

---

**Status:** Deprecated - Use `/backend` deployed to Render instead
