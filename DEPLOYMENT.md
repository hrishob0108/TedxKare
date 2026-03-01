# Deployment Guide - TEDxKARE Recruitment Portal

Complete guide to deploy TEDxKARE Recruitment Portal to production using Render (Backend) and Vercel (Frontend).

## Prerequisites

- GitHub account with your project repository
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas account for cloud database (https://www.mongodb.com/cloud/atlas)

---

## Section 1: MongoDB Atlas Setup (Database)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up and create a free account
3. Create a new project

### 2. Create a Cluster
1. Click "Build a Database"
2. Select "M0 Free" tier
3. Choose your region closest to your users
4. Name it `tedxkare`
5. Click "Create"

### 3. Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `tedxkare_admin`
5. Set password: Generate a strong password and save it
6. Set privileges to "Atlas admin"
7. Click "Add User"

### 4. Setup Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Or add specific IP (more secure)
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Databases"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" driver
5. Copy the connection string
6. Replace `<username>` with `tedxkare_admin`
7. Replace `<password>` with your password
8. Replace `myFirstDatabase` with `tedxkare`

Example:
```
mongodb+srv://tedxkare_admin:YOUR_PASSWORD@tedxkare.abc123.mongodb.net/tedxkare?retryWrites=true&w=majority
```

---

## Section 2: Backend Deployment (Render)

### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tedxkare.git
git push -u origin main
```

### 2. Create Render Web Service

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Choose `backend` directory as root
6. Fill in these details:
   - **Name**: tedxkare-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier (or paid)

### 3. Add Environment Variables

In the Render dashboard for your service, go to "Environment" and add:

```env
MONGODB_URI=mongodb+srv://tedxkare_admin:YOUR_PASSWORD@tedxkare.abc123.mongodb.net/tedxkare?retryWrites=true&w=majority
JWT_SECRET=generate_with_openssl_rand_-hex_32
PORT=5000
ADMIN_EMAIL=admin@tedxkare.com
ADMIN_PASSWORD=change_me_later
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

Generate secure JWT_SECRET:
```bash
openssl rand -hex 32
# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
```

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically deploy
3. Get your backend URL: `https://tedxkare-backend.onrender.com`
4. Note this URL for frontend configuration

### 5. Test Backend

```bash
curl https://tedxkare-backend.onrender.com/api/health
# Should return: {"status":"OK","message":"TEDxKARE Backend is running"}
```

---

## Section 3: Frontend Deployment (Vercel)

### 1. Update Environment Variables

Edit `frontend/.env.production`:
```env
VITE_API_URL=https://tedxkare-backend.onrender.com/api
VITE_APP_NAME=TEDxKARE
VITE_TED_RED=#E62B1E
```

Push to GitHub:
```bash
git add frontend/.env.production
git commit -m "Add production environment"
git push
```

### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Select "Frontend" as root directory
6. Fill in:
   - **Project Name**: tedxkare-frontend
   - **Framework**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Add Environment Variables

In Vercel dashboard:
```env
VITE_API_URL=https://tedxkare-backend.onrender.com/api
```

### 4. Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Get your frontend URL: `https://tedxkare-frontend.vercel.app`

### 5. Update Backend CORS

Go back to Render backend environment variables and update:
```env
FRONTEND_URL=https://tedxkare-frontend.vercel.app
```

Click "Save Changes" to trigger a redeploy.

---

## Section 4: Post-Deployment Setup

### 1. Create Admin Account

```bash
curl -X POST https://tedxkare-backend.onrender.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tedxkare.com",
    "password": "your_secure_password"
  }'
```

### 2. Test the Application

- **Home**: https://tedxkare-frontend.vercel.app
- **Apply**: https://tedxkare-frontend.vercel.app/apply
- **Admin Login**: https://tedxkare-frontend.vercel.app/admin
- **Dashboard**: https://tedxkare-frontend.vercel.app/dashboard (after login)

### 3. Setup Custom Domain (Optional)

**For Vercel (Frontend):**
1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration steps

**For Render (Backend):**
1. Go to Render service settings
2. Click "Custom Domain"
3. Add your domain
4. Follow DNS configuration steps

---

## Section 5: Monitoring & Maintenance

### Check Backend Health

```bash
curl https://tedxkare-backend.onrender.com/api/health
```

### View Backend Logs

1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. View real-time logs

### Download Applicant Data

1. Login to admin dashboard
2. Go to Dashboard
3. Use "Export to CSV" button to download all applications

### Backup Database

1. Go to MongoDB Atlas
2. Go to "Backup"
3. Create on-demand backup
4. Schedule automatic backups

---

## Section 6: Security Checklist

- [ ] Change default admin password
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Setup MongoDB IP whitelist
- [ ] Regular database backups
- [ ] Monitor error logs
- [ ] Update dependencies periodically
- [ ] Use environment variables for secrets
- [ ] Enable CORS only from your domain

---

## Section 7: Troubleshooting

### Backend Not Starting

1. Check Render logs
2. Verify MongoDB connection string
3. Ensure all environment variables are set
4. Check Node.js version compatibility

### CORS Errors

1. Verify `FRONTEND_URL` in backend environment
2. Check API URL in frontend environment
3. Ensure both are using HTTPS

### Database Connection Failed

1. Verify MongoDB Atlas connection string
2. Check IP whitelist settings
3. Confirm database user credentials
4. Test connection locally first

### Deployment Takes Too Long

1. Free tier Render deploys have limits
2. Upgrade to paid plan
3. Or use alternative services like Railway, Heroku

---

## Section 8: Cost Estimation

**Free Tier (Development):**
- MongoDB Atlas: Free (512MB storage)
- Render: Free (auto-sleeps after inactivity)
- Vercel: Free
- **Total**: $0/month

**Paid Tier (Production):**
- MongoDB Atlas: $15+/month
- Render: $7+/month
- Vercel: Free or $20+/month
- **Total**: $22+/month

---

## Section 9: Performance Tips

1. **Database Optimization**
   - Add database indexes for frequently queries fields
   - Archive old applicants periodically

2. **Frontend Optimization**
   - Enable image optimization
   - Minify CSS/JS (Vite does this)
   - Use CDN for static assets

3. **Backend Optimization**
   - Enable caching
   - Use pagination for large datasets
   - Optimize database queries

---

## Useful Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## Support

If you encounter issues during deployment, refer to official documentation or contact the respective platform support.

**Last Updated**: January 2026
