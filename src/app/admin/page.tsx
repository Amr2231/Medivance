import { redirect } from "next/navigation";

// metadata for admin root page
export const metadata = {
  title: "Admin | Medivance",
  description: "Medivance admin portal",
};

// Admin Page Redirect
export default function AdminPage() {
  redirect("/admin/dashboard");
}
