import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
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
      // TTL index: MongoDB will automatically delete this document after 300 seconds (5 minutes)
      expires: 300,
    },
  },
  {
    timestamps: false,
  }
);

// Ensure index exists for email so we can quickly look up or overwrite reservations
reservationSchema.index({ email: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
