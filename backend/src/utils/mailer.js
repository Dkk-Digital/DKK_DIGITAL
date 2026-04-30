import nodemailer from 'nodemailer';

let cachedTransporter = null;

const createTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return cachedTransporter;
};

export const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  const transporter = createTransporter();

  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
    replyTo,
  });
};
