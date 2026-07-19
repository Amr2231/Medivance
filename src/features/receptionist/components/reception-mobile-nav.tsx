"use client";

import {
  MobileBottomNav,
  type MobileNavItem,
} from "@/components/ui/mobile-bottom-nav";
import { useChatInbox } from "@/features/receptionist/operations/hooks";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
} from "lucide-react";

const RECEPTION_MOBILE_ITEMS: MobileNavItem[] = [
  { title: "Home", url: "/receptionist/dashboard", icon: LayoutDashboard },
  {
    title: "Appointments",
    url: "/receptionist/appointments",
    icon: CalendarDays,
  },
  { title: "Patients", url: "/receptionist/patients", icon: Users },
  {
    title: "Chat",
    url: "/receptionist/chat",
    icon: MessageSquare,
    badge: "chat",
  },
];

export function ReceptionMobileNav() {
  const { data: inbox = [] } = useChatInbox();
  const unreadCount = inbox.reduce((sum, c) => sum + (c.unread_count ?? 0), 0);

  return (
    <MobileBottomNav items={RECEPTION_MOBILE_ITEMS} unreadCount={unreadCount} />
  );
}
