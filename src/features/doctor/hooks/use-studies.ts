"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { completeStudyAction } from "../actions/studies.actions";
import { doctorKeys } from "../constants/query-keys";

// custom hook
export function useUploadStudyImages(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      files,
      view_type,
    }: {
      files: File[];
      view_type: string;
    }) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      formData.append("view_type", view_type);

      const res = await fetch(`/api/studies/${studyId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload images");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Images uploaded!");
      queryClient.invalidateQueries({ queryKey: doctorKeys.patients });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCompleteStudy(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeStudyAction(studyId),
    onSuccess: () => {
      toast.success("Study completed!");
      queryClient.invalidateQueries({ queryKey: doctorKeys.patients });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
