# Production Readiness Audit

Audit date: 2026-08-11

## Architecture observed

- Next.js 16 App Router frontend with feature-local UI, hooks, actions, and
  API clients for doctor, receptionist, admin, settings, auth, and
  notifications.
- Server actions and route handlers use `serverFetch`, which gets the
  NextAuth session and forwards its access token to the existing backend API.
- NextAuth credentials authentication stores access and refresh tokens in its
  encrypted JWT cookie. The current session callback also serializes the
  access token into `/api/auth/session` for the existing server-action bridge.
- Role layouts and `proxy.ts` provide navigation-level access control. The
  backend API remains the authorization authority for individual patients,
  studies, reports, and administrative mutations.
- Staff layouts mount one SSE bridge. The bridge obtains a ticket from a
  same-origin route and subscribes to the backend event stream, invalidating
  React Query caches by channel.
- Zod is used for major UI forms, and React Query owns asynchronous UI state
  and invalidation. Critical mutations generally route through server actions.

## Findings and priority

### P0 — SSE ticket verification is not established

`/api/sse-ticket` returns a locally generated random ticket but does not store
or sign it. This frontend cannot prove that the external event backend checks
ticket expiry, user identity, role, or channel scope. This must be resolved in
the realtime backend contract: mint tickets there from the authenticated
server request (or validate a signed, short-lived ticket there), bind them to
the user and permitted channels, and reject reuse and expired tickets.

### P0 — Backend access token is serialized to the browser session

The token is needed today by the server-action bridge, but the NextAuth
session callback also makes it readable by browser JavaScript. A complete fix
requires an atomic BFF migration: server-side token extraction and refresh
persistence, then removal of `Session.accessToken`. Removing it in isolation
breaks protected server actions after a refresh, so this has intentionally not
been partially deployed.

### P1 — Refresh deduplication is process-local

`auth.ts` documents that its refresh promise/cache maps only coordinate one
Node instance. Horizontal deployments need backend refresh-token rotation that
is idempotent for a short grace interval, or a deliberately selected shared
coordination store. Do not add one until the deployment topology requires it.

### P1 — Route-level authorization must not be mistaken for data authorization

Role layouts and the proxy are useful UX controls, but backend authorization
must continue to check patient/study ownership and operation permissions.
There is no frontend-only mechanism that can secure medical records.

### P2 — Error contract should be made structured end-to-end

The shared `ApiError` provides status and a safe message, but backend responses
do not yet expose a documented typed envelope with code, request ID,
field-level errors, and retryability. Introduce that contract at the backend
boundary, then map it once in `serverFetch`.

### P2 — Test coverage is focused but incomplete

Existing unit tests cover appointment date normalization, audit actor display,
scheduling utilities, and session-profile update behavior. Add backend-backed
or contract tests for auth refresh/logout/revocation, AI state transitions,
report signing, booking conflicts, and realtime ticket expiry/authorization.

## Changes implemented in this phase

- Removed the terms-acceptance modal's direct bearer-token call. It now uses
  the existing same-origin authenticated route handler.
- Hardened SSE client lifecycle behavior with response validation, exponential
  backoff, jitter, bounded delay, reconnect cleanup, and authenticated-session
  gating. This improves reliability but cannot replace backend ticket
  verification.
- Hardened the study-image upload BFF route: explicit authentication and
  Doctor role guard, malformed multipart handling, safe upstream errors, and
  no backend error-body disclosure.

## Next safe implementation slice

Before the BFF token migration, confirm the backend's refresh-token and SSE
ticket contracts. With those contracts available, migrate server actions to a
server-only credential bridge, remove token serialization from the browser
session, and add contract tests for the complete authentication and realtime
lifecycles.
