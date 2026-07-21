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

// metadata for receptionist settings page
export const metadata = {
  title: "Settings | Medivance",
  description: "Manage your account settings in the Receptionist Portal",
};

// receptionist settings page
export default async function ReceptionistSettingsPage() {
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
          <NotificationsPageContent role="Receptionist" />
        </SettingsSectionCard>
      }
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
        {/* settings date row */}
        <SettingsInfoRow
          label="Member Since"
          value={
            session?.user?.created_at
              ? new Date(session.user.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
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
