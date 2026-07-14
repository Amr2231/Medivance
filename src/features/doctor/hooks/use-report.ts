"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  exportReportPDFAction,
  getFullReportAction,
  getReportAction,
  openReportAction,
  saveReportDraftAction,
  signReportAction,
} from "../actions/reports.actions";
import { doctorKeys } from "../constants/query-keys";

export function useOpenReport(studyId: string) {
  return useQuery({
    queryKey: doctorKeys.reportDraft(studyId),
    queryFn: () => openReportAction(studyId),
    enabled: Boolean(studyId),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetReport(studyId: string) {
  return useQuery({
    queryKey: doctorKeys.reportFull(studyId),
    queryFn: () => getReportAction(studyId),
    enabled: Boolean(studyId),
  });
}

export function useSaveReportDraft(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { notes: string }) =>
      saveReportDraftAction(studyId, payload),
    onMutate: async ({ notes }) => {
      await queryClient.cancelQueries({
        queryKey: doctorKeys.reportDraft(studyId),
      });
      const previous = queryClient.getQueryData(
        doctorKeys.reportDraft(studyId),
      );

      queryClient.setQueryData(doctorKeys.reportDraft(studyId), (old) => ({
        ...(old as object),
        report_content: notes,
      }));

      return { previous };
    },
    onSuccess: (_data, variables) => {
      toast.success("Draft saved");
      queryClient.setQueryData(doctorKeys.reportDraft(studyId), (old) => ({
        ...(old as object),
        report_content: variables.notes,
        report_status: "Written",
      }));
      queryClient.invalidateQueries({ queryKey: doctorKeys.patients });
      queryClient.invalidateQueries({ queryKey: ["patients", "active"] }); // ← receptionist
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          doctorKeys.reportDraft(studyId),
          context.previous,
        );
      }
      toast.error(`Save failed: ${error.message}`);
    },
  });
}

export function useSignReport(studyId: string, onSigned?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { notes: string }) =>
      signReportAction(studyId, payload),
    onSuccess: () => {
      toast.success("Report signed successfully");
      queryClient.invalidateQueries({
        queryKey: doctorKeys.reportDraft(studyId),
      });
      queryClient.invalidateQueries({
        queryKey: doctorKeys.reportFull(studyId),
      });
      onSigned?.();
    },
    onError: (error: Error) => {
      toast.error(`Sign failed: ${error.message}`);
    },
  });
}

export function useExportReportPDF(studyId: string) {
  return useMutation({
    mutationFn: () => exportReportPDFAction(studyId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `report_${studyId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("PDF downloaded");
    },
    onError: (error: Error) => {
      toast.error(`Export failed: ${error.message}`);
    },
  });
}

export function useFullReport(studyId: string, enabled = true) {
  return useQuery({
    queryKey: doctorKeys.reportFull(studyId),
    queryFn: () => getFullReportAction(studyId),
    enabled: Boolean(studyId) && enabled,
  });
}
