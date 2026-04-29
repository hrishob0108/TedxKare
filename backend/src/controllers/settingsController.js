import Settings from '../models/Settings.js';

// ==================== GET SETTINGS ====================
// Public: Get global settings (like registration status)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({ registrationOpen: true });
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

    const { registrationOpen } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ registrationOpen });
    } else {
      if (registrationOpen !== undefined) {
        settings.registrationOpen = registrationOpen;
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
