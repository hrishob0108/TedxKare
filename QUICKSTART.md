# TEDxKARE Recruitment Portal - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

### Step 1: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/tedxkare
JWT_SECRET=your-secret-key-min-32-chars
ADMIN_EMAIL=admin@tedxkare.com
ADMIN_PASSWORD=change_me
```

Run backend:
```bash
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 2: Frontend Setup (New Terminal)

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:
```bash
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 3: Create Admin Account

Open Postman or any API client and make this request:

```
POST http://localhost:5000/api/admin/create
Content-Type: application/json

{
  "email": "admin@tedxkare.com",
  "password": "secure_password_123"
}
```

Or use curl:
```bash
curl -X POST http://localhost:5000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tedxkare.com","password":"secure_password_123"}'
```

### Step 4: Access the Application

- **Public Site**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin
- **Admin Dashboard**: http://localhost:5173/dashboard (after login)

---

## 📝 Test the Application

1. **Go to Home** → http://localhost:5173
2. **Click "Apply Now"** → Fill the form and submit
3. **View Confirmation** → Redirected to thank you page
4. **Login as Admin** → http://localhost:5173/admin
5. **View Applications** → See all submitted applications
6. **Manage Applicants** → Change status, filter, export CSV

---

## 📦 Project Files Structure

```
✅ Backend (Express + MongoDB)
  - src/models/Applicant.js (Application schema)
  - src/models/Admin.js (Admin authentication)
  - src/controllers/applicantController.js (Business logic)
  - src/controllers/adminController.js (Auth logic)
  - src/routes/applicants.js (Public & admin routes)
  - src/routes/admin.js (Auth routes)
  - src/middleware/auth.js (JWT verification)
  - src/server.js (Main server file)

✅ Frontend (React + Vite)
  - src/pages/Home.jsx (Landing page)
  - src/pages/Apply.jsx (Application form)
  - src/pages/ThankYou.jsx (Confirmation)
  - src/pages/AdminLogin.jsx (Login page)
  - src/pages/AdminDashboard.jsx (Dashboard)
  - src/hooks/useApi.js (Custom hooks)
  - src/utils/api.js (Axios instance)
  - src/utils/helpers.js (Utility functions)
```

---

## 🔑 Default Credentials

After setup, login with:
- **Email**: admin@tedxkare.com
- **Password**: The password you set during admin creation

---

## 🐛 Troubleshooting

**Port Already in Use?**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

**MongoDB Connection Failed?**
```bash
# Check if MongoDB is running
mongosh

# If not installed, use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

**CORS Error?**
- Ensure FRONTEND_URL in backend .env matches your frontend URL
- Default is http://localhost:5173

---

## 📚 API Endpoints

### Applicants
- `POST /api/applicants` - Submit application
- `GET /api/applicants` - Get all (admin)
- `PATCH /api/applicants/:id` - Update status (admin)

### Admin
- `POST /api/admin/login` - Login
- `POST /api/admin/create` - Create account
- `GET /api/admin/verify` - Verify token

---

## 🎨 Design Features

- ✨ Premium dark theme
- 🎯 TED red accent color (#E62B1E)
- 🎬 Smooth Framer Motion animations
- 📱 Fully responsive design
- ♿ Accessibility-friendly

---

## 🚀 Deployment Commands

**Build Backend:**
```bash
cd backend && npm start
```

**Build Frontend:**
```bash
cd frontend && npm run build
```

---

## 📞 Support

For issues, check the main [README.md](./README.md) for detailed documentation.

---

**🎉 You're all set! Start building with TEDxKARE Recruitment Portal**
