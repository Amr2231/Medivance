import { TeamSwitcher } from "@/components/ui/team-switcher";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { AdminNavGroups } from "./shared/admin-nav-groups";
import { CreateUserSidebarButton } from "./shared/create-user-sidebar-button";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* team switcher */}
        <TeamSwitcher
          teams={[
            {
              name: "Medivance",
              plan: "Hospital Admin",
            },
          ]}
        />
        {/* create user shortcut — sits right under the hospital name */}
        <CreateUserSidebarButton />
      </SidebarHeader>
      <SidebarContent>
        <AdminNavGroups />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
