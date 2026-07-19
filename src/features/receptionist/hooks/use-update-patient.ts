import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatientAction } from "../actions/patients.actions";
import { toast } from "sonner";

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      national_id,
      payload,
    }: {
      national_id: string;
      payload: Parameters<typeof updatePatientAction>[1];
    }) => updatePatientAction(national_id, payload),
    onSuccess: (data) => {
      if (!data.success) throw new Error(data.message);
      toast.success("Patient updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
