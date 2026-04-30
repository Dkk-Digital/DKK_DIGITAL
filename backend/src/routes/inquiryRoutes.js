import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats,
} from '../controllers/inquiryController.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/stats/overview', protect, adminOnly, getInquiryStats);
router.get('/', protect, adminOnly, getAllInquiries);
router.get('/:id', protect, adminOnly, getInquiryById);
router.put('/:id', protect, adminOnly, updateInquiryStatus);
router.delete('/:id', protect, adminOnly, deleteInquiry);

export default router;
