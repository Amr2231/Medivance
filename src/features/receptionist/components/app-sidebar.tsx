import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ReceptionNavGroups } from "./reception-nav-groups";
import { CreatePatientSidebarButton } from "./create-patient-sidebar-button";

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: "Medivance",
              plan: "Hospital",
            },
          ]}
        />
        <CreatePatientSidebarButton />
      </SidebarHeader>
      <SidebarContent>
        <ReceptionNavGroups />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
