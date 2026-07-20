import { AppointmentsPage } from "@/features/receptionist/operations";

// metadata for receptionist appointments page
export const metadata = {
  title: "Appointments | Medivance",
  description: "View and manage your appointments in the Receptionist Portal",
};

// Receptionist Appointments Page
export default function Page() {
  return <AppointmentsPage />;
}
