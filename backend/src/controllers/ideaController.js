import Idea from '../models/Idea.js';
import { validationResult } from 'express-validator';

// Public: Get all ideas sorted by likes (-1) and createdAt (-1)
export const getAllIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find().sort({ likes: -1, createdAt: -1 }).lean();
    res.json({ success: true, count: ideas.length, data: ideas });
  } catch (error) {
    next(error);
  }
};

// Public: Create a new brainstorm idea
export const createIdea = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((err) => ({ field: err.param, message: err.msg })),
      });
    }

    // Honeypot bot protection
    if (req.body.website) {
      console.log('🛑 Bot submission blocked (idea)');
      return res.status(200).json({ success: true, message: 'Idea received' });
    }

    const { title, desc, cat, author } = req.body;
    
    // Prevent exactly identical idea titles
    const exists = await Idea.findOne({ title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } });
    if (exists) {
      return res.status(409).json({ error: 'Duplicate idea', message: 'An idea with this title has already been suggested.' });
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';

    const idea = new Idea({
      title: title.trim(),
      desc: desc.trim(),
      cat,
      author: author?.trim() || 'Anonymous Student',
      likes: 1, // Default with 1 self-like
      ipAddress
    });

    await idea.save();
    console.log(`✓ New Idea Sandbox submission: "${idea.title}" by ${idea.author}`);

    res.status(201).json({ success: true, message: 'Idea successfully cast into the Sandbox', data: idea });
  } catch (error) {
    next(error);
  }
};

// Public: Upvote/Like an idea
export const likeIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Not found', message: 'Idea not found.' });
    }

    idea.likes += 1;
    await idea.save();

    res.json({ success: true, message: 'Idea upvoted', data: idea });
  } catch (error) {
    next(error);
  }
};
