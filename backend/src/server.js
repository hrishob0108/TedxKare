import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import compression from 'compression';
import { apiLimiter } from './middleware/rateLimiter.js';
import applicantRoutes from './routes/applicants.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';
import speakerRoutes from './routes/speakers.js';
import ideasRoutes from './routes/ideas.js';
import { errorHandler } from './middleware/errorHandler.js';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is set and cryptographically secure
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ WARNING: JWT_SECRET environment variable is not defined! Generating a cryptographically secure random fallback key.');
  } else {
    console.log('ℹ️ JWT_SECRET not found in environment. Generating a temporary random key for development.');
  }
  process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
}


const app = express();
const PORT = process.env.PORT || 5000;


// ==================== MIDDLEWARE ====================
app.use(compression()); // Compress responses
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      /^http:\/\/localhost:\d+$/, // Allow any local port (e.g. 5174, 5175)
      /^http:\/\/127\.0\.0\.1:\d+$/, // Allow any local loopback port
      'https://tedx-kare.vercel.app',
      'https://tedx-kare-qxg9gjejs-hrishob0108s-projects.vercel.app', // Explicitly add the failing URL
      /^https:\/\/.*\.vercel\.app$/ // Catch-all for Vercel
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ==================== MONGODB CONNECTION ====================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tedxkare', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Max 10 connections
      minPoolSize: 5, // Min 5 connections
      maxIdleTimeMS: 45000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// ==================== ROUTES ====================
app.use('/api/', apiLimiter); // General API protection (MUST be before routes)
app.use('/api/applicants', applicantRoutes);
app.use('/api/ad', adminRoutes);

app.use('/api/settings', settingsRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/ideas', ideasRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TEDxKARE Backend is running' });
});

// ==================== ERROR HANDLING ====================
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==================== START SERVER ====================
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 TEDxKARE Backend running on http://localhost:${PORT}`);
    console.log(`📱 Frontend at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
});

export default app;
