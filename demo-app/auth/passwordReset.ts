import { Request, Response, NextFunction } from "express";
import { generateResetToken, verifyResetToken } from "../services/tokenService";
import { sendResetEmail } from "../services/emailService";
import { User } from "../models/user";

// Step 1: User requests a password reset
// POST /auth/forgot-password  { email }
export async function requestPasswordReset(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;

    // Look up the user by email
    const user = await User.findByEmail(email);

    // Security: always return 200 even if email not found (prevents enumeration)
    if (!user) {
      res.status(200).json({ message: "If that email exists, a reset link was sent." });
      return;
    }

    // Generate a short-lived signed token (expires in 15 min — see tokenService)
    const resetToken = generateResetToken(user.id, user.email);

    // Send the reset email with a link containing the token
    await sendResetEmail(user.email, resetToken);

    res.status(200).json({ message: "If that email exists, a reset link was sent." });
  } catch (err) {
    next(err); // bubbles to errorHandler.ts
  }
}

// Step 2: User submits new password with the token from the email link
// POST /auth/reset-password  { token, newPassword }
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token, newPassword } = req.body;

    // Verify token signature and expiry (throws if invalid/expired)
    const payload = verifyResetToken(token);

    // Find user and update their hashed password
    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(400).json({ error: "Invalid reset token." });
      return;
    }

    await user.updatePassword(newPassword); // hashes with bcrypt internally

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
}
