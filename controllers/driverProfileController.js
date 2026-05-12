import DriverProfile from '../models/DriverProfile.js';
import User from '../models/User.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create a new driver profile
// @route   POST /api/driver-profiles
// @access  Private (Admin or Driver)
const createDriverProfile = asyncHandler(async (req, res, next) => {
  const { userId, licenseNumber, isAvailable, currentLatitude, currentLongitude, driverStatus } = req.body;

  // Ensure userId matches the authenticated user, or if admin, allow specifying userId
  if (req.user.userType !== 'admin' && req.user.id !== userId) {
    return errorHandler(res, 403, 'Not authorized to create a driver profile for another user.');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return errorHandler(res, 404, 'User not found.');
  }
  if (user.userType !== 'driver' && req.user.userType !== 'admin') {
    return errorHandler(res, 400, 'User must be a driver to have a driver profile. Only admins can create profiles for non-driver users.');
  }

  const existingProfile = await DriverProfile.findByPk(userId);
  if (existingProfile) {
    return errorHandler(res, 400, 'Driver profile already exists for this user.');
  }

  const driverProfile = await DriverProfile.create({
    userId,
    licenseNumber,
    isAvailable,
    currentLatitude,
    currentLongitude,
    driverStatus: req.user.userType === 'admin' ? driverStatus : 'pending_approval' // Only admin can set status initially
  });

  res.status(201).json(driverProfile);
});

// @desc    Get all driver profiles
// @route   GET /api/driver-profiles
// @access  Private/Admin
const getDriverProfiles = asyncHandler(async (req, res, next) => {
  const driverProfiles = await DriverProfile.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
  });
  res.status(200).json(driverProfiles);
});

// @desc    Get single driver profile by userId
// @route   GET /api/driver-profiles/:id
// @access  Private (Admin or Driver for own profile)
const getDriverProfileById = asyncHandler(async (req, res, next) => {
  const driverProfile = await DriverProfile.findByPk(req.params.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
  });

  if (driverProfile) {
    if (req.user.userType === 'admin' || req.user.id === driverProfile.userId) {
      res.status(200).json(driverProfile);
    } else {
      errorHandler(res, 403, 'Not authorized to view this driver profile');
    }
  } else {
    errorHandler(res, 404, 'Driver profile not found');
  }
});

// @desc    Update driver profile
// @route   PUT /api/driver-profiles/:id
// @access  Private (Admin or Driver for own profile)
const updateDriverProfile = asyncHandler(async (req, res, next) => {
  const driverProfile = await DriverProfile.findByPk(req.params.id);

  if (driverProfile) {
    if (req.user.userType === 'admin' || req.user.id === driverProfile.userId) {
      const { licenseNumber, averageRating, isAvailable, currentLatitude, currentLongitude, driverStatus } = req.body;

      driverProfile.licenseNumber = licenseNumber || driverProfile.licenseNumber;
      driverProfile.isAvailable = typeof isAvailable === 'boolean' ? isAvailable : driverProfile.isAvailable;
      driverProfile.currentLatitude = currentLatitude || driverProfile.currentLatitude;
      driverProfile.currentLongitude = currentLongitude || driverProfile.currentLongitude;

      // Only admin can update averageRating and driverStatus freely
      if (req.user.userType === 'admin') {
        driverProfile.averageRating = averageRating || driverProfile.averageRating;
        driverProfile.driverStatus = driverStatus || driverProfile.driverStatus;
      } else if (driverStatus && driverStatus !== driverProfile.driverStatus) {
        // Non-admin drivers can't change their own status arbitrarily
        return errorHandler(res, 403, 'Only administrators can change driver status.');
      }

      await driverProfile.save();

      res.status(200).json(driverProfile);
    } else {
      errorHandler(res, 403, 'Not authorized to update this driver profile');
    }
  } else {
    errorHandler(res, 404, 'Driver profile not found');
  }
});

// @desc    Delete driver profile
// @route   DELETE /api/driver-profiles/:id
// @access  Private/Admin
const deleteDriverProfile = asyncHandler(async (req, res, next) => {
  const driverProfile = await DriverProfile.findByPk(req.params.id);

  if (driverProfile) {
    await driverProfile.destroy();
    res.status(200).json({ message: 'Driver profile removed' });
  } else {
    errorHandler(res, 404, 'Driver profile not found');
  }
});

export { createDriverProfile, getDriverProfiles, getDriverProfileById, updateDriverProfile, deleteDriverProfile };
