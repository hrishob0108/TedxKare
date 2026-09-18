import express from 'express';
import { body } from 'express-validator';
import {
  getAllAttendees,
  getAttendeeById,
  createRegistration,
  updateAttendeeStatus,
  deleteAttendee,
  getStatistics,
} from '../controllers/attendeeController.js';
import { authenticate } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Limit 50 registrations per hour per IP
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: 'Too many registrations from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const registrationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('linkedin').trim().notEmpty().withMessage('LinkedIn profile is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('occupation').trim().notEmpty().withMessage('Occupation is required'),
  body('organization').trim().notEmpty().withMessage('Organization is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('year').if((val, { req }) => req.body.occupation === 'Student').trim().notEmpty().withMessage('Year of study is required for students'),
  body('registrationNumber').if((val, { req }) => req.body.occupation === 'Student').trim().notEmpty().withMessage('Registration number is required for students'),
  body('source').trim().notEmpty().withMessage('Source is required'),
  body('transactionId').trim().notEmpty().withMessage('Transaction ID is required'),
  body('paymentScreenshot').notEmpty().withMessage('Payment screenshot is required'),
];

// Public
router.post('/', registrationLimiter, registrationValidation, createRegistration);

// Admin Only
router.get('/', authenticate, getAllAttendees);
router.get('/stats', authenticate, getStatistics);
router.get('/:id', authenticate, getAttendeeById);
router.patch('/:id', authenticate, updateAttendeeStatus);
router.delete('/:id', authenticate, deleteAttendee);

export default router;
