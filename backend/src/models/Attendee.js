import mongoose from 'mongoose';

// ==================== ATTENDEE MODEL ====================
// Schema for storing TEDx event attendee registration information
const attendeeSchema = new mongoose.Schema(
  {
    // Ticket Classification
    ticketType: {
      type: String,
      enum: ['Internal', 'External'],
      default: 'Internal',
      required: [true, 'Ticket type is required'],
    },

    // Common Details
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },

    // Internal Ticket Specific Fields (KARE Students)
    registrationNumber: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.ticketType === 'Internal';
        },
        'Registration number is required for internal tickets',
      ],
    },
    department: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.ticketType === 'Internal';
        },
        'Department is required for internal tickets',
      ],
    },
    hostelDayScholar: {
      type: String,
      enum: ['Hostel', 'Day Scholar'],
      trim: true,
      required: [
        function () {
          return this.ticketType === 'Internal';
        },
        'Hostel / Day Scholar selection is required',
      ],
    },
    hostelName: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.ticketType === 'Internal' && this.hostelDayScholar === 'Hostel';
        },
        'Hostel name is required for hostellers',
      ],
    },
    wardenContact: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.ticketType === 'Internal' && this.hostelDayScholar === 'Hostel';
        },
        'Warden contact number is required for hostellers',
      ],
    },
    roomNumber: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.ticketType === 'Internal' && this.hostelDayScholar === 'Hostel';
        },
        'Room number is required for hostellers',
      ],
    },

    // External Ticket Specific Fields
    address: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.ticketType === 'External';
        },
        'Address is required for external tickets',
      ],
    },
    category: {
      type: String,
      enum: ['Student', 'Founder', 'Faculty', 'Business Professional', 'Other'],
      trim: true,
      required: [
        function () {
          return this.ticketType === 'External';
        },
        'Category is required for external tickets',
      ],
    },
    organization: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.ticketType === 'External';
        },
        'Organization / Startup / Company Name is required for external tickets',
      ],
    },

    // Optional / Legacy Fields (Maintained for backward compatibility)
    age: {
      type: Number,
    },
    occupation: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },

    // Payment Details
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      trim: true,
    },
    paymentScreenshot: {
      type: String,
      required: [true, 'Payment screenshot is required'],
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
attendeeSchema.index({ registrationNumber: 1 });
attendeeSchema.index({ status: 1 });
attendeeSchema.index({ ticketType: 1 });

const Attendee = mongoose.model('Attendee', attendeeSchema);

export default Attendee;
