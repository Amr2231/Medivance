import { redirect } from "next/navigation";

// This page now lives inside the unified Patients hub as the "Recent" tab.
export default function Page() {
  redirect("/doctor/patients?tab=recent");
}
