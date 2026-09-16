import Attendee from '../models/Attendee.js';
import Settings from '../models/Settings.js';
import { validationResult } from 'express-validator';

// ==================== GET ALL ATTENDEES ====================
// Admin only: Retrieve all attendees with optional filtering
export const getAllAttendees = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in as an admin to access attendees. Please log in first.'
      });
    }

    const { ticketType, status, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    let filter = {};

    if (ticketType && ticketType !== 'All') {
      filter.ticketType = ticketType;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;

    const attendees = await Attendee.find(filter).sort(sortObj).lean();

    res.json({
      success: true,
      count: attendees.length,
      data: attendees,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET SINGLE ATTENDEE ====================
export const getAttendeeById = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const attendee = await Attendee.findById(req.params.id);

    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    res.json({
      success: true,
      data: attendee,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CREATE NEW ATTENDEE REGISTRATION ====================
export const createRegistration = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    // Use attendeeRegistrationOpen or fallback to registrationOpen
    const isRegistrationOpen = settings?.attendeeRegistrationOpen ?? settings?.registrationOpen ?? true;
    if (!isRegistrationOpen) {
      return res.status(403).json({
        error: 'Registration closed',
        message: 'Event ticket registrations are currently closed.',
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((err) => ({
          field: err.path || err.param,
          message: err.msg,
        })),
      });
    }

    // Honeypot check
    if (req.body.website) {
      return res.status(200).json({
        success: true,
        message: 'Registration submitted successfully',
      });
    }

    const existingAttendee = await Attendee.findOne({ email: req.body.email });
    if (existingAttendee) {
      return res.status(409).json({
        error: 'Email already registered',
        message: 'You have already registered for this event with this email address.',
      });
    }

    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '';

    const userAgent = req.headers['user-agent'] || '';

    if (ipAddress) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentRegs = await Attendee.countDocuments({
        ipAddress,
        createdAt: { $gte: oneDayAgo },
      });

      if (recentRegs >= 10) {
        return res.status(429).json({
          error: 'Too many registrations from your network',
          message: 'Please try again later.',
        });
      }
    }

    const attendeeData = {
      ...req.body,
      ipAddress,
      userAgent,
    };

    const attendee = new Attendee(attendeeData);
    await attendee.save();

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        id: attendee._id,
        name: attendee.name,
        email: attendee.email,
      },
    });

  } catch (error) {
    next(error);
  }
};

// ==================== UPDATE ATTENDEE STATUS ====================
export const updateAttendeeStatus = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status } = req.body;
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status provided',
        message: `Status must be one of: ${validStatuses.join(', ')}.`,
      });
    }

    const attendee = await Attendee.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: attendee,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== DELETE ATTENDEE ====================
export const deleteAttendee = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const attendee = await Attendee.findByIdAndDelete(req.params.id);

    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    res.json({
      success: true,
      message: 'Attendee deleted successfully',
      data: attendee,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET STATISTICS ====================
export const getStatistics = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const totalAttendees = await Attendee.countDocuments();
    const pendingAttendees = await Attendee.countDocuments({ status: 'Pending' });
    const approvedAttendees = await Attendee.countDocuments({ status: 'Approved' });
    const rejectedAttendees = await Attendee.countDocuments({ status: 'Rejected' });

    const byTicketType = await Attendee.aggregate([
      {
        $group: {
          _id: '$ticketType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalAttendees,
        byStatus: {
          pending: pendingAttendees,
          approved: approvedAttendees,
          rejected: rejectedAttendees,
        },
        byTicketType: byTicketType.map((d) => ({
          type: d._id,
          count: d.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAttendees,
  getAttendeeById,
  createRegistration,
  updateAttendeeStatus,
  deleteAttendee,
  getStatistics,
};
