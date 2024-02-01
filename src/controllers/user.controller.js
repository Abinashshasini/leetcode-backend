import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import { UserDetails } from '../models/user-details.models.js';

/** Cookie option's for setting user cookies */
const cookiesOptions = {
  httpOnly: true,
  secure: true,
};

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
  const { email = '', password = '', username = '' } = req.body;

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

  await UserDetails.create({
    id: user?._id,
  });

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
  console.log('req.body: ', req.body);

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, 'Invalid user credentials');
  }

  const { accessToken, refreshToken } =
    await handleGenerateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findOne(user._id).select(
    '-password -refreshToken'
  );

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
 * 1. Get user tokens from frontend and check if it's a valid user which will be done by middleware.
 * 2. Delete the refresh token from dB.
 * 3. Remove access and refresh tokens from user cookies.
 */
const handleLogoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie('accessToken', cookiesOptions)
    .clearCookie('refreshToken', cookiesOptions)
    .json(new ApiResponse(200, {}, 'User logged Out Successfully!!'));
});

/**
 * STEPS
 * Read users refresh token from cookies.
 * Decode user's refresh token and match with user in dB refresh token.
 * Generate new refresh and access token.
 * Update user's cookies and user's in dB.
 */
const handleRefreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const { accessToken, newRefreshToken } =
      await handleGenerateAccessAndRefreshToken(user?._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookiesOptions)
      .cookie('refreshToken', newRefreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken: newRefreshToken,
          },
          'New access token generated successfully'
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

export {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
  handleRefreshAccessToken,
};
