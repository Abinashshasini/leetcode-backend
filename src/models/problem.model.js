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
      trim: true,
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
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export const Problem = mongoose.model('Problem', problemSchema);
