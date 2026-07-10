import { AddUserForm } from "@/features/admin";

// metadata for add user page
export const metadata = {
  title: "Add User | Medivance",
  description: "Add a new user to your Medivance account",
};

// Add User Page
export default function AddUserPage() {
  return (
    <div className="p-6 lg:p-8">
      <AddUserForm />
    </div>
  );
}
