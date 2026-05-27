import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  createSpeaker,
  getAllSpeakers,
  getSpeakerById,
  updateSpeakerStatus,
  deleteSpeaker,
} from '../controllers/speakerController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Rate limit speaker submissions (30 per hour)
const speakerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30, message: 'Too many submissions, try again later', standardHeaders: true, legacyHeaders: false });

const speakerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name too short'),
  body('email').isEmail().withMessage('Valid email required'),
  body('title').trim().notEmpty().withMessage('Talk title is required'),
  body('abstract').trim().isLength({ min: 30 }).withMessage('Abstract must be at least 30 characters'),
];

// Public: create speaker submission
router.post('/', speakerLimiter, speakerValidation, createSpeaker);

// Admin routes
router.get('/', authenticate, getAllSpeakers);
router.get('/:id', authenticate, getSpeakerById);
router.patch('/:id', authenticate, updateSpeakerStatus);
router.delete('/:id', authenticate, deleteSpeaker);

export default router;
