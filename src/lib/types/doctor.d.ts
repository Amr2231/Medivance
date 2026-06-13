export type ReportStatus = "not written" | "written" | "signed";
export type PatientStatus =
  | "Scheduled"
  | "Viewed"
  | "Completed"
  | "In Progress"
  | "Pending";
export type DiseaseType = "HFrEF" | "LVH";

export type {
  Notification,
  NotificationCategory,
  BackendNotificationType,
  NotificationsListResponse,
} from "@/lib/types/notifications";

export type ActivePatient = {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  gender: "Male" | "Female";
  x_rays: string | null;
  report_status: ReportStatus;
  study: string;
  received_date: string;
  notes: string | null;
  description: string | null;
  image_numbers: number;
  patient_status: PatientStatus;
  status: PatientStatus;
  assigned_doctor: string;
  doctor_specialty: string;
  studies: BackendStudy;
};

export type HistoricalPatient = Omit<ActivePatient, "patient_status"> & {
  patient_status: "Completed";
  status: "Completed";
};

export type SaveReportPayload = {
  notes: string;
  attachments?: string[];
};

export type MutationResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export type ActivePatientsListResponse = {
  success: boolean;
  message: string;
  patients: BackendPatient[];
  total: number;
  pages: number;
  page: number;
  data: ActivePatient[];
};

export type HistoricalPatientsListResponse = {
  success: boolean;
  message: string;
  pages: number;
  page: number;
  stutus: string;
  total: number;
  data: BackendHistoricalPatient[];
};

export type StudyNote = {
  id: string;
  text: string;
  doctor: string;
  created_at: string;
  edited_at?: string | null;
};

export type BackendStudy = {
  study_id: number;
  study_type: string;
  study_date: string;
  status: string;
  notes: StudyNote[];
  images: {
    image_id: number;
    view_type: string;
    file_path: string;
    file_format: string;
  }[];
  reports: {
    report_id: number;
    report_status: string;
    created_at: string;
    report_url: string | null;
  }[];
};

export type BackendPatient = {
  national_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: "Male" | "Female";
  doctor_name: string;
  is_active: number;
  studies?: BackendStudy;
  study?: BackendStudy;
  // flat fields من الـ /recent endpoint
  study_id?: number;
  study_type?: string;
  study_date?: string;
  status?: string;
  images?: {
    image_id: number;
    view_type: string;
    file_path: string;
    file_format: string;
  }[]; // ← array
  reports?: {
    report_id: number;
    report_status: string;
    created_at: string;
    report_url: string | null;
  }[];
};

export type BackendHistoricalPatient = {
  study_id: number;
  national_id: string;
  first_name: string;
  last_name: string;
  gender?: "Male" | "Female";
  study_type?: string;
  study_date?: string;
  x_rays?: string | null;
  image_count?: number;
  doctor_name?: string;
};

export type { UpdatePatientPayload } from "@/lib/types/receptionist";

