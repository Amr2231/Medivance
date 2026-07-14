"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorKeys } from "../constants/query-keys";
import {
  createFollowUpAction,
  deleteFollowUpAction,
  getFollowUpsAction,
  markFollowUpDoneAction,
} from "../actions/portal.actions";
import type { CreateFollowUpPayload } from "@/lib/types/doctor-portal";

export function useFollowUps(filter = "all") {
  return useQuery({
    queryKey: doctorKeys.followups(filter),
    queryFn: () => getFollowUpsAction(filter === "all" ? undefined : filter),
    staleTime: 30_000,
  });
}

export function useCreateFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFollowUpPayload) => createFollowUpAction(payload),
    onSuccess: () => {
      toast.success("Follow-up reminder created");
      qc.invalidateQueries({ queryKey: ["doctor", "followups"] });
      qc.invalidateQueries({ queryKey: doctorKeys.dashboard });
    },
    onError: () => toast.error("Failed to create reminder"),
  });
}

export function useMarkFollowUpDone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markFollowUpDoneAction,
    onSuccess: () => {
      toast.success("Marked as completed");
      qc.invalidateQueries({ queryKey: ["doctor", "followups"] });
      qc.invalidateQueries({ queryKey: doctorKeys.dashboard });
    },
    onError: () => toast.error("Failed to update"),
  });
}

export function useDeleteFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFollowUpAction,
    onSuccess: () => {
      toast.success("Reminder deleted");
      qc.invalidateQueries({ queryKey: ["doctor", "followups"] });
    },
    onError: () => toast.error("Failed to delete"),
  });
}
