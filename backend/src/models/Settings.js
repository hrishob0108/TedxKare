import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    attendeeRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    teamRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    speakerRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    attendeeLimit: {
      type: Number,
      default: 90,
    }
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
