import Message from '../models/Message.js';
import { notifyNewMessage } from '../utils/notifications.js';

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, message, attachments } = req.body;

    if (!recipientId || !message) {
      return res.status(400).json({ success: false, message: 'Please provide recipient and message' });
    }

    const conversationId = [req.user._id, recipientId].sort().join('-');

    const newMessage = await Message.create({
      conversationId,
      sender: req.user._id,
      recipient: recipientId,
      message,
      attachments: attachments || [],
    });

    await newMessage.populate([
      { path: 'sender', select: 'name email' },
      { path: 'recipient', select: 'name email' }
    ]);

    // Send notification email to recipient
    if (newMessage.recipient) {
      notifyNewMessage(newMessage, newMessage.recipient).catch((err) => {
        console.error('Failed to send message notification:', err);
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversationId = [req.user._id, userId].sort().join('-');

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversationId, recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    // Get unique conversations
    const conversations = {};
    messages.forEach((msg) => {
      const conversationId = msg.conversationId;
      if (!conversations[conversationId]) {
        const otherUser = msg.sender._id.toString() === req.user._id.toString() ? msg.recipient : msg.sender;
        conversations[conversationId] = {
          userId: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
        };
      }
    });

    res.status(200).json({
      success: true,
      conversations: Object.values(conversations),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessageStats = async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const unreadCount = await Message.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      stats: {
        total,
        unread: unreadCount,
        read: total - unreadCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
