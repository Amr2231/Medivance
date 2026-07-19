"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatientAction } from "../actions/patients.actions";
import { toast } from "sonner";

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatientAction,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message || "Unable to deactivate patient");
        return;
      }
      toast.success(data.message || "Patient deactivated successfully");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to deactivate patient");
    },
  });
}
