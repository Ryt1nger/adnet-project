# Auth, Session, Roles Contract

This document defines the frontend/API boundary for the Telegram Mini App auth module.

## Security Boundary

The Mini App frontend must never trust Telegram identity by itself. The frontend only forwards raw Telegram `initData` to the API. The API validates the signature with the bot token, creates or restores the server session, and returns a normalized `/me` model.

## Endpoints

### `POST /auth/telegram`

Request:

```json
{
  "initData": "raw Telegram WebApp initData string",
  "startParam": "optional deep-link parameter"
}
```

Response:

```json
{
  "sessionToken": "opaque session token",
  "me": {
    "id": "user-id",
    "telegramUser": {
      "id": "telegram-user-id",
      "firstName": "Adnet",
      "username": "adnet_user"
    },
    "roles": [],
    "activeRole": null,
    "sessionStatus": "active"
  }
}
```

### `GET /me`

Uses the current session token and returns the normalized `me` model.

### `POST /me/role`

Request:

```json
{
  "role": "advertiser"
}
```

Allowed roles for this module: `advertiser`, `creator`.

### `POST /auth/logout`

Invalidates the current session.

## Current Implementation

The branch uses a mock adapter so the shell can be tested without a backend. The mock adapter exists only behind the same contract shape and must be replaced by the API adapter when `apps/api` starts.

`apps/mini-app/src/auth/http-auth-adapter.js` documents the expected HTTP behavior in executable form, but the current runtime still uses the mock adapter to avoid introducing backend functionality in this module.
