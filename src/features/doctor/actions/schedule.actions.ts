"use server";

import * as scheduleApi from "../api/schedule.api";

// fetch the doctor's schedule from the server
export async function fetchDoctorScheduleAction() {
  return scheduleApi.fetchDoctorSchedule();
}

// save the doctor's schedule to the server
export async function saveDoctorScheduleAction(
  days: scheduleApi.DoctorScheduleDay[],
) {
  return scheduleApi.saveDoctorSchedule(days);
}

// add a holiday
export async function addDoctorHolidayAction(payload: {
  holiday_date: string;
  reason?: string;
}) {
  return scheduleApi.addDoctorHoliday(payload);
}

// remove a holiday
export async function removeDoctorHolidayAction(holidayId: number) {
  return scheduleApi.removeDoctorHoliday(holidayId);
}
