import { Router } from "express";
import { requestPasswordReset, resetPassword } from "../auth/passwordReset";
import { authMiddleware } from "../auth/middleware";

const router = Router();

// Public routes (no auth required)
// POST /auth/forgot-password  — step 1: request reset email
router.post("/forgot-password", requestPasswordReset);

// POST /auth/reset-password   — step 2: submit new password with token
router.post("/reset-password", resetPassword);

// Protected route example (requires valid JWT)
// GET /auth/me — returns the current user's profile
router.get("/me", authMiddleware, (req: any, res) => {
  res.json({ user: req.user });
});

export default router;
