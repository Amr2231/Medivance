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
import { TermsAcceptanceModal } from "@/components/shared/terms-acceptance-modal";

// metadata for settings page
export const metadata = {
  title: "Settings | Medivance",
  description:
    "Manage your account settings, personal information, and security preferences in the Doctor Portal",
};

// settings page
export default async function DoctorSettingsPage() {
  // get session data
  const session = await getServerSession(authOptions);

  return (
    // settings page layout — `sections` is the explicit registry driving
    // the sidebar nav (see SettingsPageLayoutProps for why this isn't
    // inferred from `children` at render time).
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
          <NotificationsPageContent role="Doctor" />
        </SettingsSectionCard>
      }
    >
      <TermsAcceptanceModal />

      {/* settings section card */}
      <SettingsSectionCard id="profile-details" title="Profile Details">
        {/* personal info form */}
        <PersonalInfoForm />
      </SettingsSectionCard>

      {/* settings section card */}
      <SettingsSectionCard id="password-security" title="Password & Security">
        {/* change password form */}
        <ChangePasswordForm variant="doctor" />
      </SettingsSectionCard>

      {/* settings section card */}
      <SettingsSectionCard id="account-information" title="Account Information">
        {/* settings label row */}
        <SettingsInfoRow label="Role" value={session?.user?.role ?? "Doctor"} />
        {/* settings status row */}
        <SettingsInfoRow
          label="Account Status"
          value={session?.user?.account_status ?? "Active"}
          valueClassName="text-green-600"
        />
        {/* settings date row */}
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
