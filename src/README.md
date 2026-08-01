# Radiology / Clinic Management — Frontend

Next.js (App Router) frontend for a clinic/radiology management system with three
user roles: **Admin**, **Doctor**, **Receptionist**. This is a **frontend-only**
codebase — it talks to a separate backend REST API (see `NEXT_PUBLIC_API` /
`API` env vars, default `http://localhost:3001`). No backend code lives here.

> This README exists so an AI assistant (Cursor/Claude) can understand the
> project's shape in one read instead of crawling every file. Read this first,
> then jump directly to the relevant folder for the task at hand.

## Tech stack

- **Framework:** Next.js (App Router, route groups, server components + server actions)
- **Auth:** next-auth (credentials provider, JWT strategy) — role-based access
  enforced in `src/proxy.ts` (this project's middleware, exported as `proxy`
  instead of `middleware`)
- **Data fetching:** TanStack React Query (client) + server actions / a thin
  `api/` layer per feature (server-side fetch wrappers)
- **Forms:** react-hook-form + zod (`@hookform/resolvers/zod`)
- **UI:** Radix UI primitives (`radix-ui`) wrapped in `src/components/ui`
  (shadcn-style), Tailwind CSS, `class-variance-authority`, `clsx` +
  `tailwind-merge`
- **Other:** framer-motion / `motion/react` (animation), `sonner` (toasts),
  `next-themes` (dark mode), `use-debounce`, `input-otp`

## Roles & routing

Three roles, each with an isolated route tree and mirrored feature module:

| Role         | Routes            | Feature module                    |
|--------------|--------------------|------------------------------------|
| Admin        | `src/app/admin/*`        | `src/features/admin`        |
| Doctor       | `src/app/doctor/*`       | `src/features/doctor`       |
| Receptionist | `src/app/receptionist/*` | `src/features/receptionist` + `src/features/reception-workspace` (newer, in-progress rewrite of receptionist screens — see status table below) |

Shared/public routes: `src/app/(auth)/*` (login, forgot/reset password),
`src/app/legal/*` (privacy policy, terms, AI disclaimer, cookie/security policy),
`src/app/unauthorized`.

**`src/proxy.ts`** is the Next.js middleware. It:
- redirects logged-in users away from auth pages to their role's home
- redirects unauthenticated users to `/login`
- enforces that a role can only access its own `/<role>/*` subtree
- expires sessions after 1h unless "remember me" was set, and clears cookies
  on locked accounts / expired refresh tokens
- sets a per-request CSP nonce (`x-nonce` header) for inline scripts

## Feature-based architecture

`src/features/<name>/` — each folder is a **business domain**, not a technical
layer (full explanation in `src/features/README.md`):

```
features/<name>/
  api/          # HTTP calls only
  services/     # mapping + orchestration (doctor feature only, so far)
  actions/      # Next.js server actions
  hooks/        # client React Query / form hooks
  components/   # UI for this feature
  validation/   # feature-specific zod schemas (or re-export from lib/schemas)
  constants/
  types/        # feature-local types (some features keep types in src/lib/types instead)
```

Routes in `src/app/<role>/` should stay thin and mostly compose exports from
the matching `features/*` module.

Feature status (from `src/features/README.md`):
- `settings` — complete (admin + doctor)
- `doctor` — complete, migrated from `app/doctor`
- `admin` — partial (settings unified; `users` still partly in `app/`)
- `receptionist` — partial, being migrated incrementally to `reception-workspace`
- `notifications` — shared across roles

## Domain features of note

- **AI-assisted radiology:** `app/doctor/patients/[id]/ai-analysis`,
  `features/doctor/components/ai-analysis` (incl. `image-viewer.tsx`), and
  `app/admin/ai-detection` — AI analysis/detection over radiology images.
  `src/lib/types/jpeg-lossless-decoder-js.d.ts` hints at medical image
  (DICOM/JPEG-lossless) decoding for the image viewer.
- **Realtime:** `src/app/api/sse-ticket` issues SSE tickets;
  `src/components/realtime/staff-realtime-bridge.tsx` and
  `src/hooks/use-staff-realtime.ts` consume the realtime stream (used for
  things like the receptionist arrival board / priority queue).
- **Legal/compliance pages:** `src/app/legal/*` — static-ish pages for privacy
  policy, terms, cookie policy, security policy, AI disclaimer.

## Shared code (`src/lib`, `src/components`, `src/hooks`)

- `src/lib/shared/config/env.ts` — **always** read env vars through this file
  (`env`, `getServerApiUrl`, `getPublicApiUrl`, `getNextAuthSecret`) instead of
  `process.env` directly in features.
- `src/lib/shared/api/server-client.ts` / `errors.ts` — shared server-side
  fetch client + error handling.
- `src/lib/schemas/*` and `src/lib/shared/schemas/*` — zod schemas shared
  across features (auth, patient, reception, settings, admin, doctor, report).
- `src/lib/types/*.d.ts` — ambient/shared TypeScript types (auth, next-auth
  module augmentation, admin, doctor, doctor-portal, receptionist,
  reception-workspace, notifications, audit-logs, api).
- `src/lib/constants/*` — cross-feature constants (roles, auth, table filters).
- `src/lib/utils/*` — small generic helpers (date formatting, tailwind class
  merge).
- `src/components/ui/*` — design-system primitives (Radix-based), shared by
  every role.
- `src/components/providers/*` — app-level providers (theme provider, and a
  `shared` provider composition).
- `src/hooks/*` — cross-feature hooks (`use-mobile`, `use-staff-realtime`).

## Auth model

- Roles are exactly `"Admin" | "Doctor" | "Receptionist"`
  (`src/lib/constants/roles.constants.ts`).
- `src/lib/types/next-auth.d.ts` augments next-auth's `User`/`Session`/`JWT`
  with: `accessToken`, `refreshToken`, `role`, `username`, `account_status`,
  `rememberMe`, `acceptedTerms`, and a token `error` field
  (`RefreshTokenExpired` / `AccessTokenExpired` / `UnknownError`) used by
  `proxy.ts` to decide whether to clear the session.
- Login/forgot-password/reset-password UI + hooks live in `src/features/auth`.
- `src/app/api/auth/[...nextauth]/route.ts` — next-auth handler.
- `src/app/api/auth/accept-terms` and `.../session-preference` — small
  auth-adjacent API routes (accepting terms, remember-me preference).

## Conventions worth knowing before editing

- Path alias `@/*` → `src/*`.
- Prefer editing/adding to a feature's `api/`, `hooks/`, `actions/`, or
  `components/` folder over putting logic directly in `src/app/**/page.tsx`;
  pages should stay thin.
- API response shape convention: `ApiResponse<T> = successResponse<T> |
  ErrorResponse` (see `src/lib/types/api.d.ts`).
- Env vars are always accessed via `src/lib/shared/config/env.ts`, never
  `process.env` inline in feature code.
- When touching auth/session/role-guarding logic, `src/proxy.ts` is the
  source of truth for route protection — check it before changing role
  redirects.

## What's NOT in this repo

No `package.json`/lockfile, backend/API server code, database/ORM layer, or
CI config is included in this `src/` export — only the Next.js `src/`
directory. Treat `NEXT_PUBLIC_API` as an external service boundary.
