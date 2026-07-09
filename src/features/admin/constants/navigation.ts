import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Settings,
  ShieldAlert,
  Users,
  Wifi,
} from "lucide-react";

// types
export type AdminNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Live Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "User Management",
    items: [
      { title: "Users", url: "/admin/users", icon: Users, exact: true },
    ],
  },
  {
    label: "Security",
    items: [
      { title: "Security Center", url: "/admin/security", icon: ShieldAlert },
      { title: "Session Management", url: "/admin/sessions", icon: Wifi },
      { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        title: "Internal Chat",
        url: "/admin/chat",
        icon: MessageSquare,
        badge: "chat",
      },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", url: "/admin/settings", icon: Settings }],
  },
];

// breadcrumbs
export const ADMIN_BREADCRUMB_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Live Dashboard",
  analytics: "Analytics",
  users: "Users",
  add: "Create User",
  "inactive-accounts": "Inactive Accounts",
  security: "Security Center",
  sessions: "Session Management",
  "audit-logs": "Audit Logs",
  chat: "Internal Chat",
  settings: "Settings",
};
