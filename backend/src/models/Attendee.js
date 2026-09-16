import mongoose from 'mongoose';

// ==================== ATTENDEE MODEL ====================
// Schema for storing TEDx event attendee registration information
const attendeeSchema = new mongoose.Schema(
  {
    // Personal Details
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [16, 'Must be at least 16 years old'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
      required: [true, 'LinkedIn profile is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },

    // Academic / Professional Details
    college: {
      type: String,
      required: [true, 'College / Organization is required'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Course / Designation is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year of Study is required'],
      trim: true,
    },

    // Ticket Details
    ticketType: {
      type: String,
      required: [true, 'Ticket type is required'],
      enum: ['Standard', 'VIP', 'Student Early Bird'],
    },
    source: {
      type: String,
      required: [true, 'Please tell us how you heard about us'],
      trim: true,
    },

    // Application Status
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    // Tracking (for spam identification)
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    screenResolution: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
attendeeSchema.index({ email: 1 });
attendeeSchema.index({ ticketType: 1 });
attendeeSchema.index({ status: 1 });

const Attendee = mongoose.model('Attendee', attendeeSchema);

export default Attendee;
