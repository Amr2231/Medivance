import { useQuery } from "@tanstack/react-query";
import { getDoctorsAction } from "../actions/patients.actions";

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await getDoctorsAction();
      if (!res.success) throw new Error("Failed to fetch doctors");
      return res.data; 
    },
    staleTime: 5 * 60_000, // 5 minutes
  });
}
