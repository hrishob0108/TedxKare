import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// GET /api/settings - Get public settings (registration status)
router.get('/', getSettings);

// ==================== PROTECTED ROUTES ====================

// PATCH /api/settings - Update settings
router.patch('/', authenticate, updateSettings);

export default router;
