# Development Workflow

Adnet development uses a stable `main` branch and a strict branch-per-module practice.

## Branch Rules

- `main` must stay deployable and coherent.
- Do not build product modules directly on `main`.
- Create one branch per module or vertical slice.
- Keep each branch scoped to one module goal.
- Merge only after review, verification, and a clear summary of behavior changed.

## Branch Naming

Use short, explicit names:

```text
module/auth-session
module/campaign-wizard
module/deal-workspace
module/evidence-review
module/payments-status
module/admin-queues
```

Use `docs/...` only for documentation-only changes.

## Recommended Module Order

1. `module/foundation-app-shell`
2. `module/auth-session`
3. `module/profiles-onboarding`
4. `module/campaign-wizard`
5. `module/marketplace-feed`
6. `module/applications-selection`
7. `module/deal-workspace`
8. `module/submission-evidence`
9. `module/review-dispute`
10. `module/payments-status`
11. `module/notifications-deeplinks`
12. `module/reports`
13. `module/admin-queues`

## Merge Checklist

- The branch changes only its intended module.
- Existing landing page behavior still works or passes static checks.
- New code has a local verification command documented in the PR or merge note.
- State-changing workflows are server-owned, not client-owned.
- Telegram Mini App remains a visual web app; bot behavior is limited to entrypoints, deep links, and notifications.
- No secrets, tokens, credentials, or local `.env` files are committed.

## Main Branch Baseline

This repository currently contains a non-functional monorepo skeleton. Product implementation starts after this baseline, on dedicated module branches.
