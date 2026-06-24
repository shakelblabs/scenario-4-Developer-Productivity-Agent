import { Router } from "express";
import { authMiddleware, requireRole } from "../auth/middleware";
import { Order } from "../models/order";
import type { AuthenticatedRequest } from "../auth/middleware";

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

// GET /orders — list orders for the current user (admins see all)
router.get("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.role === "admin" ? undefined : req.user!.userId;
    const orders = await Order.findAll(userId);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// POST /orders — create a new order
router.post("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const order = await Order.create({
      userId: req.user!.userId,
      ...req.body,
    });
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

// PATCH /orders/:id/status — update order status (admin only)
router.patch(
  "/:id/status",
  requireRole("admin"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const order = await Order.updateStatus(req.params.id, req.body.status);
      res.json({ order });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
