"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCommunicationNote,
  addContactAttempt,
  createCallback,
  fetchCallbacks,
  fetchCommunicationTimeline,
  updateCallbackStatus,
} from "../actions/communications.actions";
import { RECEPTION_QUERY_KEYS } from "../constants";
export function useCallbacks(
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.callbacks(filters),
    queryFn: () => fetchCallbacks(filters),
  });
}
export function useCreateCallback() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createCallback,
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: RECEPTION_QUERY_KEYS.callbacks({}),
      }),
  });
}
export function useUpdateCallbackStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateCallbackStatus(id, status),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["reception", "callbacks"] }),
  });
}
export function useAddContactAttempt() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: number;
      outcome: string;
      notes?: string;
    }) => addContactAttempt(id, body),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["reception", "callbacks"] }),
  });
}
export function useCommunicationTimeline(
  nationalId: string,
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.communications(nationalId, filters),
    queryFn: () =>
      fetchCommunicationTimeline(nationalId, filters).then(
        (response) => response.data,
      ),
    enabled: Boolean(nationalId),
  });
}
export function useAddCommunicationNote() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: addCommunicationNote,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["reception", "communications"] }),
  });
}
