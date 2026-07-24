# Project Structure

This file documents the intended monorepo layout before product implementation begins.

```text
apps/
  mini-app/           Telegram Mini App frontend
  api/                Backend API and domain state machine
  admin-web/          Private moderation and operations panel
  telegram-gateway/   Telegram launch, deep links, and notifications
packages/
  shared/             Shared types and contracts
  ui/                 Shared UI primitives
  config/             Shared tooling configuration
infra/                Deployment and environment notes
docs/                 Implementation-facing docs
landing-page/         Existing static landing page
материалы/            Business, roadmap, and technical PDFs
```

The skeleton is intentionally non-functional. Add package manifests, build tooling, and application code only when a module branch needs them.
