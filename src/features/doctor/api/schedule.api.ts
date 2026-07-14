import { serverFetch } from "@/lib/shared/api/server-client";

// types
export type DoctorScheduleDay = {
  schedule_id?: number;
  day_of_week: number;
  day_name?: string;
  start_time: string;
  end_time: string;
  break_start?: string | null;
  break_end?: string | null;
  slot_duration_minutes: number;
  max_appointments: number;
  is_active: boolean | number;
};

export type DoctorHoliday = {
  holiday_id: number;
  holiday_date: string;
  reason?: string | null;
};

// types
export type DoctorScheduleResponse = {
  success: boolean;
  data: {
    days: DoctorScheduleDay[];
    holidays: DoctorHoliday[];
  };
  message?: string;
};

// API functions to interact with the doctor's schedule endpoints on the server
export async function fetchDoctorSchedule(): Promise<DoctorScheduleResponse> {
  return serverFetch("/api/doctor/schedule");
}

// API function to save the doctor's schedule
export async function saveDoctorSchedule(
  days: DoctorScheduleDay[],
): Promise<DoctorScheduleResponse> {
  return serverFetch("/api/doctor/schedule", {
    method: "PUT",
    body: JSON.stringify({ days }),
  });
}

// API function to add a holiday
export async function addDoctorHoliday(payload: {
  holiday_date: string;
  reason?: string;
}): Promise<DoctorScheduleResponse> {
  return serverFetch("/api/doctor/schedule/holidays", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// API function to remove a holiday
export async function removeDoctorHoliday(
  holidayId: number,
): Promise<{ success: boolean; message?: string }> {
  return serverFetch(`/api/doctor/schedule/holidays/${holidayId}`, {
    method: "DELETE",
  });
}
