import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// constants for maxAge
const REMEMBER_ME_MAX_AGE = 7 * 24 * 60 * 60;
const SESSION_MAX_AGE = 60 * 60;

// POST /api/auth/session-preference
export async function POST(req: NextRequest) {
  // get rememberMe
  const { rememberMe } = await req.json();

  // get token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // if no token
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // get maxAge
  const maxAge = rememberMe ? REMEMBER_ME_MAX_AGE : SESSION_MAX_AGE;

  // get cookieName
  const isProd = process.env.NODE_ENV === "production";
  const cookieName = isProd
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

  // get sessionCookie
  const sessionCookie = req.cookies.get(cookieName);
  // if no sessionCookie
  if (!sessionCookie) {
    return NextResponse.json(
      { error: "No session cookie found" },
      { status: 400 },
    );
  }

  // create response
  const res = NextResponse.json({ ok: true });

  // set cookie
  res.cookies.set(cookieName, sessionCookie.value, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
