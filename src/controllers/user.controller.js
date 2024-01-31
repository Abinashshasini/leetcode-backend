import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';

/** Function to generate access and refresh token for user  */
const handleGenerateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Oops! something went wrong while generating token'
    );
  }
};

/**
 * STEPS
 * 1. Get user details from frontend.
 * 2. Validate fields -  not empty.
 * 3. Check if user exists: email, username.
 * 4. Create user object -  create entry in dB.
 * 5. Remove password and refresh token filed from response.
 * 6. Check user creation and return response.
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

/*
 * STEPS
 * 1. Get user details from frontend.
 * 2. Check if the username or email exists in the req.body.
 * 3. Find user in the dB.
 * 4. Match user password in the dB.
 * 5. Generate access token and refresh token.
 * 6. Remove password and refresh token from loggedin user (This can be solved by another dB call or updating the existing user)
 * 6. Set secure cookies and user info to frontend.
 */
const handleLoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne(email);

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, 'Invalid user credentials');
  }

  const { accessToken, refreshToken } =
    await handleGenerateAccessAndRefreshToken(user._id);

  const loggedInUser = User.findOne(user._id).select('-password -refreshToken');

  const cookiesOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookiesOptions)
    .cookie('refreshToken', refreshToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User logged in Successfully'
      )
    );
});

/*
 * STEPS
 * 1. Get user details from frontend.
 */
const handleLogoutUser = asyncHandler(async (req, res) => {});

export { handleRegisterUser, handleLoginUser, handleLogoutUser };
