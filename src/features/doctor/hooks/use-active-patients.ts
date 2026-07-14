"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getActivePatientsAction,
  getRecentPatientsAction,
} from "../actions/patients.actions";
import { doctorKeys } from "../constants/query-keys";
import {
  normalizeActivePatientsQuery,
  type ActivePatientsQuery,
} from "../utils/filters";
import type { ActivePatient } from "@/lib/types/doctor";
import type { PatientsListResult } from "../services/patients.service";

export type { ActivePatientsQuery as ActivePatientsFilters };

export function useActivePatients<TData = PatientsListResult<ActivePatient>>(
  filters: ActivePatientsQuery & {
    select?: (data: PatientsListResult<ActivePatient>) => TData;
  } = {},
) {
  const { select, ...rest } = filters;
  const normalized = normalizeActivePatientsQuery(rest);

  return useQuery({
    queryKey: doctorKeys.patientsList(normalized),
    queryFn: () => getActivePatientsAction(normalized),
    select,
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  });
}

export function usePatientByStudyId(studyId: string) {
  return useQuery({
    queryKey: doctorKeys.patientByStudy(studyId),
    queryFn: async (): Promise<ActivePatient | null> => {
      const { getActivePatientByStudyIdAction } =
        await import("../actions/patients.actions");
      return getActivePatientByStudyIdAction(studyId);
    },
    enabled: Boolean(studyId),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: (previous) => previous,
  });
}

export function useRecentPatients(params?: {
  keyword?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["doctor", "patients", "recent", params ?? {}],
    queryFn: () => getRecentPatientsAction(params),
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  });
}
