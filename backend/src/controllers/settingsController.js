import Settings from '../models/Settings.js';
import Attendee from '../models/Attendee.js';
import Reservation from '../models/Reservation.js';

// ==================== GET SETTINGS ====================
// Public: Get global settings (like registration status and ticket capacities)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({ 
        registrationOpen: true,
        attendeeRegistrationOpen: true,
        teamRegistrationOpen: true,
        speakerRegistrationOpen: true,
        attendeeLimit: 100,
        internalAttendeeLimit: 60,
        externalAttendeeLimit: 40,
      });
    }

    // Get live slot counts (legacy attendees without ticketType are treated as Internal)
    const internalCount = await Attendee.countDocuments({
      ticketType: { $ne: 'External' },
      status: { $ne: 'Rejected' },
    });
    const externalCount = await Attendee.countDocuments({
      ticketType: 'External',
      status: { $ne: 'Rejected' },
    });

    // Count active locks (reservations)
    const internalReservations = await Reservation.countDocuments({
      ticketType: { $ne: 'External' },
    });
    const externalReservations = await Reservation.countDocuments({
      ticketType: 'External',
    });

    const internalLimit = settings.internalAttendeeLimit ?? 60;
    const externalLimit = settings.externalAttendeeLimit ?? 40;
    
    // As per user request: only subtract fully completed registrations from the public count
    const internalAvailable = Math.max(0, internalLimit - internalCount);
    const externalAvailable = Math.max(0, externalLimit - externalCount);

    res.json({
      success: true,
      data: {
        ...settings.toObject(),
        internalCount,
        externalCount,
        internalReservations,
        externalReservations,
        internalAvailable,
        externalAvailable,
        isInternalFull: internalAvailable <= 0,
        isExternalFull: externalAvailable <= 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== UPDATE SETTINGS ====================
// Admin only: Update global settings
export const updateSettings = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      registrationOpen,
      attendeeRegistrationOpen,
      teamRegistrationOpen,
      speakerRegistrationOpen,
      attendeeLimit,
      internalAttendeeLimit,
      externalAttendeeLimit,
    } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        registrationOpen: registrationOpen ?? attendeeRegistrationOpen ?? teamRegistrationOpen ?? true,
        attendeeRegistrationOpen: attendeeRegistrationOpen ?? true,
        teamRegistrationOpen: teamRegistrationOpen ?? true,
        speakerRegistrationOpen: speakerRegistrationOpen ?? true,
        attendeeLimit: attendeeLimit ?? 100,
        internalAttendeeLimit: internalAttendeeLimit ?? 60,
        externalAttendeeLimit: externalAttendeeLimit ?? 40,
      });
    } else {
      if (teamRegistrationOpen !== undefined) {
        settings.teamRegistrationOpen = teamRegistrationOpen;
        settings.registrationOpen = teamRegistrationOpen; // keep synced
      }
      if (attendeeRegistrationOpen !== undefined) {
        settings.attendeeRegistrationOpen = attendeeRegistrationOpen;
      }
      if (speakerRegistrationOpen !== undefined) {
        settings.speakerRegistrationOpen = speakerRegistrationOpen;
      }
      if (internalAttendeeLimit !== undefined) {
        settings.internalAttendeeLimit = internalAttendeeLimit;
      }
      if (externalAttendeeLimit !== undefined) {
        settings.externalAttendeeLimit = externalAttendeeLimit;
      }
      if (internalAttendeeLimit !== undefined || externalAttendeeLimit !== undefined) {
        settings.attendeeLimit = (settings.internalAttendeeLimit ?? 60) + (settings.externalAttendeeLimit ?? 40);
      } else if (attendeeLimit !== undefined) {
        settings.attendeeLimit = attendeeLimit;
      }
      if (registrationOpen !== undefined && teamRegistrationOpen === undefined && attendeeRegistrationOpen === undefined) {
        settings.registrationOpen = registrationOpen;
        settings.teamRegistrationOpen = registrationOpen; // fallback sync
        settings.attendeeRegistrationOpen = registrationOpen; // fallback sync
      }
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSettings,
  updateSettings,
};
