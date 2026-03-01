import mongoose from 'mongoose';

// ==================== APPLICANT MODEL ====================
// Schema for storing TEDx event applicant information
const applicantSchema = new mongoose.Schema(
  {
    // Personal Information
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
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

    // Academic Information
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'Computer Science',
        'Information Technology',
        'Mechanical Engineering',
        'Electrical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Electronics',
        'Other',
      ],
    },
    year: {
      type: String,
      required: [true, 'Year of study is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Faculty'],
    },

    // Portfolio Links
    linkedin: {
      type: String,
      trim: true,
      default: '',
    },
    portfolio: {
      type: String,
      trim: true,
      default: '',
    },

    // Domain Preferences
    firstPreference: {
      type: String,
      required: [true, 'First domain preference is required'],
      enum: [
        'Research Team',
        'Marketing Team',
        'Sponsorship Team',
        'Finance Team',
        'Design Team',
        'Media Team',
        'Content Team',
        'Event Managers and Editors',
      ],
    },
    secondPreference: {
      type: String,
      required: [true, 'Second domain preference is required'],
      enum: [
        'Research Team',
        'Marketing Team',
        'Sponsorship Team',
        'Finance Team',
        'Design Team',
        'Media Team',
        'Content Team',
        'Event Managers and Editors',
      ],
    },

    // Motivation and Experience
    whyTedx: {
      type: String,
      required: [true, 'Please tell us why you want to join TEDx'],
      minlength: [20, 'Answer must be at least 20 characters'],
    },
    whyDomain: {
      type: String,
      required: [true, 'Please tell us why you chose this domain'],
      minlength: [20, 'Answer must be at least 20 characters'],
    },
    experience: {
      type: String,
      required: [true, 'Please share your previous experience'],
      minlength: [20, 'Answer must be at least 20 characters'],
    },

    // Availability
    availability: {
      type: String,
      required: [true, 'Weekly availability is required'],
      enum: ['0-5 hours', '5-10 hours', '10-15 hours', '15+ hours'],
    },

    // Application Status
    status: {
      type: String,
      enum: ['Pending', 'Shortlisted', 'Rejected'],
      default: 'Pending',
    },

    // IP Address for tracking (optional)
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
applicantSchema.index({ email: 1 });
applicantSchema.index({ firstPreference: 1 });
applicantSchema.index({ status: 1 });

const Applicant = mongoose.model('Applicant', applicantSchema);

export default Applicant;
