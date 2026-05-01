import { sendEmail } from './mailer.js';

const brandName = 'DKK Digital';
const ownerEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;

// Email Templates
const emailTemplates = {
  // Inquiry confirmation email to client
  inquiryConfirmation: (name, subject, message) => ({
    subject: `We received your inquiry - ${brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1976d2, #0ea5e9); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Thank you for contacting us!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>We received your inquiry and our team will review it shortly.</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #1976d2; margin: 20px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong><br />${message.replace(/\n/g, '<br />')}</p>
          </div>
          <p>We'll get back to you within 24 hours with a response.</p>
          <p>Regards,<br /><strong>${brandName} Team</strong></p>
        </div>
      </div>
    `,
  }),

  // Inquiry notification email to admin
  newInquiryAlert: (name, email, phone, subject, message, serviceInterest) => ({
    subject: `[NEW] Inquiry from ${name} - ${brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff9800; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Inquiry Received</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${serviceInterest ? `<p><strong>Service Interest:</strong> ${serviceInterest}</p>` : ''}
          <div style="background: white; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong><br />${message.replace(/\n/g, '<br />')}</p>
          </div>
          <p><a href="${process.env.CLIENT_URL || 'https://dkkdigital.com'}/admin/inquiries" style="display: inline-block; background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a></p>
        </div>
      </div>
    `,
  }),

  // Project status update email
  projectStatusUpdate: (clientName, projectTitle, status, notes) => ({
    subject: `Project Update: ${projectTitle} - ${brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1976d2, #0ea5e9); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Project Status Update</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <p>Hi <strong>${clientName}</strong>,</p>
          <p>Here's an update on your project:</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #1976d2; margin: 20px 0;">
            <p><strong>Project:</strong> ${projectTitle}</p>
            <p><strong>Status:</strong> <span style="background: #4caf50; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">${status}</span></p>
            ${notes ? `<p><strong>Notes:</strong><br />${notes.replace(/\n/g, '<br />')}</p>` : ''}
          </div>
          <p>If you have any questions, feel free to reach out to us.</p>
          <p>Regards,<br /><strong>${brandName} Team</strong></p>
        </div>
      </div>
    `,
  }),

  // Message received notification
  messageNotification: (recipientName, senderName, messagePreview) => ({
    subject: `New message from ${senderName} - ${brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1976d2, #0ea5e9); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">You have a new message</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <p>Hi <strong>${recipientName}</strong>,</p>
          <p><strong>${senderName}</strong> sent you a message:</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #1976d2; margin: 20px 0;">
            <p><em>${messagePreview}</em></p>
          </div>
          <p><a href="${process.env.CLIENT_URL || 'https://dkkdigital.com'}/messages" style="display: inline-block; background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Message</a></p>
        </div>
      </div>
    `,
  }),

  // Weekly summary email
  weeklySummary: (adminName, stats) => ({
    subject: `Weekly Summary - ${brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1976d2, #0ea5e9); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Weekly Summary</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <p>Hi <strong>${adminName}</strong>,</p>
          <p>Here's your weekly summary:</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>New Inquiries:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #1976d2;">${stats.newInquiries || 0}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Converted:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #4caf50;">${stats.converted || 0}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Active Projects:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #2196f3;">${stats.activeProjects || 0}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Total Revenue:</strong></td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #ff9800;">$${stats.revenue || 0}</td>
              </tr>
            </table>
          </div>
          <p>Keep up the great work!</p>
          <p>Regards,<br /><strong>${brandName} Team</strong></p>
        </div>
      </div>
    `,
  }),
};

// Send email helper with error handling
export const sendNotificationEmail = async (type, recipientEmail, data) => {
  try {
    const template = emailTemplates[type];
    if (!template) {
      console.error(`Email template not found: ${type}`);
      return false;
    }

    const emailConfig = template(...Object.values(data));
    await sendEmail({
      to: recipientEmail,
      subject: emailConfig.subject,
      html: emailConfig.html,
      text: emailConfig.subject, // Fallback text
    });

    console.log(`Email sent: ${type} to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email (${type}):`, error);
    return false;
  }
};

// Specific notification functions
export const notifyNewInquiry = async (inquiry) => {
  const { name, email, phone, subject, message, serviceInterest } = inquiry;

  // Send to client
  await sendNotificationEmail('inquiryConfirmation', email, {
    name,
    subject,
    message,
  });

  // Send to admin
  await sendNotificationEmail('newInquiryAlert', ownerEmail, {
    name,
    email,
    phone,
    subject,
    message,
    serviceInterest,
  });
};

export const notifyProjectStatus = async (project, client) => {
  if (client && client.email) {
    await sendNotificationEmail('projectStatusUpdate', client.email, {
      clientName: client.name,
      projectTitle: project.title,
      status: project.status,
      notes: project.notes,
    });
  }
};

export const notifyNewMessage = async (message, recipient) => {
  if (recipient && recipient.email) {
    const messagePreview = message.message.substring(0, 150);
    await sendNotificationEmail('messageNotification', recipient.email, {
      recipientName: recipient.name,
      senderName: message.sender?.name || 'Someone',
      messagePreview,
    });
  }
};

export const sendWeeklySummary = async (adminName, stats) => {
  await sendNotificationEmail('weeklySummary', ownerEmail, {
    adminName,
    ...stats,
  });
};

export default {
  sendNotificationEmail,
  notifyNewInquiry,
  notifyProjectStatus,
  notifyNewMessage,
  sendWeeklySummary,
};
