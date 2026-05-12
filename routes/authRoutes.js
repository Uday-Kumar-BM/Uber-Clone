import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
} from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
router.get('/verify-email', verifyEmail);

export default router;
