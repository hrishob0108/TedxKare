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

    const { registrationOpen, teamRegistrationOpen, speakerRegistrationOpen } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        registrationOpen: registrationOpen ?? teamRegistrationOpen ?? true,
        teamRegistrationOpen: teamRegistrationOpen ?? true,
        speakerRegistrationOpen: speakerRegistrationOpen ?? true
      });
    } else {
      if (teamRegistrationOpen !== undefined) {
        settings.teamRegistrationOpen = teamRegistrationOpen;
        settings.registrationOpen = teamRegistrationOpen; // keep synced
      }
      if (speakerRegistrationOpen !== undefined) {
        settings.speakerRegistrationOpen = speakerRegistrationOpen;
      }
      if (registrationOpen !== undefined && teamRegistrationOpen === undefined) {
        settings.registrationOpen = registrationOpen;
        settings.teamRegistrationOpen = registrationOpen; // fallback sync
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
