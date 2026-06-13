export type StudyStatus = "Scheduled" | "In Progress" | "Pending" | "Completed";

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  email?: string;
}

export interface ActivePatient {
  national_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  doctor_id: number | null;
  doctor_name: string | null;
  is_active: number;
  study_id: number;
  study_type: string;
  study_date: string;
  status: StudyStatus;
}

export type HistoricalPatient = ActivePatient;

export interface PatientsListResponse {
  success: boolean;
  message?: string;
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: ActivePatient[];
}

export interface HistoryListResponse {
  success: boolean;
  message?: string;
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: HistoricalPatient[];
}

export interface AddPatientPayload {
  national_id: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female";
  phone_number: string;
  doctor_id: number;
  study_type: string;
  study_date: string;
}

export interface UpdatePatientPayload {
  first_name?: string;
  last_name?: string;
  national_id?: string;
  phone_number?: string;
  gender?: "Male" | "Female";
  doctor_id?: number;
  study_type?: string;
  study_date?: string;
}

export interface MutationResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface ActiveFiltersProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filterDoctor: string;
  setFilterDoctor: (v: string) => void;
  filterStudy: string;
  setFilterStudy: (v: string) => void;
  filterDate: string;
  setFilterDate: (v: string) => void;
  sortDate: "newest" | "oldest";
  setSortDate: (v: "newest" | "oldest") => void;
}

export interface HistoricalFiltersProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filterStudy: string;
  setFilterStudy: (v: string) => void;
  filterDate: string;
  setFilterDate: (v: string) => void;
  sortDate: "newest" | "oldest";
  setSortDate: (v: "newest" | "oldest") => void;
}


