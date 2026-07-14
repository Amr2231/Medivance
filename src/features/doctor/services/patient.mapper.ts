import type {
  ActivePatient,
  BackendHistoricalPatient,
  BackendPatient,
  HistoricalPatient,
  ReportStatus,
  StudyNote,
} from "@/lib/types/doctor";

export function getLatestStudyNoteText(
  notes: StudyNote[] | undefined | null,
): string | null {
  if (!Array.isArray(notes) || notes.length === 0) return null;
  const sorted = [...notes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const text = sorted[0]?.text?.trim();
  return text || null;
}

function mapReportStatus(raw?: string): ReportStatus {
  const value = (raw ?? "not written").toLowerCase();
  if (value === "signed") return "signed";
  if (value === "written") return "written";
  return "not written";
}

function resolveStudy(patient: BackendPatient) {
  if (patient.study) return patient.study;
  if (patient.studies) return patient.studies;

  // flat response
  if (patient.study_id) {
    return {
      study_id: patient.study_id,
      study_type: patient.study_type ?? "",
      study_date: patient.study_date ?? "",
      status: patient.status ?? "Scheduled",
      notes: [],
      images: patient.images ?? [],
      reports: patient.reports ?? [],
    };
  }

  return null;
}

export function mapBackendPatientToActive(
  patient: BackendPatient,
): ActivePatient {
  const study = resolveStudy(patient);
  if (!study) {
    throw new Error(`No study found for patient ${patient.national_id}`);
  }
  const patientStatus = study.status as ActivePatient["patient_status"];

  return {
    id: String(study.study_id),
    national_id: patient.national_id,
    first_name: patient.first_name,
    last_name: patient.last_name,
    gender: patient.gender,
    study: study.study_type,
    received_date: study.study_date?.slice(0, 10) ?? "",
    studies: study,
    x_rays: study.images.length > 0 ? study.images[0].file_path : null,
    image_numbers: study.images.length,
    report_status: mapReportStatus(study.reports?.[0]?.report_status),
    patient_status: patientStatus,
    status: patientStatus,
    notes: getLatestStudyNoteText(study.notes),
    description: getLatestStudyNoteText(study.notes),
    assigned_doctor: patient.doctor_name ?? "",
    doctor_specialty: "",
  };
}

export function mapBackendHistoricalPatient(
  patient: BackendHistoricalPatient,
): HistoricalPatient {
  const patientStatus = "Completed" as const;

  return {
    id: String(patient.study_id ?? patient.national_id),
    national_id: patient.national_id,
    first_name: patient.first_name,
    last_name: patient.last_name,
    gender: patient.gender ?? "Male",
    x_rays: patient.x_rays ?? null,
    report_status: "signed",
    study: patient.study_type ?? "",
    received_date: patient.study_date?.slice(0, 10) ?? "",
    notes: null,
    description: null,
    image_numbers: patient.image_count ?? 0,
    patient_status: patientStatus,
    status: patientStatus,
    assigned_doctor: patient.doctor_name ?? "",
    doctor_specialty: "",
    studies: {
      study_id: patient.study_id,
      study_type: patient.study_type ?? "",
      study_date: patient.study_date ?? "",
      status: patientStatus,
      notes: [],
      images: [],
      reports: [],
    },
  };
}
