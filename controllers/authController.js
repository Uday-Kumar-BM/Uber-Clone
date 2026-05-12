import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, phone, userType } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return errorHandler(res, 400, 'Please enter all required fields.');
  }

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    return errorHandler(res, 400, 'User already exists with that email.');
  }

  const newUser = await User.create({
    email,
    passwordHash: password, // passwordHash will be hashed by a hook
    firstName,
    lastName,
    phone,
    userType: userType || 'rider', // Default to rider if not specified
  });

  if (newUser) {
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      userType: newUser.userType,
      token: generateToken(newUser.id),
    });
  } else {
    errorHandler(res, 400, 'Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      token: generateToken(user.id),
    });
  } else {
    errorHandler(res, 401, 'Invalid email or password');
  }
});

// @desc    Log out user (invalidate token conceptually client-side)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res, next) => {
  // For JWTs, logout is typically handled client-side by deleting the token.
  // On the server, we might blacklist tokens or manage refresh tokens.
  // For this basic setup, we'll just send a success message.
  res.status(200).json({ message: 'Logged out successfully. Please discard your token.' });
});

// @desc    Verify email (not implemented, placeholder)
// @route   GET /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res, next) => {
  // In a real app, this would involve a token sent to the user's email.
  res.status(200).json({ message: 'Email verification endpoint (functionality not implemented).' });
});

export { registerUser, loginUser, logoutUser, verifyEmail };
