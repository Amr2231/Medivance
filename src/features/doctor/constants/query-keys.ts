export const doctorKeys = {
  patients: ["doctor", "patients"] as const,
  patientsList: (filters: Record<string, unknown>) =>
    ["doctor", "patients", filters] as const,
  patientsHistory: (filters: Record<string, unknown>) =>
    ["doctor", "patients", "history", filters] as const,
  patientByStudy: (studyId: string) =>
    ["doctor", "patient-by-study", studyId] as const,
  reportDraft: (studyId: string) =>
    ["doctor", "report", "draft", studyId] as const,
  reportFull: (studyId: string) =>
    ["doctor", "report", "full", studyId] as const,
  notifications: ["doctor", "notifications"] as const,
  dashboard: ["doctor", "dashboard"] as const,
  performance: (period?: string) =>
    ["doctor", "performance", period ?? "month"] as const,
  watchlist: ["doctor", "watchlist"] as const,
  followups: (filter?: string) =>
    ["doctor", "followups", filter ?? "all"] as const,
  chatInbox: ["doctor", "chat", "inbox"] as const,
  chatUnread: ["doctor", "chat", "unread"] as const,
  chatConversation: (userId: number, page?: number) =>
    ["doctor", "chat", userId, page ?? 1] as const,
  patientByNationalId: (nationalId: string) =>
    ["doctor", "patient", nationalId] as const,
};
