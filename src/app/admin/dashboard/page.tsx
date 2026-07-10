import { LiveDashboardPage } from "@/features/admin";

// metadata for dashboard page
export const metadata = {
  title: "Dashboard | Medivance",
  description: "View and manage your Medivance account dashboard",
};

// Dashboard Page
export default function DashboardPage() {
  return <LiveDashboardPage />;
}
