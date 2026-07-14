"use client";

import { useQuery } from "@tanstack/react-query";
import { getPatientByNationalIdAction } from "../actions/patients.actions";
import { doctorKeys } from "../constants/query-keys";

export function usePatientProfile(nationalId: string) {
  return useQuery({
    queryKey: doctorKeys.patientByNationalId(nationalId),
    queryFn: () => getPatientByNationalIdAction(nationalId),
    enabled: Boolean(nationalId),
    staleTime: 30_000,
  });
}
