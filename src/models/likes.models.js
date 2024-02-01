import mongoose from 'mongoose';

const likesSchema = new mongoose.Schema(
  {
    userId: {},
    qid: {},
  },
  { timestamps: true }
);

export const Likes = mongoose.model('Likes', likesSchema);
