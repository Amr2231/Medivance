import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isSessionExpiredByAge } from "@/lib/shared/auth/session-expiry";

const ROLE_HOME = {
  Admin: "/admin",
  Doctor: "/doctor",
  Receptionist: "/receptionist",
} as const;

type Role = keyof typeof ROLE_HOME;

function isAuthPage(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password")
  );
}

const isProd = process.env.NODE_ENV === "production";

function generateNonce(): string {
  return crypto.randomBytes(16).toString("base64");
}

function buildCSP(nonce: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API ?? "http://localhost:3001";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${!isProd ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    isProd
      ? `connect-src 'self' ${apiUrl}`
      : "connect-src 'self' http://localhost:3000 http://localhost:3001",
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ].join("; ");
}

function withCSP(res: NextResponse, nonce: string) {
  res.headers.set("Content-Security-Policy", buildCSP(nonce));
  res.headers.set("x-nonce", nonce);
  return res;
}

function nextWithCSP(req: NextRequest, nonce: string) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  return withCSP(
    NextResponse.next({ request: { headers: requestHeaders } }),
    nonce,
  );
}

function clearSession(res: NextResponse) {
  res.cookies.delete({ name: "next-auth.session-token", path: "/" });
  res.cookies.delete({
    name: "__Secure-next-auth.session-token",
    path: "/",
    secure: true,
  });
  return res;
}

export async function proxy(req: NextRequest) {
  const nonce = generateNonce();
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 1. Auth pages: redirect logged-in users to their dashboard
  if (isAuthPage(pathname)) {
    if (!token) return nextWithCSP(req, nonce);
    const role = token.role as Role;
    const home = ROLE_HOME[role];
    if (!home) return nextWithCSP(req, nonce);
    return withCSP(
      NextResponse.redirect(new URL(home, req.nextUrl.origin)),
      nonce,
    );
  }

  // 2. Session expired / token error: clear cookie + redirect
  if (token?.error === "RefreshTokenExpired") {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    return withCSP(clearSession(res), nonce);
  }

  if (!token) {
    return withCSP(
      NextResponse.redirect(new URL("/login", req.nextUrl.origin)),
      nonce,
    );
  }

  if (isSessionExpiredByAge(token)) {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    return withCSP(clearSession(res), nonce);
  }

  // 3. Locked account: clear session immediately
  if (token.account_status === "locked") {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    clearSession(res);
    return withCSP(res, nonce);
  }

  const role = token.role as Role;
  const home = ROLE_HOME[role];

  if (!home) {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    return withCSP(clearSession(res), nonce);
  }

  if (pathname === "/unauthorized") {
    return nextWithCSP(req, nonce);
  }

  if (!pathname.startsWith(home)) {
    return withCSP(
      NextResponse.redirect(new URL(home, req.nextUrl.origin)),
      nonce,
    );
  }

  return nextWithCSP(req, nonce);
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/doctor/:path*",
    "/receptionist/:path*",
    "/api/admin/:path*",
    "/api/doctor/:path*",
    "/api/receptionist/:path*",
    "/login",
    "/forgot-password",
    "/reset-password/:path*",
    "/unauthorized",
  ],
};
