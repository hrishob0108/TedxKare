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

    const { ticketType, occupation, status, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};

    if (ticketType && ticketType !== 'All') {
      filter.ticketType = ticketType;
    }

    if (occupation && occupation !== 'All') {
      filter.occupation = occupation;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
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

// ==================== IN-MEMORY MUTEX ====================
// This prevents race conditions when multiple users submit exactly at the same time
let isRegistering = false;
const waitForLock = async () => {
  while (isRegistering) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  isRegistering = true;
};
const releaseLock = () => {
  isRegistering = false;
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

    // Wait for our turn if someone else is currently registering
    await waitForLock();

    try {
      // Check attendee limit for specific ticket type (excluding rejected applications)
      const ticketType = req.body.ticketType || 'Internal';
      const internalLimit = settings?.internalAttendeeLimit ?? 60;
      const externalLimit = settings?.externalAttendeeLimit ?? 40;

      if (ticketType === 'Internal') {
        const internalCount = await Attendee.countDocuments({
          ticketType: { $ne: 'External' },
          status: { $ne: 'Rejected' },
        });
        if (internalCount >= internalLimit) {
          releaseLock();
          return res.status(403).json({
            error: 'Internal ticket limit reached',
            message: `All ${internalLimit} internal ticket slots for KARE students have been filled. Registration is full.`,
          });
        }
      } else {
        const externalCount = await Attendee.countDocuments({
          ticketType: 'External',
          status: { $ne: 'Rejected' },
        });
        if (externalCount >= externalLimit) {
          releaseLock();
          return res.status(403).json({
            error: 'External ticket limit reached',
            message: `All ${externalLimit} external ticket slots have been filled. Registration is full.`,
          });
        }
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
        releaseLock();
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
          releaseLock();
          return res.status(429).json({
            error: 'Too many registrations from your network',
            message: 'Please try again later.',
          });
        }
      }

      const attendeeData = {
        ...req.body,
        ticketType: req.body.ticketType || 'Internal',
        ipAddress,
        userAgent,
      };

      const attendee = new Attendee(attendeeData);
      await attendee.save();

      // Release lock so the next person in line can register
      releaseLock();

      res.status(201).json({
        success: true,
        message: 'Registration submitted successfully',
        data: {
          id: attendee._id,
          name: attendee.name,
          email: attendee.email,
          phone: attendee.phone,
          ticketType: attendee.ticketType,
        },
      });
    } catch (err) {
      // In case of a database error or validation crash, release the lock
      releaseLock();
      throw err;
    }
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
    const internalTickets = await Attendee.countDocuments({ ticketType: { $ne: 'External' } });
    const externalTickets = await Attendee.countDocuments({ ticketType: 'External' });

    const attendeesByOccupation = await Attendee.aggregate([
      {
        $group: {
          _id: '$occupation',
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
        byTicketType: {
          internal: internalTickets,
          external: externalTickets,
        },
        occupations: attendeesByOccupation.map(item => ({
          type: item._id || 'Unknown',
          count: item.count
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
