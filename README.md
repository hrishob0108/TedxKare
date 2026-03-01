# TEDxKARE Recruitment Portal

A production-ready MERN stack web application for TEDxKARE (Kalasalingam University), an officially licensed TEDx event. This application provides a professional recruitment website for hiring team members across multiple domains, along with a secure admin dashboard to manage applicants.

## Features

### Frontend
- ✨ **Modern Dark Theme** - Premium dark UI with TED red accents
- 🎨 **Smooth Animations** - Framer Motion for delightful interactions
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🎯 **Fast & Optimized** - Built with Vite for lightning-fast development
- 🔐 **Secure** - JWT-based authentication for admin access

### Backend
- 🚀 **RESTful API** - Clean, well-documented endpoints
- 🔒 **JWT Authentication** - Secure admin access with token-based auth
- 💾 **MongoDB** - Flexible, scalable NoSQL database
- ✅ **Input Validation** - Express Validator for robust error handling
- 🛡️ **Security Best Practices** - bcrypt password hashing, CORS enabled

### Pages

**Public Pages:**
- **Home** (`/`) - Hero section with domain cards and CTA
- **Apply** (`/apply`) - Comprehensive application form with validation
- **Thank You** (`/thank-you`) - Confirmation page after submission
- **Admin Login** (`/admin`) - Secure login for team members

**Admin Pages:**
- **Dashboard** (`/dashboard`) - View, filter, and manage all applications
  - Statistics cards showing application counts
  - Search and filter by domain, status, or name
  - CSV export functionality
  - Detailed applicant view modal
  - Status management (Pending, Shortlisted, Rejected)

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Project Structure

```
TEDxKARE/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Applicant.js
│   │   │   └── Admin.js
│   │   ├── controllers/
│   │   │   ├── applicantController.js
│   │   │   └── adminController.js
│   │   ├── routes/
│   │   │   ├── applicants.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── DomainCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Apply.jsx
│   │   │   ├── ThankYou.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/tedxkare
   PORT=5000
   JWT_SECRET=your_secure_random_key_here
   ADMIN_EMAIL=admin@tedxkare.com
   ADMIN_PASSWORD=secure_password_here
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. **Start the backend server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=TEDxKARE
   VITE_TED_RED=#E62B1E
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

### Creating First Admin Account

Once both servers are running, create an admin account:

1. Open `http://localhost:5173/apply` or use a API client like Postman
2. Make a POST request to `http://localhost:5000/api/admin/create`
3. Send JSON body:
   ```json
   {
     "email": "admin@tedxkare.com",
     "password": "secure_password"
   }
   ```
4. Login at `http://localhost:5173/admin` with these credentials

## API Documentation

### Applicant Endpoints

**Submit Application** (Public)
```
POST /api/applicants
Body: { name, email, phone, department, year, linkedin, portfolio, firstPreference, secondPreference, whyTedx, whyDomain, experience, availability }
```

**Get All Applicants** (Admin Only)
```
GET /api/applicants?domain=Marketing Team&status=Pending&search=john
Headers: Authorization: Bearer <token>
```

**Get Single Applicant** (Admin Only)
```
GET /api/applicants/:id
Headers: Authorization: Bearer <token>
```

**Update Applicant Status** (Admin Only)
```
PATCH /api/applicants/:id
Headers: Authorization: Bearer <token>
Body: { status: "Shortlisted" | "Rejected" | "Pending" }
```

**Delete Applicant** (Admin Only)
```
DELETE /api/applicants/:id
Headers: Authorization: Bearer <token>
```

**Get Statistics** (Admin Only)
```
GET /api/applicants/stats
Headers: Authorization: Bearer <token>
```

### Admin Endpoints

**Admin Login**
```
POST /api/admin/login
Body: { email, password }
Returns: { token, admin }
```

**Create Admin Account**
```
POST /api/admin/create
Body: { email, password }
```

**Verify Token**
```
GET /api/admin/verify
Headers: Authorization: Bearer <token>
```

**Change Password**
```
POST /api/admin/change-password
Headers: Authorization: Bearer <token>
Body: { currentPassword, newPassword }
```

## Deployment

### Deploy Backend (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables in Render dashboard
6. Deploy

### Deploy Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import Git repository
4. Set environment variables
5. Deploy

### Environment Variables for Production

**Backend:**
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=generate_with_openssl_rand_-hex_32
ADMIN_EMAIL=admin@tedxkare.com
ADMIN_PASSWORD=strong_password
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

**Frontend:**
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=TEDxKARE
VITE_TED_RED=#E62B1E
```

## Design System

### Colors
- **Primary Red**: `#E62B1E` (TED Brand)
- **Dark Background**: `#000000`
- **Card Background**: `#111827`
- **Border**: `#1F2937`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#D1D5DB`

### Typography
- **Font Family**: Inter (system-ui fallback)
- **Hero Title**: 5xl bold
- **Section Title**: 3xl bold
- **Body Text**: base / lg

## Best Practices Implemented

✅ **Security**
- JWT token-based authentication
- Password hashing with bcryptjs
- CORS properly configured
- Input validation with express-validator
- Protected routes on frontend

✅ **Code Quality**
- Clean, modular architecture
- Meaningful comments throughout
- Error handling middleware
- Reusable components and hooks
- Proper separation of concerns

✅ **Performance**
- Optimized bundle with Vite
- Tailwind CSS for minimal CSS
- Lazy loading images
- Efficient API calls with interceptors
- Indexed MongoDB queries

✅ **User Experience**
- Smooth animations and transitions
- Responsive design
- Clear error messages
- Loading states
- Accessibility considerations

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or MongoDB Atlas connection string is correct
- Check `MONGODB_URI` in `.env`

### CORS Error
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that API endpoint in frontend `.env` is correct

### Token Expired
- JWT tokens expire after 7 days. User needs to login again
- Clear localStorage and try logging in again

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Vite will use next available port automatically

## Contributing

This project is part of TEDxKARE. For contributions or suggestions, please reach out to the team.

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please contact the TEDxKARE team.

---

**Built with ❤️ for TEDxKARE - Ideas Worth Spreading**

Last updated: January 2026
