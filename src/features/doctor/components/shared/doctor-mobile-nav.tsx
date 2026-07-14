"use client";

import {
  MobileBottomNav,
  type MobileNavItem,
} from "@/components/ui/mobile-bottom-nav";
import { useChatUnread } from "../../hooks/use-chat";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  MessageSquare,
} from "lucide-react";

const DOCTOR_MOBILE_ITEMS: MobileNavItem[] = [
  { title: "Home", url: "/doctor/dashboard", icon: LayoutDashboard },
  { title: "Patients", url: "/doctor/patients", icon: Users },
  { title: "Schedule", url: "/doctor/schedule", icon: CalendarCheck },
  { title: "Chat", url: "/doctor/chat", icon: MessageSquare, badge: "chat" },
];

export function DoctorMobileNav() {
  const { data: unreadData } = useChatUnread();
  const unreadCount = unreadData?.unread ?? 0;

  return <MobileBottomNav items={DOCTOR_MOBILE_ITEMS} unreadCount={unreadCount} />;
}
