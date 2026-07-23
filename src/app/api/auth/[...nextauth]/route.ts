import { authOptions } from "@/auth";
import NextAuth from "next-auth";

// NextAuth handler for authentication routes [Creates Routes for /api/auth/*]
const handler = NextAuth(authOptions);

// Export the handler
export { handler as GET, handler as POST };
