import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for patient profile page
export const metadata = {
  title: "Patient Profile | Medivance",
  description: "View and manage patient profiles in the Doctor Portal",
};

// dynamically import the PatientProfilePage component with a loading state
const PatientProfilePage = dynamic(
  () =>
    import("@/features/doctor/components/patient-profile/patient-profile-page").then(
      (m) => m.PatientProfilePage,
    ),
  { loading: () => <PulseLoader /> },
);

// export the PatientProfilePage
export default async function Page({
  params,
}: {
  params: Promise<{ nationalId: string }>;
}) {
  // get national id
  const { nationalId } = await params;
  return <PatientProfilePage nationalId={nationalId} />;
}
