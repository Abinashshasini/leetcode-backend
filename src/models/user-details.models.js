import mongoose from 'mongoose';

const userDetailsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    solvedProblems: {
      type: Array,
      default: [],
    },
    starredProblems: {
      type: Array,
      default: [],
    },
    dislikedProblems: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export const UserDetails = mongoose.model('UserDetails', userDetailsSchema);
