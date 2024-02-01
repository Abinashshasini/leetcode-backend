import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Problem } from '../models/problem.model.js';

/**
 * STEPS
 * 1. Verify user has given all required filed for problem.
 * 2. Check if problem exist in dB (qid, title should be unique).
 * 3. Save problem details to dB.
 */
const handleAddProblem = asyncHandler(async (req, res) => {
  const {
    qid = '',
    title = '',
    acceptance = '',
    category = '',
    difficulty = '',
  } = req.body;

  if (
    [qid, title, acceptance, category, difficulty].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ApiError(400, 'Oops! some fileds are missing!!');
  }

  const isProblemExist = await Problem.findOne({
    $or: [{ qid }, { qid }],
  });

  if (isProblemExist) {
    throw new ApiError(400, 'Oops! problem already exists!!');
  }

  const problem = await Problem.create({
    qid: qid.toLowerCase(),
    title,
    acceptance,
    category,
    difficulty,
  });

  if (!problem) {
    throw new ApiError(500, 'Something went wrong while adding problem to dB');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, problem, 'Problem added successfully'));
});

/**
 * STEPS
 */
const handleFetchAllProblems = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Questions sent successfully'));
});

export { handleAddProblem, handleFetchAllProblems };
