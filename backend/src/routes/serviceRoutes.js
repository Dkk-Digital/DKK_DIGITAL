import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('image'), createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', protect, adminOnly, upload.single('image'), updateService);
router.delete('/:id', protect, adminOnly, deleteService);

export default router;
