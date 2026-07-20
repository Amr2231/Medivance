import { PatientsTable } from "@/features/receptionist";

// metadata for receptionist patients page
export const metadata = {
  title: "Patients | Medivance",
  description: "View and manage your patients in the Receptionist Portal",
};

// default export for receptionist patients page
export default function PatientsPage() {
  return <PatientsTable />;
}
