import express from 'express';
import { login, changePassword, verifyToken } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// POST /api/admin/login - Admin login
router.post('/login', loginLimiter, login);


// ==================== PROTECTED ROUTES ====================

// GET /api/admin/verify - Verify token validity
router.get('/verify', authenticate, verifyToken);

// POST /api/admin/change-password - Change admin password
router.post('/change-password', authenticate, changePassword);

export default router;
