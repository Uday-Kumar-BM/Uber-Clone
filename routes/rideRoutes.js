import express from 'express';
import {
  createRide,
  getRides,
  getRideById,
  updateRide,
  deleteRide,
} from '../controllers/rideController.js';
import { isAuthenticated, hasRole } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(isAuthenticated, hasRole(['admin', 'rider']), createRide) // Riders (or admin) can create rides
  .get(isAuthenticated, hasRole(['admin', 'rider', 'driver']), getRides); // All authenticated users can get their rides (admin gets all)

router.route('/:id')
  .get(isAuthenticated, hasRole(['admin', 'rider', 'driver']), getRideById) // All authenticated users can get specific ride if authorized
  .put(isAuthenticated, hasRole(['admin', 'rider', 'driver']), updateRide) // Admin, Rider (cancel), Driver (update status)
  .delete(isAuthenticated, hasRole(['admin']), deleteRide); // Only Admin can delete rides

export default router;
