import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2 },
    desc: { type: String, required: true, trim: true },
    cat: { type: String, required: true, trim: true },
    author: { type: String, default: 'Anonymous Student', trim: true },
    likes: { type: Number, default: 0 },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

ideaSchema.index({ createdAt: -1 });

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;
