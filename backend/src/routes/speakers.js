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
  body('linkedin').trim().isURL({ require_protocol: false }).withMessage('Valid LinkedIn URL is required'),
  body('firstTedxTalk').trim().notEmpty().withMessage('Specify if this is speaker\'s first TEDx talk'),
  body('hasDisability').trim().notEmpty().withMessage('Please specify if the speaker has any disability'),
  body('disabilityDetails').optional().trim(),
  
  // --- Nominator Information (Conditional: only validated if selfNomination is 'No, I am nominating another individual.') ---
  body('nominatorName').if(body('selfNomination').equals('No, I am nominating another individual.')).trim().notEmpty().withMessage('Nominator Name is required'),
  body('nominatorEmail').if(body('selfNomination').equals('No, I am nominating another individual.')).trim().isEmail().withMessage('Valid nominator email address is required'),
  body('nominatorPhone').if(body('selfNomination').equals('No, I am nominating another individual.')).trim().notEmpty().withMessage('Nominator phone number is required'),
  body('nominatorLocation').if(body('selfNomination').equals('No, I am nominating another individual.')).trim().notEmpty().withMessage('Nominator location is required'),
  body('nominatorOrganization').if(body('selfNomination').equals('No, I am nominating another individual.')).trim().notEmpty().withMessage('Nominator organization name is required'),
  body('nominatorRelationship').if(body('selfNomination').equals('No, I am nominating another individual.')).trim().notEmpty().withMessage('Relationship with speaker is required'),
  
  // --- Idea 1 (Required) ---
  body('whySpeak1').trim().notEmpty().withMessage('Explanation of why this speaker should speak is required'),
  body('idea1Title').trim().notEmpty().withMessage('Idea 1 Title is required'),
  body('idea1Description').trim().notEmpty().withMessage('Idea 1 Description is required'),
  body('idea1Domain').trim().notEmpty().withMessage('Idea 1 Domain is required'),
  body('idea1WorthSpreading').trim().notEmpty().withMessage('Description of what makes this idea worth spreading is required'),
  body('idea1Relevance').trim().notEmpty().withMessage('Explanation of why this idea is relevant is required'),
  body('idea1Challenge').trim().notEmpty().withMessage('Challenge or gap this idea addresses is required'),
  body('idea1Impact').trim().notEmpty().withMessage('Description of measurable impact is required'),
  body('idea1Evidence').trim().notEmpty().withMessage('Evidence and sources supporting claims are required'),
  body('idea1Scalability').trim().notEmpty().withMessage('Scalability explanation is required'),
  body('idea1LivedExperience').trim().notEmpty().withMessage('Lived experience indicator is required'),
  body('idea1Props').trim().notEmpty().withMessage('Props usage indicator is required'),
  body('idea1PresentedBefore').trim().notEmpty().withMessage('Previous presentation indicator is required'),
  body('idea1PresentedBeforeDetails').if(body('idea1PresentedBefore').equals('YES')).trim().notEmpty().withMessage('Previous presentation details are required'),
  body('idea1Articles').trim().notEmpty().withMessage('Articles, videos, or work samples are required'),
  body('idea1NewSurprising').trim().notEmpty().withMessage('Explanation of what makes this idea new/surprising is required'),
  body('idea1Audience').trim().notEmpty().withMessage('Target audience description is required'),

  // --- Idea 2 (Required) ---
  body('idea2Title').trim().notEmpty().withMessage('Idea 2 Title is required'),
  body('idea2Description').trim().notEmpty().withMessage('Description for Idea 2 is required'),
  body('idea2Domain').trim().notEmpty().withMessage('Domain for Idea 2 is required'),
  body('idea2WorthSpreading').trim().notEmpty().withMessage('Worth spreading description for Idea 2 is required'),
  body('idea2Relevance').trim().notEmpty().withMessage('Relevance description for Idea 2 is required'),
  body('idea2Challenge').trim().notEmpty().withMessage('Challenge or gap description for Idea 2 is required'),
  body('idea2Impact').trim().notEmpty().withMessage('Impact description for Idea 2 is required'),
  body('idea2Evidence').trim().notEmpty().withMessage('Evidence and sources for Idea 2 are required'),
  body('idea2Scalability').trim().notEmpty().withMessage('Scalability description for Idea 2 is required'),
  body('idea2LivedExperience').trim().notEmpty().withMessage('Lived experience indicator for Idea 2 is required'),
  body('idea2Props').trim().notEmpty().withMessage('Props usage indicator for Idea 2 is required'),
  body('idea2PresentedBefore').trim().notEmpty().withMessage('Previous presentation indicator for Idea 2 is required'),
  body('idea2PresentedBeforeDetails').if(body('idea2PresentedBefore').equals('YES')).trim().notEmpty().withMessage('Previous presentation details for Idea 2 are required'),
  body('idea2Articles').trim().notEmpty().withMessage('Articles, videos, or work samples for Idea 2 are required'),
  body('idea2NewSurprising').trim().notEmpty().withMessage('What makes Idea 2 surprising is required'),
  body('idea2Audience').trim().notEmpty().withMessage('Target audience for Idea 2 is required'),

  // --- Idea 3 (Required) ---
  body('idea3Title').trim().notEmpty().withMessage('Idea 3 Title is required'),
  body('idea3Description').trim().notEmpty().withMessage('Description for Idea 3 is required'),
  body('idea3Domain').trim().notEmpty().withMessage('Domain for Idea 3 is required'),
  body('idea3WorthSpreading').trim().notEmpty().withMessage('Worth spreading description for Idea 3 is required'),
  body('idea3Relevance').trim().notEmpty().withMessage('Relevance description for Idea 3 is required'),
  body('idea3Challenge').trim().notEmpty().withMessage('Challenge or gap description for Idea 3 is required'),
  body('idea3Impact').trim().notEmpty().withMessage('Impact description for Idea 3 is required'),
  body('idea3Evidence').trim().notEmpty().withMessage('Evidence and sources for Idea 3 are required'),
  body('idea3Scalability').trim().notEmpty().withMessage('Scalability description for Idea 3 is required'),
  body('idea3LivedExperience').trim().notEmpty().withMessage('Lived experience indicator for Idea 3 is required'),
  body('idea3Props').trim().notEmpty().withMessage('Props usage indicator for Idea 3 is required'),
  body('idea3PresentedBefore').trim().notEmpty().withMessage('Previous presentation indicator for Idea 3 is required'),
  body('idea3PresentedBeforeDetails').if(body('idea3PresentedBefore').equals('YES')).trim().notEmpty().withMessage('Previous presentation details for Idea 3 are required'),
  body('idea3Articles').trim().notEmpty().withMessage('Articles, videos, or work samples for Idea 3 are required'),
  body('idea3NewSurprising').trim().notEmpty().withMessage('What makes Idea 3 surprising is required'),
  body('idea3Audience').trim().notEmpty().withMessage('Target audience for Idea 3 is required'),

  // --- SECTION 4: Proposed Talk & Confirmations ---
  body('proposedTitle').trim().notEmpty().withMessage('Proposed Talk Title is required'),
  body('proposedDescription').trim().notEmpty().withMessage('Talk originality and sharing explanation is required'),
  body('proposedQualifications').trim().notEmpty().withMessage('Qualifications highlight is required'),
  body('policyComfort').trim().notEmpty().withMessage('Recording policy comfort selection is required'),
  body('factCheckingNeed').trim().notEmpty().withMessage('Fact-checking and sensitive content selection is required'),
  body('willingnessToModify').trim().notEmpty().withMessage('Willingness to modify talk selection is required'),
  body('soloPresentationConfirmed').isBoolean().withMessage('Solo presentation confirmation must be a boolean').custom((val) => val === true).withMessage('You must confirm the presentation is delivered solo'),
  body('durationConfirmed').isBoolean().withMessage('Duration confirmation must be a boolean').custom((val) => val === true).withMessage('You must confirm the talk does not exceed 18 minutes'),
  body('compliesConfirmed').isBoolean().withMessage('Guidelines confirmation must be a boolean').custom((val) => val === true).withMessage('You must confirm compliance with TEDx content guidelines'),
  body('guidelinesAligned').trim().notEmpty().withMessage('TEDx guideline alignment confirmation is required').equals('YES').withMessage('You must confirm alignment with TEDx guidelines'),
  body('hasAdditionalIdeas').trim().notEmpty().withMessage('Please specify if you have additional talk ideas'),
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
