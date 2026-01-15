# 🚀 Netlify Deployment Guide (Frontend)

## Quick Deploy to Netlify

### Step 1: Create Netlify Account
1. Go to https://app.netlify.com
2. Click **Sign up** → Continue with GitHub
3. Authorize Netlify

### Step 2: Import Project
1. Click **Add new site** → **Import an existing project**
2. Choose **Deploy with GitHub**
3. Select repository: **AnshXGrind/c**
4. Authorize if needed

### Step 3: Configure Build Settings

Fill these **EXACT** values:

| Field | Value |
|-------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/.next` |
| **Functions directory** | (leave empty) |

### Step 4: Add Environment Variables

Click **Show advanced** → **New variable**

Add these **ONE BY ONE**:

**Variable 1:**
- Key: `NEXT_PUBLIC_API_URL`
- Value: `https://your-render-backend-url.onrender.com`

**Variable 2:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://xxkyahxxcnumfsvjykxp.supabase.co`

**Variable 3:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3lhaHh4Y251bWZzdmp5a3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NDk3MzksImV4cCI6MjA1MjUyNTczOX0.e5IBL2mD2PBHmfT5AP_dZA_h6KFOlfg`

### Step 5: Deploy
1. Click **Deploy site**
2. Wait 3-5 minutes
3. **COPY YOUR URL** (looks like: `https://your-app-name.netlify.app`)

### Step 6: Update Backend CORS
1. Go to Render backend service
2. Navigate to **Environment** tab
3. Update `FRONTEND_URL` variable to: `https://your-app-name.netlify.app`
4. Save (auto-redeploys)

## ✅ Verification

Visit: `https://your-app-name.netlify.app`
- Should see homepage
- Click "Analyze Resume"
- Upload & analyze
- Should work in ~10 seconds

## 🔄 Continuous Deployment

Every push to `main` branch automatically triggers:
- Build on Netlify
- Deploy to production
- Live in 3-5 minutes

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Netlify dashboard
- Verify `frontend` base directory is set
- Ensure all env vars are added

**Can't reach backend?**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend `FRONTEND_URL` matches Netlify URL
- Check browser console for CORS errors

**404 errors?**
- Netlify automatically handles Next.js routing
- Check `netlify.toml` is in root

---

**Your Netlify URL:** `https://your-app-name.netlify.app`
