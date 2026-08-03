# Production security boundary

## Implemented frontend boundary

Browser JavaScript receives only the NextAuth identity session. Backend access
and refresh tokens remain inside the encrypted, `HttpOnly` NextAuth JWT cookie.
`getBackendAccessToken()` is server-only and is the sole credential bridge for
server actions and route handlers. It refreshes one minute before the backend
expiry, persists the rotated credentials in the response cookie, and clears the
session on an unrecoverable refresh failure. Callers receive stable
`AUTH_UNAUTHENTICATED` or `AUTH_REFRESH_REVOKED` errors, never token details.

The backend **must** return this shape from both `POST /auth/login` and
`POST /auth/refresh-token`:

```json
{ "accessToken": "…", "refreshToken": "…", "accessTokenExpiresAt": "2026-08-11T12:00:00.000Z" }
```

`accessTokenExpiresAt` may instead be epoch milliseconds. Refresh token family
rotation, short retry grace, revocation, and resource-level authorization are
backend responsibilities; that source is not in this repository.

## Realtime contract

The browser sends a same-origin request to `/api/sse-ticket`. The BFF validates
the requested channels and forwards it, with the server-only bearer token, to
`POST /realtime/tickets`. The backend response must be:

```json
{ "ticket": "opaque-or-signed-ticket", "expiresAt": "2026-08-11T12:00:00.000Z", "allowedChannels": ["queue"] }
```

The backend must bind the ticket to the authenticated user/session, role and
allowed channels; enforce expiry and single-use (or one active connection);
and validate it before opening `/api/reception/events`. Tickets and credentials
must never be logged. The client requests a new ticket for each reconnect and
uses capped exponential backoff with jitter.

## Deployment

Security headers include CSP with request nonce, HSTS in production, frame
denial, MIME sniffing prevention, strict referrer policy, and a restrictive
permissions policy. Remote Google fonts were removed from the root layout so
an optimized build does not require a third-party font download.
