import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JSON_HEADERS } from "./lib/shared/constants/api";
import { LoginResponse } from "./lib/types/auth";
import { getAccessTokenExpiry } from "./lib/shared/auth/access-token-expiry";

const API = process.env.API;

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {}, rememberMe: {} },
      authorize: async (credentials) => {
        const creds = credentials as { email?: string; password?: string; rememberMe?: string };
        const response = await fetch(`${API}/auth/login`, {
          method: "POST", headers: { ...JSON_HEADERS },
          body: JSON.stringify({ email: creds.email, password: creds.password }),
        });
        const payload: ApiResponse<LoginResponse> = await response.json();
        if (!response.ok || "code" in payload) {
          const error = payload as { message?: string; error?: string };
          throw new Error(error.message || error.error || "Login failed");
        }
        const accessTokenExpiresAt = getAccessTokenExpiry(payload.token, payload.accessTokenExpiresAt);
        return {
          id: String(payload.user.id),
          name: `${payload.user.first_name} ${payload.user.last_name}`,
          accessToken: payload.token,
          refreshToken: payload.refreshToken,
          accessTokenExpiresAt,
          rememberMe: creds.rememberMe === "true",
          username: payload.user.username ?? payload.user.email?.split("@")[0] ?? "",
          email: payload.user.email,
          role: payload.user.role,
          created_at: payload.user.created_at,
          account_status: payload.user.account_status,
          acceptedTerms: payload.user.accepted_terms === true,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try { if (new URL(url).origin === baseUrl) return url; } catch {}
      return baseUrl;
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.sub = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiresAt = getAccessTokenExpiry(user.accessToken, user.accessTokenExpiresAt);
        token.rememberMe = user.rememberMe;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.created_at = user.created_at;
        token.account_status = user.account_status;
        token.username = user.username;
        token.error = undefined;
        token.acceptedTerms = user.acceptedTerms ?? false;
        token.loginAt = Date.now();
        return token;
      }
      if (trigger === "update" && session) {
        const first = session.firstName ?? (session as { first_name?: string }).first_name;
        const last = session.lastName ?? (session as { last_name?: string }).last_name;
        token.name = first !== undefined || last !== undefined ? `${first ?? ""} ${last ?? ""}`.trim() : session.name ?? token.name;
        token.email = session.email ?? token.email;
        token.username = session.username ?? token.username;
        if (session.acceptedTerms === true) token.acceptedTerms = true;
      }
      return token;
    },
    session: ({ session, token }) => {
      // Deliberately identity-only: no backend bearer credential is serialized.
      session.role = token.role;
      session.rememberMe = token.rememberMe as boolean;
      session.user.id = token.sub ?? "";
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.created_at = token.created_at;
      session.user.account_status = token.account_status;
      session.user.role = token.role;
      session.user.username = token.username;
      session.error = token.error as string | undefined;
      session.acceptedTerms = token.acceptedTerms as boolean;
      return session;
    },
  },
};
