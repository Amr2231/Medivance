"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctorsAvailability } from "../actions/dashboard.actions";
import { RECEPTION_QUERY_KEYS } from "../constants";
export function useDoctorsAvailability() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.doctorsAvailability,
    queryFn: () => fetchDoctorsAvailability().then((response) => response.data),
    refetchInterval: 15_000,
  });
}
