import { UserManagementPage } from "@/features/admin/components/users/user-management-page";

// metadata for users page
export const metadata = {
  title: "Users | Medivance",
  description:
    "View and manage users, inactive accounts, and patients for your Medivance account",
};

// Users Page (merged Users / Inactive Users / Deactivated Patients tabs)
export default function UsersPage() {
  return <UserManagementPage />;
}
