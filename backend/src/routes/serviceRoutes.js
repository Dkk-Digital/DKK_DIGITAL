import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { generalLimiter, createLimiter } from '../middleware/rateLimiter.js';
import { validateCreateService, preventXSS } from '../middleware/validation.js';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServiceStats,
} from '../controllers/serviceController.js';

const router = express.Router();

router.post('/', protect, adminOnly, createLimiter, upload.single('image'), preventXSS, validateCreateService, createService);
router.get('/stats/overview', protect, adminOnly, getServiceStats);
router.get('/', generalLimiter, getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', protect, adminOnly, upload.single('image'), preventXSS, validateCreateService, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

export default router;
