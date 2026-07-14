import {
  LayoutDashboard,
  Users,
  Clock,
  GitCompare,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

export type DoctorNavItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

export type DoctorNavGroup = {
  label: string;
  items: DoctorNavItem[];
};

export const DOCTOR_NAV_GROUPS: DoctorNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/doctor/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/doctor/analytics", icon: BarChart3 },
      {
        title: "Today's Schedule",
        url: "/doctor/schedule",
        icon: CalendarCheck,
      },
    ],
  },
  {
    label: "Patients",
    items: [
      { title: "Patients", url: "/doctor/patients", icon: Users },
      {
        title: "Compare Visits",
        url: "/doctor/compare-visits",
        icon: GitCompare,
      },
    ],
  },
  {
    label: "Clinical",
    items: [{ title: "Follow-Ups", url: "/doctor/follow-ups", icon: Clock }],
  },
  {
    label: "Communication",
    items: [
      {
        title: "Internal Chat",
        url: "/doctor/chat",
        icon: MessageSquare,
        badge: "chat",
      },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", url: "/doctor/settings", icon: Settings }],
  },
];

export const DOCTOR_BREADCRUMB_LABELS: Record<string, string> = {
  doctor: "Doctor",
  dashboard: "Dashboard",
  analytics: "Analytics",
  schedule: "Schedule",
  patients: "Patients",
  "follow-ups": "Follow-Ups",
  "compare-visits": "Compare Visits",
  chat: "Chat",
  settings: "Settings",
  profile: "Patient Profile",
  report: "Report",
};
