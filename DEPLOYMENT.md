# 🚀 Deployment Guide - Talentra to Vercel

## Quick Summary

✅ **Frontend + Backend**: Both deploy together on Vercel (no separate backend server needed)
✅ **Database**: No database required for basic functionality (can add Supabase later)
✅ **Cost**: Free tier available on Vercel
✅ **Time**: 5-10 minutes to deploy

---

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Vercel account (sign up at vercel.com - free)
3. ✅ Groq API key (get from console.groq.com - free)

---

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Your Repository

```bash
# Navigate to your project
cd d:\github\c

# Ensure everything is committed
git status

# If you have uncommitted changes:
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Connect with your GitHub account
4. Click **"New Project"**

### Step 3: Import Your Repository

1. Find your repository `AnshXGrind/c` in the list
2. Click **"Import"**

### Step 4: Configure Project Settings

**IMPORTANT**: Vercel will auto-detect settings from `vercel.json`, but verify:

#### Root Directory
```
frontend
```
⚠️ **This is critical!** Set this to `frontend` in Vercel project settings if not auto-detected.

#### Framework Preset
```
Next.js
```

#### Build & Development Settings
Vercel will automatically use the settings from your `vercel.json` file

### Step 5: Add Environment Variables

**Critical Step for GROQ_API_KEY:**

1. Click **"Environment Variables"** in Vercel project settings
2. Add your Groq API key:

| Name | Value |
|------|-------|
| `GROQ_API_KEY` | `your_actual_groq_api_key_from_console.groq.com` |

3. Make sure to add it for all environments (Production, Preview, Development)

Get your Groq API key from: https://console.groq.com/keys

⚠️ **Important**: Do NOT use the `@groq_api_key` syntax - paste your actual API key directly.

### Step 6: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. ✅ Your app is live!

### Step 7: Get Your URL

Vercel will provide:
```
https://your-project-name.vercel.app
```

You can customize the domain in **Project Settings > Domains**

---

## 🔧 Post-Deployment Configuration

### Update API URLs (if needed)

If you want to use a custom domain, update:

**File**: `frontend/next.config.js`
```javascript
module.exports = {
  // ... existing config
  env: {
    NEXT_PUBLIC_APP_URL: 'https://your-custom-domain.com',
  },
}
```

### Enable Analytics

1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. Enable **Vercel Analytics** (free)

---

## 🎨 Custom Domain (Optional)

### Add Your Domain

1. Go to **Project Settings > Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `talentra.com`)
4. Follow DNS configuration instructions

### DNS Settings Example

For a domain from Namecheap/GoDaddy:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

## 🗄️ Optional: Add Supabase Database

If you want to store user data, analysis history, etc.

### 1. Create Supabase Project

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Create a new project (free tier available)

### 2. Get Credentials

From Supabase Dashboard:
- **Project URL**: `https://xxxxx.supabase.co`
- **Anon Public Key**: `eyJhbGc...`

### 3. Add to Vercel Environment Variables

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `your_project_url` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key` |

### 4. Install Supabase Client

```bash
cd frontend
npm install @supabase/supabase-js
```

### 5. Create Database Tables

Run in Supabase SQL Editor:

```sql
-- User profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analysis history
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  ats_score INTEGER,
  job_role TEXT,
  analysis_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
```

### 6. Use in Your App

```typescript
// frontend/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Example: Save analysis
export async function saveAnalysis(userId: string, data: any) {
  const { error } = await supabase
    .from('analyses')
    .insert({
      user_id: userId,
      ats_score: data.ats_score,
      job_role: data.role,
      analysis_data: data,
    })
  
  if (error) throw error
}
```

---

## 📊 Monitoring & Debugging

### View Logs

1. Go to your project in Vercel
2. Click **"Deployments"**
3. Click on any deployment
4. Click **"Functions"** tab to see API route logs

### Common Issues

#### Build Fails
- Check build logs in Vercel
- Ensure `frontend` is set as root directory
- Verify all dependencies are in `package.json`

#### API Routes Don't Work
- Check environment variables are set
- View function logs in Vercel
- Test API routes locally first: `npm run dev`

#### PDF Upload Fails
- Clear browser cache
- Check file size (< 10MB)
- Verify PDF is not password protected

---

## 🔄 Automatic Deployments

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel automatically:
1. Detects the push
2. Builds your app
3. Deploys to production
4. Provides deployment preview

---

## 💰 Cost Breakdown

### Vercel (Free Tier)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Edge functions
- ✅ Analytics

### Groq API (Free Tier)
- ✅ 30 requests/minute
- ✅ Good for testing & small-scale

### Supabase (Optional - Free Tier)
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users

### Total Monthly Cost: **$0** 🎉

---

## 🚀 Performance Tips

### 1. Enable Caching
Add to `next.config.js`:
```javascript
module.exports = {
  // ... existing config
  experimental: {
    optimizeCss: true,
  },
}
```

### 2. Optimize Images
Use Next.js Image component:
```typescript
import Image from 'next/image'

<Image src="/logo.png" width={40} height={40} alt="Logo" />
```

### 3. Add Loading States
Already implemented in the resume analyzer!

---

## 📧 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review build errors
3. Test locally first: `npm run dev`
4. Open a GitHub issue

---

## ✅ Deployment Checklist

- [ ] Groq API key obtained
- [ ] Repository pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Root directory set to `frontend`
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Custom domain configured (optional)
- [ ] Supabase database added (optional)
- [ ] Analytics enabled
- [ ] App tested in production

---

**Congratulations! 🎉 Your AI Career Platform is now live!**

Share your deployment URL and start helping job seekers improve their careers! 🚀
