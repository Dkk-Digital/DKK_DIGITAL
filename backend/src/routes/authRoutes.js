import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requirePermission, requireCanManageUser } from '../middleware/permissions.js';
import { register, login, socialLogin, getProfile, updateProfile, getAllUsers, updateUserRole, deleteUser, getUserStats, getUserActivity, getUserActivityStats } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/social-login', authLimiter, socialLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users/stats/overview', protect, adminOnly, getUserStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, requireCanManageUser(), updateUserRole);
router.delete('/users/:id', protect, adminOnly, requireCanManageUser(), deleteUser);

// Activity logs
router.get('/users/:id/activity', protect, adminOnly, getUserActivity);
router.get('/users/:id/activity/stats', protect, adminOnly, getUserActivityStats);

export default router;
