import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';

/**
 * STEPS
 * 1. Get user details from frontend
 * 2. Validate fields -  not empty
 * 3. Check if user exists: email, username
 * 4. Create user object -  create entry in dB
 * 5. Remove password and refresh token filed from response
 * 6. Check user creation and return response
 */
const handleRegisterUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  console.log('req.body: ', req.body);

  if ([username, email, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'Oops! some fileds are missing');
  }

  const isExistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isExistedUser) {
    throw new ApiError(409, 'User allredy exists');
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user?._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'));
});

export { handleRegisterUser };
