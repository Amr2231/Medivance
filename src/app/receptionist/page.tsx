import { redirect } from "next/navigation";

// metadata for receptionist root page
export const metadata = {
  title: "Receptionist | Medivance",
  description: "Medivance receptionist portal",
};

// default export for the ReceptionistPage
export default function Page() {
  redirect("/receptionist/dashboard");
}
