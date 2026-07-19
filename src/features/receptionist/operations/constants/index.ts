export const RECEPTION_QUERY_KEYS = {
  dashboard: ["reception", "dashboard"] as const,
  appointmentsToday: (filters: Record<string, unknown>) =>
    ["reception", "appointments", "today", filters] as const,
  appointment: (id: number) => ["reception", "appointment", id] as const,
  appointmentTimeline: (id: number) =>
    ["reception", "appointment", id, "timeline"] as const,
  queue: (filters: Record<string, unknown>) =>
    ["reception", "queue", filters] as const,
  arrivalBoard: (filters: Record<string, unknown>) =>
    ["reception", "arrival-board", filters] as const,
  doctorsAvailability: ["reception", "doctors", "availability"] as const,
  priorityOverview: ["reception", "priority-overview"] as const,
  callbacks: (filters: Record<string, unknown>) =>
    ["reception", "callbacks", filters] as const,
  communications: (nationalId: string, filters: Record<string, unknown>) =>
    ["reception", "communications", nationalId, filters] as const,
  scheduling: (params: Record<string, unknown>) =>
    ["reception", "scheduling", params] as const,
  chatInbox: ["reception", "chat", "inbox"] as const,
  chatConversation: (userId: number, patientId?: string) =>
    ["reception", "chat", userId, patientId] as const,
  patientThreads: ["reception", "chat", "patient-threads"] as const,
};

export const APPOINTMENT_STATUSES = [
  "Scheduled",
  "Checked In",
  "Waiting",
  "In Consultation",
  "Completed",
  "Cancelled",
  "No Show",
] as const;

export const BOARD_STATUSES = [
  "Waiting",
  "Checked In",
  "Called",
  "In Consultation",
  "Completed",
] as const;

export const PRIORITY_LEVELS = [
  "Emergency",
  "VIP",
  "Pregnant",
  "Senior Citizen",
  "Normal",
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  Emergency:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  VIP: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900",
  Pregnant:
    "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900",
  "Senior Citizen":
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  Normal: "bg-muted text-muted-foreground border-border",
};

export const STATUS_COLORS: Record<string, string> = {
  Scheduled: "bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
  "Checked In":
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300",
  Waiting:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300",
  "In Consultation":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  Cancelled: "bg-muted text-muted-foreground",
  "No Show": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  Called:
    "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
};

export const DOCTOR_STATUS_COLORS: Record<string, string> = {
  Available:
    "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  Busy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300",
  "In Consultation":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
  Break:
    "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
  "On Leave": "bg-muted text-muted-foreground",
};

export const QUICK_ACTIONS: Record<
  string,
  { label: string; next: string; variant?: "default" | "destructive" }[]
> = {
  Scheduled: [
    { label: "Check In", next: "Checked In" },
    { label: "Mark No Show", next: "No Show", variant: "destructive" },
    { label: "Cancel", next: "Cancelled", variant: "destructive" },
  ],
  "Checked In": [
    { label: "Move to Waiting", next: "Waiting" },
    { label: "Start Consultation", next: "In Consultation" },
  ],
  Waiting: [
    { label: "Start Consultation", next: "In Consultation" },
    { label: "Mark No Show", next: "No Show", variant: "destructive" },
  ],
  "In Consultation": [{ label: "Complete", next: "Completed" }],
};
