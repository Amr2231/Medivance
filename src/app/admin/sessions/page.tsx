import { SessionManagementPage } from "@/features/admin";

// metadata for sessions page
export const metadata = {
  title: "Sessions | Medivance",
  description: "View and manage audit logs for your Medivance account",
};

// Sessions Page
export default function SessionsPage() {
  return <SessionManagementPage />;
}
