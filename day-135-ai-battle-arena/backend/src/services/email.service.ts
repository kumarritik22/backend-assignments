import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const createTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.APP_PASSWORD,
      },
    });
    console.log("Configured real Gmail SMTP for sending emails.");
  }
  return transporter;
};

export const sendVerificationEmail = async (email: string, verifyUrl: string) => {
  try {
    const t = createTransporter();
    
    const info = await t.sendMail({
      from: `"AI Battle Arena" <${process.env.GOOGLE_USER}>`,
      to: email,
      subject: "AI Battle Arena - Email Verification",
      text: `Thanks for registering on AI Battle Arena, please verify your email by clicking on link below: \n${verifyUrl}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Welcome to AI Battle Arena!</h2>
          <p>Thanks for registering on AI Battle Arena, please verify your email by clicking on link below:</p>
          <a href="${verifyUrl}" style="display:inline-block; padding: 10px 20px; background-color: #7bd0ff; color:#004c69; text-decoration:none; font-weight:bold; border-radius:8px;">
            Verify Email
          </a>
        </div>
      `,
    });

    console.log("Verification email sent: %s", info.messageId);
    return null; // No longer need to return preview URL
  } catch (err) {
    console.error("Error sending mail:", err);
  }
};
