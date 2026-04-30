import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  sendMessage,
  getConversation,
  getConversations,
  deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getConversation);
router.delete('/:id', protect, deleteMessage);

export default router;
