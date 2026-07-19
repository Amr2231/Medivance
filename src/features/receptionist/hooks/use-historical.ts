import { useQuery } from "@tanstack/react-query";
import { getHistoricalPatientsAction } from "../actions/patients.actions";

type Filters = {
  keyword?: string;
  study_type?: string;
  date?: string;
  sort?: "newest" | "oldest";
  page?: number;
};

export function useHistoricalPatients(filters?: Filters) {
  return useQuery({
    queryKey: [
      "patients",
      "history",
      filters?.keyword,
      filters?.study_type,
      filters?.date,
      filters?.sort,
      filters?.page,
    ],
    queryFn: async () => {
      const res = await getHistoricalPatientsAction({
        keyword: filters?.keyword,
        study_type: filters?.study_type,
        date: filters?.date,
        sort: filters?.sort,
        page: filters?.page ?? 1,
        limit: 10,
      });
      if (!res.success)
        throw new Error(res.message || "Failed to fetch historical patients");
      return res;
    },
    placeholderData: (prev) => prev,
    staleTime: 30_000, // 30 seconds 
  });
}
