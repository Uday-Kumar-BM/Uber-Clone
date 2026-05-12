import Ride from '../models/Ride.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private (Rider)
const createRide = asyncHandler(async (req, res, next) => {
  const { riderId, driverId, vehicleId, originLat, originLong, destinationLat, destinationLong, pickupAddress, dropoffAddress, startTime } = req.body;

  // Ensure the riderId matches the authenticated user's ID
  if (req.user.userType !== 'admin' && req.user.id !== riderId) {
    return errorHandler(res, 403, 'Not authorized to create a ride for another user.');
  }

  // Basic validation
  if (!riderId || !driverId || !vehicleId || !originLat || !originLong || !destinationLat || !destinationLong || !pickupAddress || !dropoffAddress || !startTime) {
    return errorHandler(res, 400, 'Please provide all required ride details.');
  }

  // Check if rider, driver, and vehicle exist
  const rider = await User.findByPk(riderId);
  const driver = await User.findByPk(driverId);
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!rider || !driver || !vehicle) {
    return errorHandler(res, 404, 'Rider, driver or vehicle not found.');
  }

  // More specific validation (e.g., driver must have userType 'driver', vehicle must belong to driver, etc.)
  if (rider.userType !== 'rider') {
    return errorHandler(res, 400, 'Only users with userType \'rider\' can initiate a ride.');
  }
  if (driver.userType !== 'driver') {
    return errorHandler(res, 400, 'Selected driver is not a registered driver.');
  }
  if (vehicle.driverId !== driverId) {
    return errorHandler(res, 400, 'Selected vehicle does not belong to the selected driver.');
  }

  const ride = await Ride.create({
    riderId,
    driverId,
    vehicleId,
    originLat,
    originLong,
    destinationLat,
    destinationLong,
    pickupAddress,
    dropoffAddress,
    startTime,
    // Other fields like fareAmount, distanceKm, durationMinutes would typically be calculated by another service
    status: 'pending',
    paymentStatus: 'pending'
  });

  res.status(201).json(ride);
});

// @desc    Get all rides
// @route   GET /api/rides
// @access  Private (Admin, or Rider/Driver for their own rides)
const getRides = asyncHandler(async (req, res, next) => {
  let whereClause = {};

  // Non-admin users can only see their own rides
  if (req.user.userType === 'rider') {
    whereClause.riderId = req.user.id;
  } else if (req.user.userType === 'driver') {
    whereClause.driverId = req.user.id;
  }
  // Admins can see all rides (whereClause remains empty)

  const rides = await Ride.findAll({
    where: whereClause,
    include: [
      { model: User, as: 'rider', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: User, as: 'driver', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Vehicle, as: 'vehicle', attributes: ['id', 'make', 'model', 'licensePlate'] },
    ],
  });

  res.status(200).json(rides);
});

// @desc    Get single ride by ID
// @route   GET /api/rides/:id
// @access  Private (Admin, or Rider/Driver for their own rides)
const getRideById = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findByPk(req.params.id, {
    include: [
      { model: User, as: 'rider', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: User, as: 'driver', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Vehicle, as: 'vehicle', attributes: ['id', 'make', 'model', 'licensePlate'] },
    ],
  });

  if (ride) {
    // Ensure user is authorized to view this ride
    if (req.user.userType === 'admin' || req.user.id === ride.riderId || req.user.id === ride.driverId) {
      res.status(200).json(ride);
    } else {
      errorHandler(res, 403, 'Not authorized to view this ride.');
    }
  } else {
    errorHandler(res, 404, 'Ride not found.');
  }
});

// @desc    Update ride details
// @route   PUT /api/rides/:id
// @access  Private (Admin, or Rider/Driver for limited updates)
const updateRide = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findByPk(req.params.id);

  if (ride) {
    // Admin can update anything. Rider can cancel. Driver can update status (en_route, arrived, started, completed).
    if (req.user.userType === 'admin' || req.user.id === ride.riderId || req.user.id === ride.driverId) {
      const { endTime, fareAmount, currency, distanceKm, durationMinutes, status, surgeMultiplierApplied, paymentStatus } = req.body;

      // Admins can update any field
      if (req.user.userType === 'admin') {
        ride.endTime = endTime || ride.endTime;
        ride.fareAmount = fareAmount || ride.fareAmount;
        ride.currency = currency || ride.currency;
        ride.distanceKm = distanceKm || ride.distanceKm;
        ride.durationMinutes = durationMinutes || ride.durationMinutes;
        ride.status = status || ride.status;
        ride.surgeMultiplierApplied = surgeMultiplierApplied || ride.surgeMultiplierApplied;
        ride.paymentStatus = paymentStatus || ride.paymentStatus;
      } else if (req.user.id === ride.riderId) {
        // Rider can only cancel
        if (status === 'cancelled') {
          ride.status = status;
        } else {
          return errorHandler(res, 403, 'Riders can only cancel a ride.');
        }
      } else if (req.user.id === ride.driverId) {
        // Driver can update specific statuses
        const allowedDriverStatuses = ['accepted', 'en_route', 'arrived', 'started', 'completed'];
        if (status && allowedDriverStatuses.includes(status)) {
          ride.status = status;
        } else if (status) {
          return errorHandler(res, 403, `Drivers can only update status to: ${allowedDriverStatuses.join(', ')}.`);
        }
      }
      
      await ride.save();
      res.status(200).json(ride);

    } else {
      errorHandler(res, 403, 'Not authorized to update this ride.');
    }
  } else {
    errorHandler(res, 404, 'Ride not found.');
  }
});

// @desc    Delete a ride
// @route   DELETE /api/rides/:id
// @access  Private/Admin
const deleteRide = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findByPk(req.params.id);

  if (ride) {
    await ride.destroy();
    res.status(200).json({ message: 'Ride removed' });
  } else {
    errorHandler(res, 404, 'Ride not found.');
  }
});

export { createRide, getRides, getRideById, updateRide, deleteRide };
