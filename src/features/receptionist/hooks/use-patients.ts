import { useQuery } from "@tanstack/react-query";
import { getActivePatientsAction } from "../actions/patients.actions";
import { Filters } from "@/lib/constants/filters.constant";
import { DEFAULT_PAGE_SIZE } from "@/lib/shared/constants/api";

// ACTIVE PATIENTS HOOK
export function usePatients(filters?: Filters) {
  return useQuery({
    // queryKey
    queryKey: [
      "patients",
      "active",
      filters?.keyword,
      filters?.study_type,
      filters?.doctor_id,
      filters?.date,
      filters?.sort,
      filters?.page,
    ],
    // queryFn
    queryFn: async () => {
      // getActivePatientsAction with params from filters
      const res = await getActivePatientsAction({
        keyword: filters?.keyword,
        study_type: filters?.study_type,
        doctor_id: filters?.doctor_id,
        date: filters?.date,
        sort: filters?.sort,
        page: filters?.page ?? 1,
        limit: DEFAULT_PAGE_SIZE,
      });
      // if res.success is false, throw an error with message from res or default message
      if (!res.success)
        throw new Error(res.message || "Failed to fetch active patients");
      return res;
    },
    // placeholderData should return previous data if available, otherwise undefined
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    refetchInterval: 15_000,
  });
}
