import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';

/**
 * STEPS
 */
const handleAddQuestion = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Question added successfully'));
});

/**
 * STEPS
 */
const handleFetchAllQuestions = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Questions sent successfully'));
});

export { handleAddQuestion, handleFetchAllQuestions };
