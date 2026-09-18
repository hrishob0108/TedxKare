import Settings from '../models/Settings.js';

// ==================== GET SETTINGS ====================
// Public: Get global settings (like registration status)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({ 
        registrationOpen: true,
        attendeeRegistrationOpen: true,
        teamRegistrationOpen: true,
        speakerRegistrationOpen: true
      });
    }

    res.json({
      success: true,
      data: settings,
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

    const { registrationOpen, attendeeRegistrationOpen, teamRegistrationOpen, speakerRegistrationOpen, attendeeLimit } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        registrationOpen: registrationOpen ?? attendeeRegistrationOpen ?? teamRegistrationOpen ?? true,
        attendeeRegistrationOpen: attendeeRegistrationOpen ?? true,
        teamRegistrationOpen: teamRegistrationOpen ?? true,
        speakerRegistrationOpen: speakerRegistrationOpen ?? true,
        attendeeLimit: attendeeLimit ?? 90,
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
      if (attendeeLimit !== undefined) {
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
