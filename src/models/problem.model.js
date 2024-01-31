import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    qid: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    acceptance: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    externalLink: {
      type: String,
      default: '',
    },
    solutions: {
      type: String,
      default: '',
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Problem = mongoose.model('Problem', problemSchema);
