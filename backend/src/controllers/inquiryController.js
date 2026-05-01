import Inquiry from '../models/Inquiry.js';
import { notifyNewInquiry } from '../utils/notifications.js';

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, serviceInterest } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      subject,
      message,
      serviceInterest,
    });

    // Send notifications asynchronously (don't block response)
    notifyNewInquiry(inquiry).catch((err) => {
      console.error('Failed to send notification emails:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInquiries = async (req, res) => {
  try {
    const { status, search, startDate, endDate, sortBy } = req.query;
    let filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Search filter (full-text search in name, email, subject, message)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDateObj;
      }
    }

    // Build sort object
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy) {
      switch (sortBy) {
        case 'name':
          sort = { name: 1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'recent':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const inquiries = await Inquiry.find(filter)
      .populate('respondedBy', 'name email')
      .sort(sort);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('respondedBy', 'name email');
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({
      success: true,
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status,
        respondedBy: status === 'new' ? null : req.user._id,
        respondedAt: status === 'new' ? null : Date.now(),
      },
      { new: true, runValidators: true }
    ).populate('respondedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInquiryStats = async (req, res) => {
  try {
    const total = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const contacted = await Inquiry.countDocuments({ status: 'contacted' });
    const converted = await Inquiry.countDocuments({ status: 'converted' });

    res.status(200).json({
      success: true,
      stats: {
        total,
        new: newInquiries,
        contacted,
        converted,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
