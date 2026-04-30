import Inquiry from '../models/Inquiry.js';
import { sendEmail } from '../utils/mailer.js';

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

    const ownerEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
    const brandName = 'DKK Digital';

    const clientEmailSubject = `We received your message - ${brandName}`;
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2 style="color: #1976d2;">Thanks for contacting ${brandName}</h2>
        <p>Hi ${name},</p>
        <p>We received your message and our team will get back to you soon.</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br />${message.replace(/\n/g, '<br />')}</p>
        ${serviceInterest ? `<p><strong>Service Interest:</strong> ${serviceInterest}</p>` : ''}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p>Regards,<br />${brandName} Team</p>
      </div>
    `;

    const ownerEmailSubject = `New contact inquiry from ${name}`;
    const ownerEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2 style="color: #1976d2;">New contact inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${serviceInterest ? `<p><strong>Service Interest:</strong> ${serviceInterest}</p>` : ''}
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br />${message.replace(/\n/g, '<br />')}</p>
      </div>
    `;

    await Promise.all([
      sendEmail({
        to: email,
        subject: clientEmailSubject,
        html: clientEmailHtml,
        text: `Thanks for contacting ${brandName}. We received your message about "${subject}" and will get back to you soon.`,
      }),
      sendEmail({
        to: ownerEmail,
        subject: ownerEmailSubject,
        html: ownerEmailHtml,
        text: `New inquiry from ${name} (${email}) about "${subject}".`,
        replyTo: email,
      }),
    ]);

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
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const inquiries = await Inquiry.find(filter)
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 });

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
