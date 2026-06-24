import nodemailer from "nodemailer";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

// Nodemailer transporter — uses environment variables for SMTP config
// In production: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send a password reset email containing a tokenised link
// The link points to /reset-password?token=<token> on the frontend
export async function sendResetEmail(
  recipientEmail: string,
  resetToken: string
): Promise<void> {
  const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"No Reply" <noreply@example.com>`,
    to: recipientEmail,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link expires in 15 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
    text: `Reset your password: ${resetLink} (expires in 15 minutes)`,
  });
}
