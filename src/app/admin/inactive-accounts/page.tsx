import { redirect } from "next/navigation";

// redirect to /admin/users
export default function InactiveAccountsRedirectPage() {
  redirect("/admin/users");
}
