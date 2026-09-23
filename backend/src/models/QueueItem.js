import mongoose from 'mongoose';

const queueItemSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    ticketType: {
      type: String,
      enum: ['Internal', 'External'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastPolledAt: {
      type: Date,
      default: Date.now,
      // TTL index: MongoDB will automatically delete this document if the user hasn't polled in 30 seconds
      expires: 30,
    },
  },
  {
    timestamps: false,
  }
);

// Ensure index exists for email
queueItemSchema.index({ email: 1 });

const QueueItem = mongoose.model('QueueItem', queueItemSchema);

export default QueueItem;
