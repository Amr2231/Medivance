"use client";

// This provider is responsible for wrapping the application with the NextAuth SessionProvider, which provides session context to the entire app. It should be used in the root layout or a higher-level component to ensure that all child components have access to authentication state and session data.
import { SessionProvider } from "next-auth/react";

// NextAuthProvider component wraps the application with the SessionProvider from next-auth
export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
