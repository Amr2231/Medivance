import { redirect } from "next/navigation";

// Patient creation now happens in the multi-step modal on the Patients page.
export default function AddPatientPage() {
  redirect("/receptionist/patients?openAdd=1");
}
