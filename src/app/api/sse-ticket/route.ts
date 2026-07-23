import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { serverFetch } from "@/lib/shared/api/server-client";
import { ApiError } from "@/lib/shared/api/errors";

const channels = ["appointments", "queue", "arrival_board", "dashboard", "availability", "chat", "notifications"] as const;
const ticketRequestSchema = z.object({
  client: z.literal("web"),
  requestedChannels: z.array(z.enum(channels)).min(1).max(channels.length),
});
const ticketResponseSchema = z.object({
  ticket: z.string().min(16).max(4096),
  expiresAt: z.string().datetime(),
  allowedChannels: z.array(z.enum(channels)).min(1),
});

/** Same-origin BFF endpoint. The realtime backend owns signing and replay protection. */
export async function POST(request: NextRequest) {
  const body = ticketRequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ code: "VALIDATION_ERROR", message: "Invalid realtime ticket request" }, { status: 400 });
  try {
    const ticket = ticketResponseSchema.parse(await serverFetch("/realtime/tickets", {
      method: "POST", body: JSON.stringify(body.data),
    }));
    return NextResponse.json(ticket, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ code: error.code ?? "REALTIME_TICKET_FAILED", message: error.status === 401 ? "Unauthorized" : "Unable to establish realtime connection" }, { status: error.status });
    }
    return NextResponse.json({ code: "REALTIME_TICKET_FAILED", message: "Unable to establish realtime connection" }, { status: 502 });
  }
}
