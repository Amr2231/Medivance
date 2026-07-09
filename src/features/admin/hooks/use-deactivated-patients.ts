import { useQuery } from "@tanstack/react-query";
import { getDeactivatedPatientsAction } from "../actions/users.actions";

// types
type Filters = {
  page?: number;
  keyword?: string;
  sort?: "newest" | "oldest";
  created_date?: string;
};

// use deactivated patients
export function useDeactivatedPatients(filters?: Filters) {
  return useQuery({
    queryKey: ["patients", "deactivated", filters],
    queryFn: async () => {
      const res = await getDeactivatedPatientsAction(filters);
      if (!res.success) throw new Error("Failed to fetch deactivated patients");
      return res;
    },
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}
