"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorKeys } from "../constants/query-keys";
import {
  getDoctorDashboardAction,
  getDoctorPerformanceAction,
} from "../actions/dashboard.actions";

// Hook for fetching doctor dashboard data
export function useDoctorDashboard() {
  return useQuery({
    queryKey: doctorKeys.dashboard,
    queryFn: getDoctorDashboardAction,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

// Hook for fetching doctor performance metrics  
export function useDoctorPerformance(period = "month") {
  return useQuery({
    queryKey: doctorKeys.performance(period),
    queryFn: () => getDoctorPerformanceAction(period),
    staleTime: 60_000,
  });
}
