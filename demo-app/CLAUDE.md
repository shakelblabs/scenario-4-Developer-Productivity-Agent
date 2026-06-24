# demo-app — Scoped CLAUDE.md

> This file applies ONLY inside the `demo-app/` directory.
> It inherits all rules from the root CLAUDE.md and adds demo-app-specific context.

## Codebase Overview
This is a Node.js/Express + TypeScript REST API for an e-commerce platform.

### Directory Map
```
demo-app/
├── auth/
│   ├── middleware.ts        # JWT verification, request authentication
│   └── passwordReset.ts    # Password reset flow: request → token → verify → update
├── models/
│   ├── order.ts            # Order data model: status, items, totals, userId FK
│   └── user.ts             # User data model: credentials, profile, roles
├── routes/
│   ├── auth.ts             # POST /auth/forgot-password, POST /auth/reset-password
│   └── orders.ts           # GET /orders, POST /orders, PATCH /orders/:id/status
├── services/
│   ├── emailService.ts     # Sends reset emails via nodemailer
│   └── tokenService.ts     # Generates/validates signed reset tokens (JWT)
└── middleware/
    └── errorHandler.ts     # Global error handler
```

## Key Patterns in This Codebase
- Auth uses JWT (jsonwebtoken) for both session tokens and password-reset tokens
- Reset tokens expire in 15 minutes (TOKEN_EXPIRY constant in tokenService.ts)
- Orders use a status state machine: pending → confirmed → shipped → delivered
- All routes go through `authMiddleware` before reaching controllers
- Errors bubble up to `errorHandler.ts` via `next(err)` pattern

## Exploration Starting Points
- Password reset: start with `routes/auth.ts` → `auth/passwordReset.ts` → `services/tokenService.ts` → `services/emailService.ts`
- Order data model: start with `models/order.ts` → `routes/orders.ts`
- Auth middleware: start with `auth/middleware.ts`
