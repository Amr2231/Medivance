import { LoginFields } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";

// Redirects based on user role after login
const ROLE_REDIRECTS: Record<string, string> = {
  Admin: "/admin",
  Doctor: "/doctor",
  Receptionist: "/receptionist",
};

// Calls /api/auth/session-preference, retrying briefly if the session cookie
// hasn't propagated yet. Replaces a blind fixed-delay wait, which was a race
// condition under slow networks/high latency (and did nothing to actually
// confirm the cookie was ready).
async function applySessionPreference(rememberMe: boolean) {
  const attempts = [0, 150, 400]; // ms to wait before each attempt

  for (let i = 0; i < attempts.length; i++) {
    if (attempts[i] > 0) {
      await new Promise((resolve) => setTimeout(resolve, attempts[i]));
    }

    const res = await fetch("/api/auth/session-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rememberMe }),
    });

    if (res.ok) return;

    // 400 here specifically means "no session cookie found yet" — worth
    // retrying. Any other failure isn't going to fix itself by waiting.
    if (res.status !== 400) return;
  }
}

// Custom hook to handle login logic
export function useLogin() {
  // useMutation to handle the login process
  const { isPending, error, mutate } = useMutation({
    // The mutation function that performs the login using NextAuth's signIn method
    mutationFn: async (credentials: LoginFields) => {
      const response = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        rememberMe: String(credentials.rememberMe),
        redirect: false,
      });

      if (!response?.ok) {
        throw new Error(response?.error || "Login failed");
      }

      await applySessionPreference(credentials.rememberMe);
    },

    // success login
    onSuccess: async () => {
      const session = await getSession();
      const role = session?.role;
      const destination = ROLE_REDIRECTS[role ?? ""] ?? "/";

      toast.success("Logged in successfully!", { duration: 1500 });

      // Redirect on a fixed timer instead of the toast's onAutoClose — a
      // manually-dismissed (e.g. swiped-away) toast never fires
      // onAutoClose, which previously meant a successful login could leave
      // the user stuck on the login page.
      setTimeout(() => {
        location.href = destination;
      }, 1500);
    },
  });
  return { isPending, error, login: mutate };
}
