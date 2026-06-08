import nodemailer from 'nodemailer';

// Create Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // Use STARTTLS (not SSL)
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export const sendVerificationEmail = async (email: string, verifyUrl: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"AI Battle Arena" <${process.env.BREVO_SMTP_USER}>`,
      to: email,
      subject: 'AI Battle Arena - Email Verification',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Welcome to AI Battle Arena!</h2>
          <p>Thanks for registering on AI Battle Arena. Please verify your email by clicking the link below:</p>
          <a href="${verifyUrl}" style="display:inline-block; padding: 10px 20px; background-color: #7bd0ff; color:#004c69; text-decoration:none; font-weight:bold; border-radius:8px;">
            Verify Email
          </a>
          <p style="margin-top: 16px; color: #888; font-size: 13px;">If you did not create an account, please ignore this email.</p>
        </div>
      `,
    });

    console.log('Verification email sent successfully. MessageId:', info.messageId);
    return null;
  } catch (err) {
    console.error('Error sending verification mail:', err);
  }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"AI Battle Arena" <${process.env.BREVO_SMTP_USER}>`,
      to: email,
      subject: 'AI Battle Arena - Password Reset Request',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your AI Battle Arena account. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="display:inline-block; padding: 10px 20px; background-color: #7bd0ff; color:#004c69; text-decoration:none; font-weight:bold; border-radius:8px;">
            Reset Password
          </a>
          <p style="margin-top: 16px; color: #888; font-size: 13px;">This link will expire in <strong>1 hour</strong>.</p>
          <p style="color: #888; font-size: 13px;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `,
    });

    console.log('Password reset email sent successfully. MessageId:', info.messageId);
    return null;
  } catch (err) {
    console.error('Error sending password reset mail:', err);
  }
};
