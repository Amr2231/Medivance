"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminKeys } from "../constants/query-keys";
import {
  forceLogoutAllAction,
  forceLogoutUserAction,
  getActiveSessionsAction,
  getSessionStatsAction,
} from "../actions/sessions.actions";

// active sessions
export function useActiveSessions(filters?: {
  page?: number;
  keyword?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: adminKeys.sessions(filters),
    queryFn: () => getActiveSessionsAction(filters),
    placeholderData: (prev) => prev,
    staleTime: 15_000,
  });
}

// session stats
export function useSessionStats() {
  return useQuery({
    queryKey: adminKeys.sessionStats,
    queryFn: getSessionStatsAction,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

// force logout
export function useForceLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => forceLogoutUserAction(userId),
    onSuccess: () => {
      toast.success("Session terminated");
      qc.invalidateQueries({ queryKey: ["admin", "sessions"] });
      qc.invalidateQueries({ queryKey: adminKeys.sessionStats });
    },
    onError: () => toast.error("Failed to terminate session"),
  });
}

// force logout
export function useForceLogoutAll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: forceLogoutAllAction,
    onSuccess: (res) => {
      toast.success(res.message ?? "All sessions terminated");
      qc.invalidateQueries({ queryKey: ["admin", "sessions"] });
      qc.invalidateQueries({ queryKey: adminKeys.sessionStats });
    },
    onError: () => toast.error("Failed to terminate sessions"),
  });
}
