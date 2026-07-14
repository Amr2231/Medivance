import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon } from "lucide-react";
import { DoctorNavGroups } from "./shared/doctor-nav-groups";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const data = {
    teams: [
      {
        name: "Medivance",
        logo: <GalleryVerticalEndIcon />,
        plan: "Doctor Portal",
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <DoctorNavGroups />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
