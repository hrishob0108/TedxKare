import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    abstract: { type: String, required: true, trim: true, minlength: 30 },
    durationMinutes: { type: Number, default: 10 },
    bio: { type: String, trim: true },
    sampleLink: { type: String, trim: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Selected', 'Rejected'], default: 'Pending' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

speakerSchema.index({ email: 1 });
speakerSchema.index({ status: 1 });

const Speaker = mongoose.model('Speaker', speakerSchema);

export default Speaker;
