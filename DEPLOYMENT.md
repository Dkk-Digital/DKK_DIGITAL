# Deployment Guide - DKK Digital

## 📌 Prerequisites
- GitHub account (free)
- Vercel account (free) - https://vercel.com
- Git installed

---

## STEP 1️⃣ - Push to GitHub

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `DKK_DIGITAL`
3. Choose Private/Public
4. Click "Create repository"

### 1.2 First Time Push
```powershell
cd c:\Users\asusw_6kfs7ug\Documents\DKK_DIGITAL

# Add all files
git add .

# Commit
git commit -m "Initial commit - DKK Digital MERN App"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/DKK_DIGITAL.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### 1.3 Future Commits
```powershell
git add .
git commit -m "Your message"
git push
```

---

## STEP 2️⃣ - Setup Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel
5. Import your project or skip for now

---

## STEP 3️⃣ - Deploy Backend (Choice of 2)

### Option A: Deploy Backend on Vercel (Recommended for hobby project)
```powershell
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# From backend folder
cd backend
vercel deploy --prod
```

Note the deployment URL (e.g., `https://your-api.vercel.app`)

### Option B: Deploy Backend on Railway/Render (Free alternatives)
- **Railway**: https://railway.app (similar to Vercel, $5 free credits)
- **Render**: https://render.com (has free tier but app sleeps)

---

## STEP 4️⃣ - Deploy Frontend on Vercel

### 4.1 Create Vercel Project
```powershell
cd frontend

# Deploy frontend
vercel deploy --prod
```

### 4.2 Configure Environment Variables in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   ```
   VITE_API_URL=https://your-backend-domain.vercel.app/api
   ```

### 4.3 Redeploy
```powershell
vercel deploy --prod
```

---

## STEP 5️⃣ - Environment Variables on Vercel

### For Backend (on Vercel)

Go to Vercel Dashboard → Project Settings → Environment Variables

Add all variables from `.env.example`:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CLIENT_URL` (your frontend URL)

### For Frontend

Add:
- `VITE_API_URL` (your backend API URL)

---

## STEP 6️⃣ - Custom Domain (Optional)

### Add Domain to Vercel
1. Vercel Dashboard → Select Project
2. Go to "Domains"
3. Add your domain
4. Follow DNS setup instructions

---

## 🔧 Troubleshooting

### Backend not connecting
- Check MONGODB_URI in Vercel env vars
- Check CORS settings in server.js
- Test health endpoint: `/api/health`

### Frontend API calls failing
- Verify `VITE_API_URL` is correct
- Check browser console for errors
- Ensure backend is deployed and running

### Database connection error
- Ensure MongoDB Atlas IP whitelist includes Vercel IPs (0.0.0.0/0)
- Or use MongoDB URI without IP restrictions

---

## 📊 After Deployment

### Check Backend
```
https://your-backend-domain.vercel.app/api/health
```

### Check Frontend
```
https://your-frontend-domain.vercel.app
```

### Logs
- Vercel Dashboard → Project → Deployments → View Logs

---

## 🚀 Future Updates

After deployment, to update:

```powershell
# Make changes locally
git add .
git commit -m "Update message"
git push

# Vercel auto-deploys on push (if connected to GitHub)
# No manual deployment needed!
```

---

## 📞 Need Help?
- Vercel Docs: https://vercel.com/docs
- React Deployment: https://vitejs.dev/guide/
- Express on Vercel: https://vercel.com/docs/concepts/deployments/official-runtimes/node-js
