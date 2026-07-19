"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../actions/dashboard.actions";
import { RECEPTION_QUERY_KEYS } from "../constants";
export function useReceptionDashboard() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.dashboard,
    queryFn: () => fetchDashboard().then((response) => response.data),
    refetchInterval: 30_000,
  });
}
