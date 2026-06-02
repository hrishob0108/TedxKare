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
  // --- SECTION 1: Profile ---
  body('name').trim().notEmpty().withMessage('Full Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('selfNomination').trim().notEmpty().withMessage('Self-nomination choice is required'),
  body('email').isEmail().withMessage('Valid email address is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('profession').trim().notEmpty().withMessage('Profession is required'),
  body('organization').trim().notEmpty().withMessage('Organization/Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('linkedin').trim().isURL().withMessage('Valid LinkedIn URL is required'),
  
  // --- Idea 1 (Required) ---
  body('whySpeak1').trim().notEmpty().withMessage('Explanation of why this speaker should speak is required'),
  body('idea1Title').trim().notEmpty().withMessage('Idea 1 Title is required'),
  body('idea1Description').trim().notEmpty().withMessage('Idea 1 Description is required'),
  body('idea1Domain').trim().notEmpty().withMessage('Idea 1 Domain is required'),
  body('idea1WorthSpreading').trim().notEmpty().withMessage('Description of what makes this idea worth spreading is required'),
  body('idea1Relevance').trim().notEmpty().withMessage('Explanation of why this idea is relevant is required'),
  body('idea1Challenge').trim().notEmpty().withMessage('Challenge or gap this idea addresses is required'),
  body('idea1Impact').trim().notEmpty().withMessage('Description of measurable impact is required'),
  body('idea1Scalability').trim().notEmpty().withMessage('Scalability explanation is required'),
  body('idea1LivedExperience').trim().notEmpty().withMessage('Lived experience indicator is required'),
  body('idea1Props').trim().notEmpty().withMessage('Props usage indicator is required'),
  body('idea1Articles').trim().notEmpty().withMessage('Articles, videos, or work samples are required'),

  // --- Idea 2 (Conditional: only validated if idea2Title is provided) ---
  body('whySpeak2').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Why speak for Idea 2 is required'),
  body('idea2Description').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Description for Idea 2 is required'),
  body('idea2Domain').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Domain for Idea 2 is required'),
  body('idea2WorthSpreading').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Worth spreading description for Idea 2 is required'),
  body('idea2Relevance').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Relevance description for Idea 2 is required'),
  body('idea2Challenge').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Challenge or gap description for Idea 2 is required'),
  body('idea2Impact').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Impact description for Idea 2 is required'),
  body('idea2Scalability').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Scalability description for Idea 2 is required'),
  body('idea2LivedExperience').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Lived experience indicator for Idea 2 is required'),
  body('idea2Props').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Props usage indicator for Idea 2 is required'),
  body('idea2Articles').if(body('idea2Title').notEmpty()).trim().notEmpty().withMessage('Articles, videos, or work samples for Idea 2 are required'),

  // --- Idea 3 (Conditional: only validated if idea3Title is provided) ---
  body('whySpeak3').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Why speak for Idea 3 is required'),
  body('idea3Description').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Description for Idea 3 is required'),
  body('idea3Domain').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Domain for Idea 3 is required'),
  body('idea3WorthSpreading').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Worth spreading description for Idea 3 is required'),
  body('idea3Relevance').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Relevance description for Idea 3 is required'),
  body('idea3Challenge').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Challenge or gap description for Idea 3 is required'),
  body('idea3Impact').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Impact description for Idea 3 is required'),
  body('idea3Scalability').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Scalability description for Idea 3 is required'),
  body('idea3LivedExperience').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Lived experience indicator for Idea 3 is required'),
  body('idea3Props').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Props usage indicator for Idea 3 is required'),
  body('idea3Articles').if(body('idea3Title').notEmpty()).trim().notEmpty().withMessage('Articles, videos, or work samples for Idea 3 are required'),

  // --- SECTION 4: Proposed Talk & Confirmations ---
  body('proposedTitle').trim().notEmpty().withMessage('Proposed Talk Title is required'),
  body('proposedDescription').trim().notEmpty().withMessage('Talk originality and sharing explanation is required'),
  body('proposedQualifications').trim().notEmpty().withMessage('Qualifications highlight is required'),
  body('policyComfort').trim().notEmpty().withMessage('Recording policy comfort selection is required'),
  body('factCheckingNeed').trim().notEmpty().withMessage('Fact-checking and sensitive content selection is required'),
  body('willingnessToModify').trim().notEmpty().withMessage('Willingness to modify talk selection is required'),
  body('soloPresentationConfirmed').isBoolean().withMessage('Solo presentation confirmation must be a boolean').equals('true').withMessage('You must confirm the presentation is delivered solo'),
  body('durationConfirmed').isBoolean().withMessage('Duration confirmation must be a boolean').equals('true').withMessage('You must confirm the talk does not exceed 18 minutes'),
  body('compliesConfirmed').isBoolean().withMessage('Guidelines confirmation must be a boolean').equals('true').withMessage('You must confirm compliance with TEDx content guidelines'),
  body('guidelinesAligned').trim().notEmpty().withMessage('TEDx guideline alignment confirmation is required').equals('YES').withMessage('You must confirm alignment with TEDx guidelines'),
  body('howLearned').trim().notEmpty().withMessage('Information on how you learned about TEDxKARE is required'),
];

// Public: create speaker submission
router.post('/', speakerLimiter, speakerValidation, createSpeaker);

// Admin routes
router.get('/', authenticate, getAllSpeakers);
router.get('/:id', authenticate, getSpeakerById);
router.patch('/:id', authenticate, updateSpeakerStatus);
router.delete('/:id', authenticate, deleteSpeaker);

export default router;
