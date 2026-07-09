import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactivatePatientAction } from "../actions/users.actions";
import { toast } from "sonner";

export function useReactivatePatient() {
  const queryClient = useQueryClient();

  // Mutations
  return useMutation({
    mutationFn: (national_id: string) => reactivatePatientAction(national_id),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Patient reactivated successfully!");
        queryClient.invalidateQueries({
          queryKey: ["patients", "deactivated"],
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    },
    onError: () => {
      toast.error("Network error, please try again");
    },
  });
}
