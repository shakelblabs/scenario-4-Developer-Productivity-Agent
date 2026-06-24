import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

// Global error handler — catches all errors passed via next(err)
// Must be registered LAST in the Express app (after all routes)
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error." : err.message;

  // Log the full error in development, sanitise in production
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  }

  res.status(statusCode).json({ error: message });
}
