import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPatientAction } from "../actions/patients.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAddPatient(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: addPatientAction,
    onSuccess: (data) => {
      if (!data.success) throw new Error(data.message);
      toast.success("Patient added successfully!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      if (options?.onSuccess) {
        options.onSuccess();
      } else {
        router.push("/receptionist/patients");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
