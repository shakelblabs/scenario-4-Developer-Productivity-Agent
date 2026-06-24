import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: "customer" | "admin";
  };
}

// Middleware: verifies the Bearer JWT on every protected route
// Attach decoded payload to req.user so downstream handlers can use it
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or malformed Authorization header." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: "customer" | "admin";
    };

    req.user = payload; // attach to request for downstream use
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired. Please log in again." });
    } else {
      res.status(401).json({ error: "Invalid token." });
    }
  }
}

// Middleware factory: restrict route to specific roles
// Usage: router.get('/admin', authMiddleware, requireRole('admin'), handler)
export function requireRole(...roles: Array<"customer" | "admin">) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions." });
      return;
    }
    next();
  };
}
