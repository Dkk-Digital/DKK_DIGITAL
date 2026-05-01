import express from 'express';
import { protect } from '../middleware/auth.js';
import { generalLimiter, createLimiter } from '../middleware/rateLimiter.js';
import { validateMessage, preventXSS } from '../middleware/validation.js';
import {
  sendMessage,
  getConversation,
  getConversations,
  deleteMessage,
  getMessageStats,
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', protect, createLimiter, preventXSS, validateMessage, sendMessage);
router.get('/stats/overview', protect, getMessageStats);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getConversation);
router.delete('/:id', protect, deleteMessage);

export default router;
