# Medivance — Clinic & Radiology Operations Platform (Frontend)

> A multi-role clinical workflow application for a radiology clinic — built with **Next.js 16 (App Router)**, **TypeScript**, and a **feature-based architecture**, talking to a separate Node.js/Express/MySQL backend over a REST API.

This README is written to be read top-to-bottom by someone who has never seen the codebase — a recruiter, an interviewer, or a new engineer — and is kept in sync with what the code actually does today, not with an earlier product pitch.

---

## Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [Who Uses It — The Three Roles](#2-who-uses-it--the-three-roles)
3. [Tech Stack](#3-tech-stack)
4. [High-Level Architecture](#4-high-level-architecture)
5. [Authentication & Session Model (BFF Deep Dive)](#5-authentication--session-model-bff-deep-dive)
6. [Route Protection & Middleware](#6-route-protection--middleware)
7. [Feature-Based Folder Architecture](#7-feature-based-folder-architecture)
8. [Medical Image Viewer](#8-medical-image-viewer)
9. [Real-Time Updates (SSE)](#9-real-time-updates-sse)
10. [Notifications](#10-notifications)
11. [Security Hardening](#11-security-hardening)
12. [Data Fetching & State Management](#12-data-fetching--state-management)
13. [Forms & Validation](#13-forms--validation)
14. [UI System & Design](#14-ui-system--design)
15. [Full Feature Tour by Role](#15-full-feature-tour-by-role)
16. [Testing](#16-testing)
17. [Project Structure Reference](#17-project-structure-reference)
18. [Environment Variables & Running Locally](#18-environment-variables--running-locally)
19. [Known Gaps & Things Worth Knowing Before You Dig In](#19-known-gaps--things-worth-knowing-before-you-dig-in)
20. [What's Deliberately Not in This Repo](#20-whats-deliberately-not-in-this-repo)
21. [Talking Points — Why This Project Is a Good Signal](#21-talking-points--why-this-project-is-a-good-signal)

---

## 1. What This Project Is

**Medivance** (the product went through a full rebrand from an earlier working name, "Echo Vision" — see [§19](#19-known-gaps--things-worth-knowing-before-you-dig-in)) is a web application that digitizes the day-to-day operations of a radiology clinic: patient intake, appointment scheduling, medical imaging review, doctor reporting, and clinic administration — three distinct portals sharing one codebase, plus a public marketing landing page.

This repository is the **frontend only**. It's a Next.js application that renders the UI, manages auth/session state, and talks to a separate backend REST API (Node.js/Express + MySQL) for all persistent data. There is no database, ORM, or server business logic in this repo — it's a presentation + client-orchestration layer, with a thin server-side layer (Route Handlers / Server Actions) used only where the browser can't safely talk to the backend directly (auth, secure image uploads, realtime tickets).

## 2. Who Uses It — The Three Roles

| Role | Can do | Route root |
|---|---|---|
| **Admin** | Manage user accounts (create/deactivate), review inactive accounts, view audit logs, monitor active sessions and security events, view clinic-wide analytics, manage notifications | `/admin/*` |
| **Doctor** | View patient list & schedule, open a patient's study images, write and finalize reports, compare past visits, manage a personal watchlist and follow-ups | `/doctor/*` |
| **Receptionist** | Register/search patients, book & manage appointments, track a live arrival board / priority queue, check doctor availability, message doctors, view historical clinic data | `/receptionist/*` |

Each role is a **hard boundary**: a logged-in Doctor cannot navigate into `/admin/*` even by typing the URL — this is enforced centrally in middleware (see §6), not just hidden in the UI.

## 3. Tech Stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Server Components, Server Actions, Route Handlers) |
| Language | **TypeScript**, strict mode |
| Auth | **NextAuth v4** — Credentials provider, JWT session strategy, with a server-only credential bridge (see §5) |
| Server data fetching | **TanStack React Query v5** (client) + a thin per-feature `api/` layer of server-side fetch wrappers |
| Forms | **react-hook-form** + **Zod** (`@hookform/resolvers`) |
| UI primitives | **Radix UI** (via the `radix-ui` package), wrapped as a **shadcn/ui**-style component library in `src/components/ui` |
| Styling | **Tailwind CSS v4**, `class-variance-authority`, `clsx` + `tailwind-merge` |
| Animation | **Framer Motion / `motion/react`** |
| Medical imaging | `dicom-parser`, `jpeg-js`, `jpeg-lossless-decoder-js` — hand-rolled canvas rendering for DICOM and JPEG-lossless radiology images in-browser (see §8 for a note on unused imaging libraries still in `package.json`) |
| Toasts / theming | `sonner`, `next-themes` (dark mode default) |
| Testing | **Playwright** (E2E) + Node's built-in test runner with `tsx` (unit tests) |
| Tooling | ESLint 9 (flat config), pnpm workspaces |

## 4. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                           │
│   React Client Components ── TanStack Query cache        │
│   (holds an identity-only NextAuth session — no tokens)  │
└───────────────┬───────────────────────────┬──────────────┘
                │ Server Actions /            │ same-origin
                │ Route Handlers              │ Route Handlers
                ▼                             ▼
┌─────────────────────────────┐   ┌─────────────────────────┐
│   Next.js Server (this repo) │   │  Backend REST API        │
│  - NextAuth (identity JWT)   │──▶│  Node.js / Express        │
│  - backend-credentials.ts    │   │  MySQL                    │
│    (server-only token bridge)│   │  (separate repository)    │
│  - proxy.ts (route guard,    │   └─────────────────────────┘
│    CSP nonce, session expiry)│
└───────────────────────────────┘
```

The frontend never talks to MySQL or holds business logic that belongs to the backend. What lives here is: routing, auth session handling, request orchestration (React Query + server actions), form validation (Zod, mirrored from backend rules for good UX), and all UI rendering.

## 5. Authentication & Session Model (BFF Deep Dive)

This is the most involved part of the codebase, and it recently went through a deliberate security-hardening rewrite — worth understanding both the *current* design and *why* it changed.

- **Login** — the `Credentials` provider in `src/auth.ts` posts `email`/`password` to the backend's `/auth/login`. The backend returns an access token, a refresh token, and the user's role/status/terms-acceptance flag.
- **Identity-only session** — the NextAuth `session` callback deliberately does **not** serialize the backend access or refresh token into the session object. The comment in the code is explicit about this: *"Deliberately identity-only: no backend bearer credential is serialized."* The browser only ever sees who the user is (id, name, role, account status) — never a credential it could read or leak via client-side JavaScript.
- **Server-only credential bridge** — the actual backend tokens live only inside the NextAuth JWT, which is encrypted and stored in an `HttpOnly` cookie. `src/lib/shared/auth/backend-credentials.ts` exports `getBackendAccessToken()` — a `"server-only"` function that decrypts that cookie directly, checks expiry with a 60-second refresh skew, and (if needed) calls `/auth/refresh-token`, then **re-encrypts and re-persists** the rotated token pair back into the cookie itself. Every server action and Route Handler that needs to call the backend goes through this single function (via `getAuthHeaders()` / `serverFetch()` in `src/lib/shared/api/server-client.ts`) rather than reading a token off `req.headers` or the session.
- **"Remember me" / session age** — a boolean captured at login, checked by `isSessionExpiredByAge` to decide whether a session should be forcibly expired after 1 hour of age vs. allowed to live out its full 7-day cookie life.
- **Account lockout** — if the backend marks an account `locked`, middleware clears the session cookie immediately on the very next request.
- **Terms acceptance** — tracked as a first-class session field (`acceptedTerms`) that can be updated via `trigger: "update"` on the session, without requiring a full re-login.
- **Structured, non-leaky errors** — credential failures surface as one of two typed error codes (`AUTH_UNAUTHENTICATED`, `AUTH_REFRESH_REVOKED`) rather than raw token/error details reaching the client.

**Why it's built this way:** an internal security audit (`src/PRODUCTION_AUDIT.md`) flagged, as a P0 finding, that an earlier version of this app serialized the backend access token into the NextAuth session — meaning it was technically readable by browser JavaScript, even though nothing in the UI used it that way. `src/PRODUCTION_HARDENING.md` documents the fix that's now live in the code: the token never leaves the server. This is a good, concrete story about finding and closing a real security gap rather than shipping around it — see [§21](#21-talking-points--why-this-project-is-a-good-signal).

One tradeoff that's explicitly documented rather than hidden: the refresh flow inside `getBackendAccessToken()` is **not** de-duplicated across concurrent requests on the same server instance the way an earlier draft of this code did with in-memory maps. The current implementation is simpler and correct for a single instance; `PRODUCTION_AUDIT.md` calls out that horizontal scaling would need the backend's refresh-token rotation to tolerate a short grace window, or a shared coordination store — deliberately not built until the deployment topology actually needs it.

## 6. Route Protection & Middleware

`src/proxy.ts` is this project's Next.js middleware (exported as `proxy` rather than the default `middleware` export — a Next.js 16 convention this repo follows). On every matched request it:

1. Reads the NextAuth JWT via `getToken()`.
2. If the user is on an auth page (`/`, `/login`, `/forgot-password`, `/reset-password/*`) while already logged in, redirects them straight to their role's home (`/admin`, `/doctor`, or `/receptionist`).
3. If the token carries a `RefreshTokenExpired` error, clears the session cookies and redirects to `/login`.
4. If there's no token at all, redirects to `/login`.
5. If the session has aged past its allowed limit (`isSessionExpiredByAge`), clears cookies and redirects.
6. If the account is `locked`, clears cookies and redirects.
7. **Enforces the role boundary**: a request path must start with the user's role home or it gets redirected back to their own home — this is what stops a Doctor from ever rendering an Admin page, regardless of what URL they type.
8. Generates a fresh **CSP nonce** per request (`crypto.randomBytes`) and attaches both the `Content-Security-Policy` header and an `x-nonce` header, so inline scripts are allow-listed per-request instead of relying on `unsafe-inline`.

## 7. Feature-Based Folder Architecture

Rather than organizing by technical layer, the codebase is organized **by business domain** under `src/features/<name>/`, with each feature owning its own slice of every layer:

```
features/<name>/
  api/          # HTTP calls only — no orchestration, no React
  services/     # mapping + orchestration between API shape and UI shape (doctor feature)
  actions/      # Next.js Server Actions
  hooks/        # client-side React Query hooks / form hooks
  components/   # UI belonging to this feature
  validation/   # feature-specific Zod schemas (or re-exports from shared)
  constants/
  types/
```

Routes under `src/app/<role>/**` are intentionally kept **thin** — a page mostly just composes and renders exports from the matching `features/*` module.

Feature maturity at the time of this snapshot:
- `settings` — complete (shared across Admin + Doctor + Receptionist)
- `doctor` — complete, fully migrated out of `app/doctor`
- `admin` — mostly migrated; user creation/listing still partially lives directly in `app/admin/users`
- `receptionist` — the current, only implementation of the reception workflows (an in-progress rewrite under a `reception-workspace` module existed at one point but has since been removed from the codebase — `receptionist` is what ships)
- `notifications` — shared across all three roles, surfaced via a header bell and a Settings tab rather than a standalone page (see §10)
- `auth` — login / forgot-password / reset-password screens and hooks

## 8. Medical Image Viewer

Radiology images aren't standard web images — they commonly arrive as **DICOM** files, **JPEG-Lossless**-encoded data, or plain video, none of which an `<img>` tag or `<canvas>` can decode natively. `StudyImageViewer` (`src/features/doctor/components/images/study-image-viewer.tsx`) handles this by branching on file type:

- **DICOM** — parsed with `dicom-parser`, pixel data decoded with `jpeg-js` and, where needed, `jpeg-lossless-decoder-js` (dynamically imported), then painted to a `<canvas>`.
- **Video** (`mp4`, `mov`, `avi`, `wmv`, `mkv`, …) — decoded from a base64 payload into a `Blob` and played through a standard `<video>` element.
- **Anything else** — rendered as a regular image.

The component also supports deleting an image from a study and marking images as reviewed, with explicit loading/error states since medical image decoding can legitimately fail on malformed files. It's used inside the doctor's report screen (`app/doctor/patients/[id]/report`) as part of writing up a study — **not** as a standalone AI workspace (see §19 for why that distinction matters).

**Note on `package.json`:** `dwv`, `cornerstone-core`, and `cornerstone-wado-image-loader` are still listed as dependencies but are not imported anywhere in `src/` — the DICOM rendering path was rebuilt on `dicom-parser` + `jpeg-js` directly, and the older imaging stack was never removed from `package.json`. Same story for the `react-query` v3 package (fully superseded by `@tanstack/react-query` v5) and `fluent-ffmpeg` (not referenced anywhere in this repo). These are safe, low-risk cleanup candidates.

## 9. Real-Time Updates (SSE)

Several screens need to reflect changes made by *other* users instantly — e.g., a receptionist checking a patient in should update a doctor's queue without a manual refresh.

- `POST /api/sse-ticket` is a same-origin Route Handler that validates the requested channel list against a fixed enum (`appointments`, `queue`, `arrival_board`, `dashboard`, `availability`, `chat`, `notifications`) with Zod, then forwards the request — with the server-only bearer token attached — to the backend's `/realtime/tickets` endpoint. The backend response (also Zod-validated) is what actually gets handed to the browser; the ticket's signing and replay protection are the backend's responsibility, this route just brokers it safely.
- `use-staff-realtime.ts` is a shared hook, parameterized by `scope` (`"doctor" | "reception" | "admin"`), that opens the SSE connection with that ticket and, on each typed event, **surgically invalidates only the relevant React Query cache keys** for that scope rather than doing a blunt full refetch of everything.
- `staff-realtime-bridge.tsx` mounts this hook once at a layout level so any page under that role tree benefits without wiring it per-page.

## 10. Notifications

Notifications are a shared feature (`src/features/notifications/`) consumed from two places rather than a standalone `/notifications` route: a **bell dropdown** in each role's header layout (`notification-bell.tsx`), and a **panel inside each role's Settings page** (`notifications-page-content.tsx`, rendered from `app/{admin,doctor,receptionist}/settings/page.tsx`). Both are backed by the same `use-notifications` hook and React Query cache, which the realtime `notifications` channel invalidates on new events.

## 11. Security Hardening

This section reflects an internal audit-and-fix pass documented in `src/PRODUCTION_AUDIT.md` (findings) and `src/PRODUCTION_HARDENING.md` (what was actually shipped in response), both current as of this snapshot:

- **No backend credential reaches the browser** — see §5. This closed the audit's top-priority finding.
- **SSE tickets are backend-issued and schema-validated**, not locally generated — closing a second P0 finding about an earlier version that minted its own unsigned tickets.
- **Content-Security-Policy with per-request nonces**, generated in middleware; `unsafe-eval` is only added in development.
- **Role-based route isolation** enforced centrally in middleware, not just via conditional rendering.
- **Security headers set at the Next.js config level** (`next.config.ts`): `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, a strict `Referrer-Policy`, a restrictive `Permissions-Policy`, and HSTS in production.
- **The study-image upload route** (`app/api/studies/[study_id]/images/route.ts`) explicitly checks for an authenticated session *and* the `Doctor` role before touching the backend, and never forwards raw backend error bodies to the browser.
- **No third-party font fetch** — the root layout doesn't pull remote Google Fonts, so a production build doesn't depend on a third-party download at request time.
- **Audit logging** — `/admin/audit-logs` surfaces backend-recorded actions for accountability.
- **Still open, and documented as such rather than silently left as a gap:** refresh-token de-duplication is process-local (see §5); the error contract between frontend and backend isn't fully typed end-to-end yet; and route-level authorization is explicitly called out as a UX control only — the backend remains the sole authority for patient/study/report-level authorization.

## 12. Data Fetching & State Management

- **TanStack React Query** owns all server-state caching on the client — list, detail, and mutation hooks are scoped per feature (e.g. `doctorKeys`, `RECEPTION_QUERY_KEYS`), which is also what makes the real-time cache invalidation in §9 precise.
- **Server-side pagination** is implemented for large lists (patients, users, audit logs) rather than fetching everything and paginating client-side.
- **Debounced search** (`use-debounce`) is used on filterable list views so typing doesn't spam the backend with a request per keystroke.
- A thin `api/` layer per feature wraps `fetch` calls with a consistent `ApiResponse<T>` shape, so hooks and components deal with one predictable response contract.

## 13. Forms & Validation

- **react-hook-form** drives all form state; **Zod** schemas (shared in `src/lib/schemas/` / `src/lib/shared/schemas/`, or feature-local under `features/<name>/validation/`) define validation rules once and are wired in via `@hookform/resolvers/zod`.
- A shared `create-zod-form.ts` helper standardizes how feature forms are constructed, and `form-field-error.tsx` standardizes how validation errors render.

## 14. UI System & Design

- **Radix UI** primitives wrapped into a **shadcn/ui**-style component library under `src/components/ui/` — shared by all three roles.
- **Tailwind CSS v4** for styling, with `class-variance-authority` for variant-based component APIs and `tailwind-merge`/`clsx` to safely compose class names.
- **Dark theme by default**, toggleable via `next-themes`.
- **Emerald primary + Teal accent** color system (see the `oklch(...)` tokens in `src/app/globals.css`), used consistently across charts, status badges, and the marketing site.
- A public **marketing landing page** (`src/app/page.tsx`, components under `src/components/marketing/`) exists ahead of login — hero, role breakdown, and a features section, built with the same Framer Motion / shadcn foundation as the authenticated app.

## 15. Full Feature Tour by Role

**Admin** (`/admin/*`): dashboard, user management (add/deactivate), inactive-accounts review, analytics, audit logs, security overview, active sessions, chat, settings (incl. notification preferences).

**Doctor** (`/doctor/*`): dashboard, patient list, patient profile (searchable by national ID), report writing with an embedded study-image viewer, schedule, recent patients, historical patients, a personal watchlist, follow-ups, visit comparison (side-by-side historical review), analytics, chat, settings.

**Receptionist** (`/receptionist/*`): dashboard, patient registration & search, appointment booking/management, live arrival board, priority queue, doctor availability view, scheduling, communications, historical clinic data, chat, settings.

**Shared/public**: the marketing landing page (`/`), `(auth)` route group for login / forgot-password / reset-password, `legal/*` for privacy policy, terms & conditions, cookie policy, and security policy, and `unauthorized` as the catch-all for role-boundary violations.

## 16. Testing

- **Playwright** is configured for end-to-end tests (`tests/`, `playwright.config.ts`).
- **Unit tests** run via Node's native test runner through `tsx` (`tests/unit/`): `access-token-expiry`, `appointment-date`, `audit-actor`, `scheduling-utils`, and `settings-session` — the kind of pure-function logic that's cheap to unit test in isolation, including the token-expiry math that backs §5.

## 17. Project Structure Reference

```
src/
  app/                    # Next.js App Router — routes only, kept thin
    (auth)/               # login, forgot-password, reset-password
    admin/    doctor/    receptionist/
    api/                  # Route Handlers (auth, SSE ticket, image upload)
    legal/                # compliance pages
    unauthorized/
    page.tsx              # public marketing landing page
  features/               # business-domain modules (see §7)
    admin/  doctor/  receptionist/
    auth/  notifications/  settings/
  components/
    ui/                   # shadcn/ui-style design system primitives
    marketing/            # public landing page sections
    providers/            # theme + shared provider composition
    realtime/              # SSE bridge component
    shared/
  hooks/                  # cross-feature hooks (use-mobile, use-staff-realtime)
  lib/
    shared/config/env.ts  # single source of truth for env var access
    shared/api/            # server-side fetch client + error handling
    shared/auth/            # backend-credentials.ts, session-expiry, token-expiry
    schemas/  shared/schemas/   # cross-feature Zod schemas
    types/                 # ambient/shared TS types (auth, next-auth augmentation, api, etc.)
    constants/             # roles, auth, table filter constants
    utils/                 # date formatting, tailwind class merge
  auth.ts                  # NextAuth configuration (identity-only session)
  proxy.ts                 # Next.js middleware (route guard, CSP, session expiry)
  PRODUCTION_AUDIT.md       # internal security audit
  PRODUCTION_HARDENING.md   # internal write-up of the fixes shipped
tests/
  unit/                    # Node test runner + tsx
  example.spec.ts          # Playwright
```

## 18. Environment Variables & Running Locally

| Variable | Purpose |
|---|---|
| `API` | Server-side base URL of the backend REST API (used in `auth.ts`, Route Handlers, `getServerApiUrl()`) |
| `NEXT_PUBLIC_API` | Client-safe base URL of the backend API (falls back to `http://localhost:3001` if unset) |
| `NEXTAUTH_SECRET` | Secret used to sign/encrypt the NextAuth JWT — required in production |
| `NEXTAUTH_URL` | Canonical app URL used by NextAuth (falls back to `http://localhost:3000`) |

All env access goes through `src/lib/shared/config/env.ts` rather than reading `process.env` directly inside feature code.

```bash
pnpm install
pnpm dev              # start dev server on :3000
pnpm build && pnpm start   # production build
pnpm lint              # ESLint
pnpm type-check        # tsc --noEmit
pnpm test              # Playwright E2E
pnpm test:unit         # unit tests via tsx + node:test
```

This frontend expects a compatible backend running (default `http://localhost:3001`) exposing the REST endpoints referenced throughout (`/auth/login`, `/auth/refresh-token`, `/realtime/tickets`, `/studies/:id/images`, etc.), including the exact response shape documented in `src/PRODUCTION_HARDENING.md` for login/refresh (`accessToken`, `refreshToken`, `accessTokenExpiresAt`). The backend itself is a separate repository and is not part of this codebase.

## 19. Known Gaps & Things Worth Knowing Before You Dig In

Being upfront about the current state saves time for anyone picking this repo up:

- **The AI-assisted analysis workflow described by the marketing site isn't implemented in the app yet.** The landing page (`src/components/marketing/landing-intelligence.tsx`) advertises inline DICOM finding-detection with confidence scores and an approve/edit/reject workflow — but there is no `ai-analysis` route, no `/admin/ai-detection` page, and no AI-inference hook anywhere in `src/features/doctor` or `src/features/admin`. The doctor's actual report flow (§8) is a manual image viewer plus a free-text **Findings** field the doctor types themselves. Anyone using the marketing copy as a feature spec will be looking for code that doesn't exist yet.
- **No dedicated "AI disclaimer" legal page** — `src/app/legal/*` currently has privacy policy, terms & conditions, cookie policy, and security policy only, which lines up with the current feature set (no AI in the product yet) but not with the marketing claims above.
- **Leftover branding string** — `src/components/shared/terms-acceptance-modal.tsx` still refers to the product as "Echo Vision," the pre-rebrand name; everywhere else in the app (91+ other files) it's "Medivance."
- **Unused dependencies** in `package.json` — see §8 (`dwv`, `cornerstone-core`, `cornerstone-wado-image-loader`, legacy `react-query`, `fluent-ffmpeg`).
- **No page-level `<title>`/`<meta>` on the root layout** (`src/app/layout.tsx`) — individual routes set their own `metadata` (e.g. the legal and marketing pages do), but there's no shared fallback/template at the root.
- **`AGENTS.md` / `CLAUDE.md`** at the repo root are instructions for AI coding agents (Cursor, Claude Code, etc.), flagging that this project is pinned to a Next.js 16 that may differ from an agent's training data and pointing at the bundled docs in `node_modules/next/dist/docs/` before making changes — worth reading first if you're an AI assistant working in this repo, and a useful signal of how the team keeps agent-assisted contributions accurate.
- **`package.json`'s `name` field is still the scaffold default `"my-app"`**, not `"medivance"`.

## 20. What's Deliberately Not in This Repo

- No backend/API server code, no database or ORM layer, no CI configuration.
- No `.env` file (see §18 for the variables you'd need to supply).
- `NEXT_PUBLIC_API` / `API` are treated strictly as an external service boundary — this repo assumes a compatible backend exists and focuses purely on the frontend's own correctness.

## 21. Talking Points — Why This Project Is a Good Signal

If you're using this project to explain your skills in an interview, here's the honest shape of what it demonstrates:

- **A real security fix, not just a security feature.** An internal audit found that a backend credential was reachable from browser JavaScript via the NextAuth session; the fix was an actual BFF-style migration — server-only token storage, a single credential-bridge function every server-side call goes through, and typed non-leaky error codes — not a cosmetic patch. Being able to walk through *why* the old design was risky and *what specifically* changed is a stronger interview story than "I used NextAuth."
- **Documenting tradeoffs instead of hiding them.** The refresh-token de-duplication limitation, the "route guard is UX, not authorization" boundary, and the AI-marketing/AI-implementation gap in §19 are all things a less careful engineer might paper over. Being able to state precisely what's solid and what isn't yet is itself a skill worth demonstrating.
- **Architectural discipline at scale** — a feature-based structure applied consistently across three very different role experiences sharing one design system and one auth/session layer, with routes kept intentionally thin.
- **Judgment about client vs. server boundaries** — a dedicated Route Handler for large binary image uploads instead of a Server Action, and all env access centralized instead of scattered `process.env` reads.
- **Working with a genuinely hard UI problem** — rendering DICOM/JPEG-lossless medical imaging formats in-browser from a hand-rolled canvas decoder, which standard web APIs don't support out of the box.