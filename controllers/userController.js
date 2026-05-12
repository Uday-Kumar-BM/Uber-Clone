import User from '../models/User.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
  res.status(200).json(users);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin or User (for own profile)
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });

  if (user) {
    // Allow user to view their own profile, or admin to view any profile
    if (req.user.userType === 'admin' || req.user.id === user.id) {
      res.status(200).json(user);
    } else {
      errorHandler(res, 403, 'Not authorized to view this user profile');
    }
  } else {
    errorHandler(res, 404, 'User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private/Admin or User (for own profile)
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    // Allow user to update their own profile, or admin to update any profile
    if (req.user.userType === 'admin' || req.user.id === user.id) {
      const { firstName, lastName, email, phone, profilePictureUrl, userType, status } = req.body;

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.profilePictureUrl = profilePictureUrl || user.profilePictureUrl;

      // Only admin can change userType or status
      if (req.user.userType === 'admin') {
        user.userType = userType || user.userType;
        user.status = status || user.status;
      }

      await user.save();

      res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profilePictureUrl: user.profilePictureUrl,
        userType: user.userType,
        status: user.status,
      });
    } else {
      errorHandler(res, 403, 'Not authorized to update this user profile');
    }
  } else {
    errorHandler(res, 404, 'User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    // Prevent deleting self if not an admin, or prevent an admin from deleting the only admin
    if (req.user.id === user.id) {
      return errorHandler(res, 400, 'Cannot delete your own account via this endpoint.');
    }
    
    await user.destroy();
    res.status(200).json({ message: 'User removed' });
  } else {
    errorHandler(res, 404, 'User not found');
  }
});

export { getUsers, getUserById, updateUser, deleteUser };
