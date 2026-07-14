"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorKeys } from "../constants/query-keys";
import {
  addToWatchlistAction,
  getWatchlistAction,
  removeFromWatchlistAction,
} from "../actions/portal.actions";

export function useWatchlist() {
  return useQuery({
    queryKey: doctorKeys.watchlist,
    queryFn: getWatchlistAction,
    staleTime: 30_000,
  });
}

export function useAddToWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addToWatchlistAction,
    onSuccess: () => {
      toast.success("Added to watchlist");
      qc.invalidateQueries({ queryKey: doctorKeys.watchlist });
      qc.invalidateQueries({ queryKey: doctorKeys.dashboard });
    },
    onError: () => toast.error("Failed to add to watchlist"),
  });
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeFromWatchlistAction,
    onSuccess: () => {
      toast.success("Removed from watchlist");
      qc.invalidateQueries({ queryKey: doctorKeys.watchlist });
      qc.invalidateQueries({ queryKey: doctorKeys.dashboard });
    },
    onError: () => toast.error("Failed to remove"),
  });
}
