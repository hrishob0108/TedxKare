import express from 'express';
import { body } from 'express-validator';
import {
  getAllApplicants,
  getApplicantById,
  createApplication,
  updateApplicantStatus,
  deleteApplicant,
  getStatistics,
} from '../controllers/applicantController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ==================== VALIDATION MIDDLEWARE ====================
// Validation rules for creating an application
const applicationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('year').notEmpty().withMessage('Year is required'),
  body('firstPreference').notEmpty().withMessage('First domain preference is required'),
  body('secondPreference').notEmpty().withMessage('Second domain preference is required'),
  body('whyTedx').trim().isLength({ min: 20 }).withMessage('Why TEDx answer must be at least 20 characters'),
  body('whyDomain').trim().isLength({ min: 20 }).withMessage('Why this domain answer must be at least 20 characters'),
  body('experience').trim().isLength({ min: 20 }).withMessage('Experience answer must be at least 20 characters'),
  body('availability').notEmpty().withMessage('Availability is required'),
];

// ==================== PUBLIC ROUTES ====================

// POST /api/applicants - Create new application
router.post('/', applicationValidation, createApplication);

// ==================== PROTECTED ROUTES (Admin Only) ====================

// GET /api/applicants - Get all applicants (with filtering)
router.get('/', authenticate, getAllApplicants);

// GET /api/applicants/stats - Get statistics
router.get('/stats', authenticate, getStatistics);

// GET /api/applicants/:id - Get single applicant
router.get('/:id', authenticate, getApplicantById);

// PATCH /api/applicants/:id - Update applicant status
router.patch('/:id', authenticate, updateApplicantStatus);

// DELETE /api/applicants/:id - Delete applicant
router.delete('/:id', authenticate, deleteApplicant);

export default router;
