"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "../constants/query-keys";
import { getDashboardAction } from "../actions/dashboard.actions";

// use dashboard hook
export function useDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: getDashboardAction,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}
