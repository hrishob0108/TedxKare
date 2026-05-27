import Speaker from '../models/Speaker.js';
import { validationResult } from 'express-validator';
import axios from 'axios';
import { getSpeakerEmailTemplate } from '../utils/emailTemplates.js';

// Create new speaker submission (public)
export const createSpeaker = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((err) => ({ field: err.param, message: err.msg })),
      });
    }

    // Honeypot
    if (req.body.website) {
      console.log('🛑 Bot submission blocked (speaker)');
      return res.status(200).json({ success: true, message: 'Submission received' });
    }

    // Prevent duplicate speaker submissions with same email and title
    const exists = await Speaker.findOne({ email: req.body.email, title: req.body.title });
    if (exists) {
      return res.status(409).json({ error: 'Duplicate submission', message: 'A similar speaker submission already exists.' });
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const speaker = new Speaker({ ...req.body, ipAddress, userAgent });
    await speaker.save();

    res.status(201).json({ success: true, message: 'Speaker submission received', data: { id: speaker._id } });
    console.log(`✓ New speaker submission from ${speaker.name} (${speaker.email})`);
  } catch (error) {
    next(error);
  }
};

// Admin: list all speakers
export const getAllSpeakers = async (req, res, next) => {
  try {
    if (!req.admin) return res.status(401).json({ error: 'Unauthorized' });
    const speakers = await Speaker.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: speakers.length, data: speakers });
  } catch (error) {
    next(error);
  }
};

// Admin: get single speaker
export const getSpeakerById = async (req, res, next) => {
  try {
    if (!req.admin) return res.status(401).json({ error: 'Unauthorized' });
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: speaker });
  } catch (error) {
    next(error);
  }
};

// Admin: update speaker status
export const updateSpeakerStatus = async (req, res, next) => {
  try {
    if (!req.admin) return res.status(401).json({ error: 'Unauthorized' });
    const { status } = req.body;
    const valid = ['Pending', 'Reviewed', 'Selected', 'Rejected'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    // Helper function to send email
    const sendEmail = async (toEmail, subject, bodyText) => {
      try {
        const response = await axios.post("https://7feej0sxm3.execute-api.eu-north-1.amazonaws.com/default/mail_sender", {
          config: {
            email: process.env.EMAIL_USER || "hrishobp@gmail.com",
            pass: process.env.PASS || "lerz fhwj rsqx ogbp",
            from: `'TEDxKARE' <${process.env.EMAIL_USER || "hrishobp@gmail.com"}>`,
          },
          to: toEmail,
          subject: subject,
          text: bodyText,
          html: bodyText.replace(/\n/g, '<br>')
        });
        console.log("Speaker email sent successfully:", response.data);
      } catch (error) {
        console.error("Failed to send speaker email to", toEmail, ":", error.message);
      }
    };

    const speaker = await Speaker.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!speaker) return res.status(404).json({ error: 'Not found' });

    // Trigger emails based on specific status updates
    if (status === 'Selected' || status === 'Rejected') {
      const emailBody = getSpeakerEmailTemplate(speaker.name, status, speaker.title);
      const subject = status === 'Selected' 
        ? "Congratulations! Your talk has been selected for TEDxKARE" 
        : "Update on your TEDxKARE Talk Proposal";
      
      // Fire and forget email
      sendEmail(speaker.email, subject, emailBody);
    }

    res.json({ success: true, data: speaker });
  } catch (error) {
    next(error);
  }
};

// Admin: delete speaker
export const deleteSpeaker = async (req, res, next) => {
  try {
    if (!req.admin) return res.status(401).json({ error: 'Unauthorized' });
    const speaker = await Speaker.findByIdAndDelete(req.params.id);
    if (!speaker) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: speaker });
  } catch (error) {
    next(error);
  }
};

export default { createSpeaker, getAllSpeakers, getSpeakerById, updateSpeakerStatus, deleteSpeaker };
