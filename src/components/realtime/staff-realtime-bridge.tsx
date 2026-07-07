"use client";

import { useStaffRealtime } from "@/hooks/use-staff-realtime";

// This component is used to keep the SSE subscriptions alive for the whole staff layout
type StaffRealtimeBridgeProps = {
  scope: "doctor" | "reception" | "admin";
};

/**
 * Keeps SSE subscriptions alive for the whole staff layout so the
 * notification bell and workspace data update on every page. Mounted once
 * per role layout (doctor/admin/receptionist) — pages don't need to (and
 * shouldn't) set up their own realtime subscription on top of this.
 */
export function StaffRealtimeBridge({ scope }: StaffRealtimeBridgeProps) {
  useStaffRealtime(scope);
  return null;
}
