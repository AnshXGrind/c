# ✅ Vercel Deployment Checklist

## Before Deploying

- [ ] Rotate GROQ API key at https://console.groq.com/keys
- [ ] Remove leaked `.env.local` from Git:
  ```bash
  git rm --cached frontend/.env.local
  git commit -m "Remove leaked env file"
  git push origin main
  ```
- [ ] Verify `.gitignore` includes `.env.local`
- [ ] Ensure all changes are committed and pushed

## Vercel Setup

- [ ] Sign up/login at https://vercel.com
- [ ] Connect GitHub account
- [ ] Import repository `AnshXGrind/c`
- [ ] Set Root Directory to `frontend`
- [ ] Framework auto-detected as Next.js

## Environment Variables

Add in Vercel → Project Settings → Environment Variables:

- [ ] `GROQ_API_KEY` = your_new_groq_key (all environments)
- [ ] Optional: `OPENAI_API_KEY` if using OpenAI features
- [ ] Optional: `SECRET_KEY` for backend auth features

## Deploy

- [ ] Click "Deploy" button
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Test the deployment URL

## Post-Deployment Tests

- [ ] Homepage loads: `https://your-app.vercel.app/`
- [ ] Resume upload/analysis works
- [ ] Skills gap analyzer works
- [ ] Roadmap generator works
- [ ] No console errors in browser DevTools

## Security (Critical)

- [ ] OLD API key is revoked at console.groq.com
- [ ] NEW API key is only in Vercel environment variables
- [ ] No `.env` or `.env.local` files in GitHub
- [ ] Repository can be safely made public (if needed)

## Optional: Clean Git History

If making repo public, scrub old key from history:
```bash
# Install git-filter-repo
pip install git-filter-repo

# Clone fresh
git clone --mirror git@github.com:AnshXGrind/c.git

# Remove file from all history
cd c.git
git filter-repo --path frontend/.env.local --invert-paths

# Force push
git push --force
```

## Troubleshooting

- Build fails → Check Vercel build logs
- API errors → Verify `GROQ_API_KEY` is set correctly
- CORS errors → Check browser console for details
- 404 errors → Verify Root Directory is set to `frontend`
