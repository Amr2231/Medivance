import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { serverFetch } from "@/lib/shared/api/server-client";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await serverFetch("/auth/accept-terms", { method: "POST" });
    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Unable to save your acceptance. Please try again." },
      { status: 502 },
    );
  }
}
