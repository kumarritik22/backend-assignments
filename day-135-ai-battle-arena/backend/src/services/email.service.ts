import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const createTransporter = async () => {
  if (!transporter) {
    // Generate a test Ethereal account if real credentials aren't provided
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Configured Ethereal Email test account for sending verification emails.");
  }
  return transporter;
};

export const sendVerificationEmail = async (email: string, verifyUrl: string) => {
  try {
    const t = await createTransporter();
    
    const info = await t.sendMail({
      from: '"AI Battle Arena" <noreply@arena.ai>',
      to: email,
      subject: "Welcome Commander - Initialize Your Details",
      text: `Hello,\n\nPlease verify your account by visiting the following link: \n${verifyUrl}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #00668b;">Initialization Required</h2>
          <p>Commander, please verify your access code and email stream address by clicking below:</p>
          <a href="${verifyUrl}" style="display:inline-block; padding: 10px 20px; background-color: #7bd0ff; color:#004c69; text-decoration:none; font-weight:bold; border-radius:8px;">
            Verify Account
          </a>
        </div>
      `,
    });

    console.log("Verification email sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return nodemailer.getTestMessageUrl(info);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
};
