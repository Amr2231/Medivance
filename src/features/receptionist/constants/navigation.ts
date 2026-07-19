import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
  Workflow,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

export type ReceptionNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
};

export type ReceptionNavGroup = {
  label: string;
  items: ReceptionNavItem[];
};

export const RECEPTION_NAV_GROUPS: ReceptionNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/receptionist/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Today's Appointments",
        url: "/receptionist/appointments",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Patient Flow", url: "/receptionist/arrival-board", icon: Workflow },
      {
        title: "Smart Scheduling",
        url: "/receptionist/scheduling",
        icon: Sparkles,
      },
    ],
  },
  {
    label: "Patients",
    items: [
      { title: "Patients", url: "/receptionist/patients", icon: Users },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        title: "Internal Chat",
        url: "/receptionist/chat",
        icon: MessageSquare,
        badge: "chat",
      },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/receptionist/settings", icon: Settings },
    ],
  },
];
