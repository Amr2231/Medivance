"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  callPatient,
  fetchArrivalBoard,
  fetchPriorityOverview,
  fetchQueue,
} from "../actions/queue.actions";
import { RECEPTION_QUERY_KEYS } from "../constants";
export function useQueue(
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.queue(filters),
    queryFn: () => fetchQueue(filters),
    refetchInterval: 10_000,
  });
}
export function useArrivalBoard(
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.arrivalBoard(filters),
    queryFn: () => fetchArrivalBoard(filters).then((response) => response.data),
    refetchInterval: 8_000,
    placeholderData: (previous) => previous,
  });
}
export function useCallPatient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: callPatient,
    onSuccess: () => client.invalidateQueries({ queryKey: ["reception"] }),
  });
}
export function usePriorityOverview() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.priorityOverview,
    queryFn: () => fetchPriorityOverview().then((response) => response.data),
    refetchInterval: 10_000,
    placeholderData: (previous) => previous,
  });
}
