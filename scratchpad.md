# Agent Scratchpad — Persistent Findings

> This file is the agent's external memory. Read this at the START of every session.
> Append new findings here after every exploration. Never delete entries.
> Format: `## [Topic] — [Date]` followed by bullet points (max 5 per entry).

---

<!-- Agent appends findings below this line during sessions -->

## Auth Middleware — 2026-06-24
- `authMiddleware` verifies Bearer JWT against `JWT_SECRET`, attaches `{ userId, email, role }` to `req.user`; returns 401 for missing/expired/invalid tokens; never throws
- `requireRole(...roles)` factory checks `req.user.role`; returns 403 on mismatch — used only for admin-gated routes
- `routes/orders.ts` applies `authMiddleware` at router level (all order routes require auth); `routes/auth.ts` applies it only to `GET /auth/me`
- Two-token design: session JWT (`JWT_SECRET`) vs reset JWT (`RESET_TOKEN_SECRET` + `purpose` claim) — separate secrets prevent cross-use
- **Gap:** both secrets fall back to hardcoded dev strings if env vars missing; `req.user` is typed optional so route handlers must non-null assert

## Order Data Model — 2026-06-24
- `OrderRecord`: id, userId (FK→User), status, items[], subtotal/taxAmount/shippingAmount/total (all cents), shippingAddress, timestamps
- State machine: `pending → confirmed → shipped → delivered`; any non-delivered state can go to `cancelled`; enforced in `Order.updateStatus()` via `ALLOWED_TRANSITIONS` map
- Tax hardcoded at 8% (`models/order.ts:83`); shipping amount is caller-supplied
- `GET /orders`: customers see own, admins see all; `PATCH /orders/:id/status` is admin-only
- **Gap:** `unitPrice` in `POST /orders` is client-supplied and not validated against a product catalogue — price tampering possible

## Password Reset Flow — 2026-06-24
- Two-step: `POST /auth/forgot-password` (generates token) → `POST /auth/reset-password` (verifies token, updates password)
- JWT reset token: signed with `RESET_TOKEN_SECRET`, scoped with `purpose: "password-reset"`, expires in 15 min (`tokenService.ts`)
- Enum-safe: always returns `200` on forgot-password regardless of whether email exists (`passwordReset.ts:19`)
- Password hashed with bcrypt 12 rounds on update (`models/user.ts:53`)
- **Gap:** no token invalidation after use — token stays valid until 15-min expiry (replay possible)
