import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    /** Backend credentials are encrypted in the JWT cookie, never Session. */
    accessToken: string;
    refreshToken?: string;
    accessTokenExpiresAt?: string | number;
    role: string;
    username: string;
    created_at: string;
    account_status: string;
    rememberMe: boolean;
    acceptedTerms: boolean;
  }

  interface Session extends DefaultSession {
    error?: string;
    role: string;
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      role: string;
      created_at: string;
      account_status: string;
    };
    rememberMe: boolean;
    acceptedTerms: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    refreshToken?: string;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    role: string;
    username: string;
    created_at: string;
    account_status: string;
    error?: "RefreshTokenExpired" | "AccessTokenExpired" | "UnknownError";
    expiresAt?: number;
    acceptedTerms: boolean;
    loginAt?: number;
    rememberMe: boolean;
  }
}
