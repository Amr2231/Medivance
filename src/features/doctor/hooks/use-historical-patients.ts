"use client";

import { useQuery } from "@tanstack/react-query";
import { getHistoricalPatientsAction } from "../actions/patients.actions";
import { doctorKeys } from "../constants/query-keys";
import {
  normalizeHistoricalPatientsQuery,
  type HistoricalPatientsQuery,
} from "../utils/filters";

export type { HistoricalPatientsQuery as HistoricalPatientsFilters };

export function useHistoricalPatients(filters: HistoricalPatientsQuery = {}) {
  const normalized = normalizeHistoricalPatientsQuery(filters);

  return useQuery({
    queryKey: doctorKeys.patientsHistory(normalized),
    queryFn: () => getHistoricalPatientsAction(normalized),
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  });
}
