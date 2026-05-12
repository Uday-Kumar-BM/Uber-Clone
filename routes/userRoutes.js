import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { isAuthenticated, hasRole } from '../middleware/auth.js';

const router = express.Router();

// Admin-only routes
router.route('/').get(isAuthenticated, hasRole(['admin']), getUsers); // Get all users
router.route('/:id').delete(isAuthenticated, hasRole(['admin']), deleteUser); // Delete user

// Admin or self-access routes
router.route('/:id').get(isAuthenticated, hasRole(['admin', 'rider', 'driver']), getUserById); // Get user by ID (admin or self)
router.route('/:id').put(isAuthenticated, hasRole(['admin', 'rider', 'driver']), updateUser); // Update user by ID (admin or self)

export default router;
