import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reassignPatientAction } from "../actions/patients.actions";
import { toast } from "sonner";
import type { ReassignDoctorFields } from "@/lib/schemas/patient.schema";

export function useReassignPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      national_id,
      ...form
    }: ReassignDoctorFields & { national_id: string }) =>
      reassignPatientAction(national_id, {
        doctor_id: form.doctor_id,
        study_type: form.study_type,
        study_date: form.study_date,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient reassigned successfully!");
    },
    onError: () => {
      toast.error("Failed to reassign patient");
    },
  });
}
