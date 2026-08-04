import { redirect } from "next/navigation";

// metadata for doctor root page
export const metadata = {
  title: "Doctor | Medivance",
  description: "Medivance doctor portal",
};

// default export for the DoctorPage
export default function DoctorPage() {
  redirect("/doctor/dashboard");
}
