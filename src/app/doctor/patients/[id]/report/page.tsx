import { ReportForm } from "@/features/doctor";

// metadata for report page
export const metadata = {
  title: "Report | Medivance",
  description: "Generate a report for a patient in the Doctor Portal",
};

// Report Page
export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // get patient id
  const { id } = await params;
  return <ReportForm patientId={id} />;
}
