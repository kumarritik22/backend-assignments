const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'AI Battle Arena',
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data;
};

export const sendVerificationEmail = async (email: string, verifyUrl: string) => {
  try {
    const data = await sendEmail(
      email,
      'AI Battle Arena - Email Verification',
      `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Welcome to AI Battle Arena!</h2>
          <p>Thanks for registering. Please verify your email by clicking the link below:</p>
          <a href="${verifyUrl}" style="display:inline-block; padding: 10px 20px; background-color: #7bd0ff; color:#004c69; text-decoration:none; font-weight:bold; border-radius:8px;">
            Verify Email
          </a>
          <p style="margin-top: 16px; color: #888; font-size: 13px;">If you did not create an account, please ignore this email.</p>
        </div>
      `
    );
    console.log('Verification email sent successfully. MessageId:', data.messageId);
    return null;
  } catch (err) {
    console.error('Error sending verification mail:', err);
  }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  try {
    const data = await sendEmail(
      email,
      'AI Battle Arena - Password Reset Request',
      `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your AI Battle Arena account. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="display:inline-block; padding: 10px 20px; background-color: #7bd0ff; color:#004c69; text-decoration:none; font-weight:bold; border-radius:8px;">
            Reset Password
          </a>
          <p style="margin-top: 16px; color: #888; font-size: 13px;">This link will expire in <strong>1 hour</strong>.</p>
          <p style="color: #888; font-size: 13px;">If you did not request a password reset, please ignore this email.</p>
        </div>
      `
    );
    console.log('Password reset email sent successfully. MessageId:', data.messageId);
    return null;
  } catch (err) {
    console.error('Error sending password reset mail:', err);
  }
};
