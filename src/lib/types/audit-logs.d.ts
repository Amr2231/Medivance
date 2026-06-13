export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "AI_RUN"
  | "AI_APPROVE"
  | "AI_REJECT"
  | "AI_EDIT"
  | "REPORT_SIGNED"
  | "IMAGE_UPLOAD"
  | "PATIENT_REGISTER"
  | "PATIENT_UPDATE"
  | "PATIENT_DEACTIVATE"
  | "DOCTOR_REASSIGN"
  | "USER_CREATE"
  | "USER_DEACTIVATE"
  | "USER_REACTIVATE"
  | "PATIENTS_TRANSFER";

export type AuditEntity = "User" | "Patient" | "Study" | "Report";

export type AuditLogRow = {
  audit_log_id?: number;
  id?: number;
  actor_id: number | null;
  actor_name: string | null;
  actor_role: string | null;
  action: AuditAction | string;
  entity: AuditEntity | string;
  entity_id: string | number | null;
  description: string | null;
  ip_address: string | null;
  created_at: string;
};

export type AuditLogsListResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: AuditLogRow[];
};

export type AuditLogsQuery = {
  page?: number;
  limit?: number;
  sort?: "created_at" | "action" | "entity" | "actor_name";
  order?: "ASC" | "DESC";
  actor_id?: number;
  action?: string;
  entity?: string;
  entity_id?: string;
  from_date?: string;
  to_date?: string;
  keyword?: string;
};
