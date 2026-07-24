# Adnet Project

Complete working folder for Adnet: a Telegram-first advertising and UGC marketplace.

## Structure

- `apps/mini-app/` - future Telegram Mini App frontend.
- `apps/api/` - future backend API and domain rules.
- `apps/admin-web/` - future private admin web panel.
- `apps/telegram-gateway/` - future Telegram service for deep links, auth handoff, and notifications.
- `packages/` - future shared code, UI primitives, configuration, and domain contracts.
- `infra/` - future deployment and environment notes.
- `docs/` - development workflow and product planning notes.
- `landing-page/` - published static landing page source.
- `landing-page/assets/` - landing assets, including the Adnet mark.
- `материалы/` - business plans, process documents, technical briefs, roadmap PDFs, and visual references.

## Landing Preview

```bash
python3 -m http.server 4173 --directory landing-page
```

Open `http://localhost:4173` in a browser.

## Notes

The project is intended as a full visual Telegram Mini App, not a chatbot interface. The landing page is a standalone static preview; product development materials are kept in `материалы/`.

Development starts from a stable `main` branch. Each product module should be built in its own branch and merged only after review and verification.
