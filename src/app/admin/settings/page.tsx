import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  ChangePasswordForm,
  DeleteAccountSection,
  PersonalInfoForm,
  SettingsInfoRow,
  SettingsPageLayout,
  SettingsSectionCard,
} from "@/features/settings";
import { NotificationsPageContent } from "@/features/notifications";

// metadata for settings page
export const metadata = {
  title: "Settings | Medivance",
  description: "Manage your account settings and preferences",
};

// settings page
export default async function AdminSettingsPage() {
  // get session data
  const session = await getServerSession(authOptions);

  return (
    <SettingsPageLayout
      sections={[
        { id: "profile-details", title: "Profile Details" },
        { id: "password-security", title: "Password & Security" },
        { id: "notifications", title: "Notifications" },
        { id: "account-information", title: "Account Information" },
        { id: "danger-zone", title: "Danger Zone" },
      ]}
      notifications={
        <SettingsSectionCard id="notifications" title="Notifications">
          {/* notifications content, reused from the old standalone page */}
          <NotificationsPageContent role="Admin" />
        </SettingsSectionCard>
      }
      extraLinks={[
        { label: "Team Roster", href: "/admin/users", icon: "users" },
        { label: "Audit Logs", href: "/admin/audit-logs", icon: "audit-logs" },
      ]}
    >
      {/* settings section card */}
      <SettingsSectionCard id="profile-details" title="Profile Details">
        {/* personal info form */}
        <PersonalInfoForm />
      </SettingsSectionCard>

      {/* settings section card */}
      <SettingsSectionCard id="password-security" title="Password & Security">
        {/* change password form */}
        <ChangePasswordForm variant="admin" />
      </SettingsSectionCard>

      {/* settings section card */}
      <SettingsSectionCard id="account-information" title="Account Information">
        {/* settings label row */}
        <SettingsInfoRow label="Role" value={session?.user?.role ?? "N/A"} />
        {/* settings status row */}
        <SettingsInfoRow
          label="Account Status"
          value={session?.user?.account_status ?? "N/A"}
          valueClassName={
            session?.user?.account_status === "Active"
              ? "text-green-600"
              : "text-red-600"
          }
        />
        {/* settings member since row */}
        <SettingsInfoRow
          label="Member Since"
          value={
            session?.user?.created_at
              ? new Date(session.user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : "N/A"
          }
        />
      </SettingsSectionCard>

      {/* settings section card */}
      <SettingsSectionCard id="danger-zone" title="Danger Zone">
        {/* delete account section */}
        <DeleteAccountSection />
      </SettingsSectionCard>
    </SettingsPageLayout>
  );
}
