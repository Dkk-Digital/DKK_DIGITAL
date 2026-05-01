import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { register, login, getProfile, updateProfile, getAllUsers, updateUserRole, deleteUser, getUserStats } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users/stats/overview', protect, adminOnly, getUserStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
