"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addDoctorHolidayAction,
  fetchDoctorScheduleAction,
  removeDoctorHolidayAction,
  saveDoctorScheduleAction,
} from "../actions/schedule.actions";
import type { DoctorScheduleDay } from "../api/schedule.api";

const SCHEDULE_KEY = ["doctor", "availability"] as const;

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function defaultDay(dayOfWeek: number): DoctorScheduleDay {
  return {
    day_of_week: dayOfWeek,
    day_name: DAY_LABELS[dayOfWeek],
    start_time: "09:00:00",
    end_time: "17:00:00",
    break_start: "12:00:00",
    break_end: "13:00:00",
    slot_duration_minutes: 30,
    max_appointments: 16,
    is_active: dayOfWeek >= 1 && dayOfWeek <= 5,
  };
}

export function mergeScheduleDays(
  days: DoctorScheduleDay[] = [],
): DoctorScheduleDay[] {
  return DAY_LABELS.map((label, dayOfWeek) => {
    const existing = days.find((d) => d.day_of_week === dayOfWeek);
    return existing
      ? { ...defaultDay(dayOfWeek), ...existing, day_name: label }
      : defaultDay(dayOfWeek);
  });
}

export function useDoctorAvailability() {
  return useQuery({
    queryKey: SCHEDULE_KEY,
    queryFn: fetchDoctorScheduleAction,
    select: (res) => ({
      days: mergeScheduleDays(res.data?.days),
      holidays: res.data?.holidays ?? [],
    }),
  });
}

export function useSaveDoctorAvailability() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (days: DoctorScheduleDay[]) => saveDoctorScheduleAction(days),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Availability saved");
        qc.invalidateQueries({ queryKey: SCHEDULE_KEY });
        return;
      }
      toast.error(res.message || "Failed to save availability");
    },
    onError: () => toast.error("Failed to save availability"),
  });
}

export function useAddDoctorHoliday() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addDoctorHolidayAction,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Holiday added");
        qc.invalidateQueries({ queryKey: SCHEDULE_KEY });
        return;
      }
      toast.error(res.message || "Failed to add holiday");
    },
    onError: () => toast.error("Failed to add holiday"),
  });
}

export function useRemoveDoctorHoliday() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: removeDoctorHolidayAction,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Holiday removed");
        qc.invalidateQueries({ queryKey: SCHEDULE_KEY });
        return;
      }
      toast.error(res.message || "Failed to remove holiday");
    },
    onError: () => toast.error("Failed to remove holiday"),
  });
}
