"use client";

import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getPublicApiUrl } from "@/lib/shared/config/env";
import { doctorKeys } from "@/features/doctor/constants/query-keys";
import { RECEPTION_QUERY_KEYS } from "@/features/receptionist/operations/constants";

const REQUESTED_CHANNELS = ["appointments", "queue", "arrival_board", "dashboard", "availability", "chat", "notifications"] as const;
const ticketSchema = {
  isValid(value: unknown): value is { ticket: string; expiresAt: string; allowedChannels: string[] } {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return typeof candidate.ticket === "string" && candidate.ticket.length >= 16 &&
      typeof candidate.expiresAt === "string" && Number.isFinite(Date.parse(candidate.expiresAt)) &&
      Array.isArray(candidate.allowedChannels) && candidate.allowedChannels.every((channel) => REQUESTED_CHANNELS.includes(channel as (typeof REQUESTED_CHANNELS)[number]));
  },
};

export function useStaffRealtime(
  scope: "doctor" | "reception" | "admin" = "doctor",
) {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  const invalidateChannel = useCallback(
    (channel: string) => {
      if (channel === "chat") {
        if (scope === "doctor" || scope === "admin") {
          queryClient.invalidateQueries({ queryKey: doctorKeys.chatInbox });
          queryClient.invalidateQueries({ queryKey: doctorKeys.chatUnread });
        }
        if (scope === "reception" || scope === "admin") {
          queryClient.invalidateQueries({ queryKey: ["reception", "chat"] });
        }
        return;
      }

      if (channel === "notifications") {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        return;
      }

      if (scope === "reception" || scope === "admin") {
        switch (channel) {
          case "dashboard":
            queryClient.invalidateQueries({
              queryKey: RECEPTION_QUERY_KEYS.dashboard,
            });
            break;
          case "appointments":
            queryClient.invalidateQueries({
              queryKey: ["reception", "appointments"],
            });
            break;
          case "queue":
          case "arrival_board":
            queryClient.invalidateQueries({ queryKey: ["reception", "queue"] });
            queryClient.invalidateQueries({
              queryKey: ["reception", "arrival-board"],
            });
            queryClient.invalidateQueries({
              queryKey: RECEPTION_QUERY_KEYS.priorityOverview,
            });
            break;
          case "availability":
            queryClient.invalidateQueries({
              queryKey: RECEPTION_QUERY_KEYS.doctorsAvailability,
            });
            break;
          default:
            queryClient.invalidateQueries({ queryKey: ["reception"] });
        }
      }
    },
    [queryClient, scope],
  );

  useEffect(() => {
    if (status !== "authenticated" || session?.error) return;

    const url = `${getPublicApiUrl()}/api/reception/events`;
    let es: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;
    let disposed = false;

    const scheduleReconnect = () => {
      if (disposed || retryTimer) return;

      // Exponential backoff with jitter prevents synchronized reconnect storms
      // after a backend restart or network interruption.
      const baseDelay = Math.min(1_000 * 2 ** attempt, 30_000);
      const jitter = Math.floor(Math.random() * 1_000);
      attempt += 1;
      retryTimer = setTimeout(() => {
        retryTimer = undefined;
        void connect();
      }, baseDelay + jitter);
    };

    const connect = async () => {
      try {
        const ticketResponse = await fetch("/api/sse-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client: "web", requestedChannels: REQUESTED_CHANNELS }),
        });
        const ticketPayload: unknown = await ticketResponse.json().catch(() => null);

        if (!ticketResponse.ok || !ticketSchema.isValid(ticketPayload) || Date.parse(ticketPayload.expiresAt) <= Date.now()) {
          scheduleReconnect();
          return;
        }

        es = new EventSource(
          `${url}?t=${encodeURIComponent(ticketPayload.ticket)}`,
        );

        for (const ch of ticketPayload.allowedChannels) {
          es.addEventListener(ch, () => invalidateChannel(ch));
        }

        es.onopen = () => {
          attempt = 0;
        };

        es.onerror = () => {
          es?.close();
          es = null;
          scheduleReconnect();
        };
      } catch {
        scheduleReconnect();
      }
    };

    void connect();

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      es?.close();
    };
  }, [status, session?.error, invalidateChannel]);

  return { invalidateChannel };
}
