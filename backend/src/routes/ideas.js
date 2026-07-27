import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  getAllIdeas,
  createIdea,
  likeIdea,
} from '../controllers/ideaController.js';

const router = express.Router();

// Rate limit idea submissions (20 per hour) to prevent spamming
const ideaSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many ideas cast, please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit upvoting (120 per hour)
const ideaLikeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 120,
  message: 'Too many likes, slow down!',
  standardHeaders: true,
  legacyHeaders: false,
});

const ideaValidation = [
  body('title').trim().notEmpty().withMessage('Idea Title is required').isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('desc').trim().notEmpty().withMessage('Description is required').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('cat').trim().notEmpty().withMessage('Category is required'),
];

router.get('/', getAllIdeas);
router.post('/', ideaSubmitLimiter, ideaValidation, createIdea);
router.post('/:id/like', ideaLikeLimiter, likeIdea);

export default router;
