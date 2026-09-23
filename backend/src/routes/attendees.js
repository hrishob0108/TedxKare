import express from 'express';
import { body } from 'express-validator';
import {
  checkAvailability,
  releaseReservation,
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
  body('ticketType')
    .optional()
    .isIn(['Internal', 'External'])
    .withMessage('Ticket type must be Internal or External'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email ID is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9+\s()-]{10,15}$/)
    .withMessage('Please enter a valid mobile number (at least 10 digits)'),
  body('linkedin')
    .optional({ checkFalsy: true })
    .trim(),

  // Internal ticket validations
  body('registrationNumber')
    .if((val, { req }) => (req.body.ticketType || 'Internal') === 'Internal')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required'),
  body('department')
    .if((val, { req }) => (req.body.ticketType || 'Internal') === 'Internal')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
  body('hostelDayScholar')
    .if((val, { req }) => (req.body.ticketType || 'Internal') === 'Internal')
    .isIn(['Hostel', 'Day Scholar'])
    .withMessage('Please select Hostel or Day Scholar'),
  body('hostelName')
    .if((val, { req }) => (req.body.ticketType || 'Internal') === 'Internal' && req.body.hostelDayScholar === 'Hostel')
    .trim()
    .notEmpty()
    .withMessage('Hostel name is required'),
  body('wardenContact')
    .if((val, { req }) => (req.body.ticketType || 'Internal') === 'Internal' && req.body.hostelDayScholar === 'Hostel')
    .trim()
    .notEmpty()
    .withMessage('Warden contact number is required'),
  body('roomNumber')
    .if((val, { req }) => (req.body.ticketType || 'Internal') === 'Internal' && req.body.hostelDayScholar === 'Hostel')
    .trim()
    .notEmpty()
    .withMessage('Room number is required'),

  // External ticket validations
  body('address')
    .if((val, { req }) => req.body.ticketType === 'External')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('category')
    .if((val, { req }) => req.body.ticketType === 'External')
    .isIn(['Student', 'Founder', 'Faculty', 'Business Professional', 'Other'])
    .withMessage('Valid category is required'),
  body('organization')
    .if((val, { req }) => req.body.ticketType === 'External')
    .trim()
    .notEmpty()
    .withMessage('Organization / Startup / Company Name is required'),

  // Payment validations
  body('transactionId')
    .trim()
    .notEmpty()
    .withMessage('Transaction ID is required'),
  body('paymentScreenshot')
    .notEmpty()
    .withMessage('Payment screenshot is required'),
];

// Public
router.post('/check-availability', checkAvailability);
router.post('/release-reservation', releaseReservation);
router.post('/', registrationLimiter, registrationValidation, createRegistration);

// Admin Only
router.get('/', authenticate, getAllAttendees);
router.get('/stats', authenticate, getStatistics);
router.get('/:id', authenticate, getAttendeeById);
router.patch('/:id', authenticate, updateAttendeeStatus);
router.delete('/:id', authenticate, deleteAttendee);

export default router;
