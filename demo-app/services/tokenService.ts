import jwt from "jsonwebtoken";

const RESET_SECRET = process.env.RESET_TOKEN_SECRET || "reset-secret-change-in-production";
const TOKEN_EXPIRY = "15m"; // reset tokens expire in 15 minutes

export interface ResetTokenPayload {
  userId: string;
  email: string;
  purpose: "password-reset"; // scopes this token — can't be used as a session token
}

// Generate a signed JWT for password reset
// The token is single-purpose (purpose: "password-reset") so it can't be
// misused as a session token even if it shares the same JWT library
export function generateResetToken(userId: string, email: string): string {
  const payload: ResetTokenPayload = {
    userId,
    email,
    purpose: "password-reset",
  };

  return jwt.sign(payload, RESET_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Verify a reset token — throws if expired, tampered, or wrong purpose
export function verifyResetToken(token: string): ResetTokenPayload {
  const decoded = jwt.verify(token, RESET_SECRET) as ResetTokenPayload;

  if (decoded.purpose !== "password-reset") {
    throw new Error("Token purpose mismatch — not a password reset token.");
  }

  return decoded;
}
