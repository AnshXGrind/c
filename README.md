# Talentra - AI-Powered Career Growth Platform

Transform your career with AI-powered resume analysis, skills gap identification, and personalized learning roadmaps.

## 🚀 Features

- **Resume Analyzer** - Get instant AI analysis with ATS compatibility scores
- **Skills Gap Analysis** - Identify missing skills and learning priorities
- **90-Day Roadmap** - Personalized improvement plan
- **Resume Comparison** - Compare with recruiter-approved samples
- **Career Guidance** - AI-powered insights and recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (serverless)
- **AI**: Groq API (llama-3.1-8b-instant)
- **Deployment**: Vercel (Frontend + Backend together)

## 📦 Installation

```bash
cd frontend
npm install
```

## 🔑 Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com

## 🏃 Running Locally

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account (free tier works)
- GitHub repository

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Important Configuration**:
   - **Root Directory**: Set to `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Environment Variables**:
   - Add `GROQ_API_KEY` with your Groq API key

6. Click "Deploy"

### Step 3: Verify Deployment

Once deployed, Vercel will provide you with:
- Production URL: `https://your-app.vercel.app`
- Automatic HTTPS
- Automatic deployments on git push

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze-resume/     # AI resume analysis endpoint
│   │   │   └── extract-text/       # PDF/DOCX text extraction
│   │   ├── analyze/                # Resume analyzer page
│   │   ├── skills/                 # Skills gap page
│   │   ├── roadmap/                # Career roadmap page
│   │   └── compare/                # Resume comparison page
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── layout/                 # Navbar, Footer
│   │   ├── sections/               # Landing page sections
│   │   └── resume/                 # Resume analyzer components
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
