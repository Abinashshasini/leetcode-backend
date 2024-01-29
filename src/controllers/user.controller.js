import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
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
  console.log('req.body', req.body);

  if ([username, email, password].some((fields) => fields?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const isExistedUser = User.findOne({
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

  const createdUser = await User.findById(user?._id).select('');
});

export { handleRegisterUser };
