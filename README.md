# Telegram Mini App

User-facing Adnet web application launched inside Telegram.

This module currently contains the Foundation / App Shell only. It does not implement auth, roles, backend calls, campaigns, deals, payments, or business workflows.

## Run Locally

```bash
python3 -m http.server 4190 --directory apps/mini-app
```

Open `http://localhost:4190`.

## Check

```bash
node --check apps/mini-app/src/telegram-webapp.js
node --check apps/mini-app/src/routes.js
node --check apps/mini-app/src/app-shell.js
```

## Current Scope

- Mobile-first Telegram WebView app shell.
- Safe-area aware layout.
- Telegram WebApp SDK integration boundary.
- Telegram initData forwarding boundary for server validation.
- Session restoration and normalized `/me` model.
- Role selection/confirmation for `advertiser` and `creator`.
- RBAC route guards for protected shell routes.
- Hash-based route shell and bottom navigation.
- Dark/lime Adnet design tokens.
- Presentational auth/loading/error/empty states.

## Boundary

This is a visual web application, not a chat bot interface. Telegram bot behavior belongs in `apps/telegram-gateway/`.

The frontend does not cryptographically validate Telegram `initData`. It forwards raw `initData` to the API contract; server-side validation belongs in `apps/api`.
