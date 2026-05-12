import express from 'express';
import {
  createDriverProfile,
  getDriverProfiles,
  getDriverProfileById,
  updateDriverProfile,
  deleteDriverProfile,
} from '../controllers/driverProfileController.js';
import { isAuthenticated, hasRole } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(isAuthenticated, hasRole(['admin', 'driver']), createDriverProfile) // Admin or Driver can create their profile
  .get(isAuthenticated, hasRole(['admin']), getDriverProfiles); // Only Admin can view all driver profiles

router.route('/:id')
  .get(isAuthenticated, hasRole(['admin', 'driver']), getDriverProfileById) // Admin or Driver (for self) can view
  .put(isAuthenticated, hasRole(['admin', 'driver']), updateDriverProfile) // Admin or Driver (for self) can update
  .delete(isAuthenticated, hasRole(['admin']), deleteDriverProfile); // Only Admin can delete

export default router;
