import express from 'express';
import { login, createAdmin, changePassword, verifyToken } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// POST /api/admin/login - Admin login
router.post('/login', login);

// POST /api/admin/create - Create new admin account
// Note: In production, this should be protected or removed after initial setup
router.post('/create', createAdmin);

// ==================== PROTECTED ROUTES ====================

// GET /api/admin/verify - Verify token validity
router.get('/verify', authenticate, verifyToken);

// POST /api/admin/change-password - Change admin password
router.post('/change-password', authenticate, changePassword);

export default router;
