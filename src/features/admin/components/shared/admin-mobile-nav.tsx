"use client";

import {
  MobileBottomNav,
  type MobileNavItem,
} from "@/components/ui/mobile-bottom-nav";
import { useChatUnread } from "@/features/doctor/hooks/use-chat";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";

const ADMIN_MOBILE_ITEMS: MobileNavItem[] = [
  { title: "Home", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users, exact: true },
  { title: "Security", url: "/admin/security", icon: ShieldAlert },
  { title: "Chat", url: "/admin/chat", icon: MessageSquare, badge: "chat" },
];

export function AdminMobileNav() {
  const { data: unreadData } = useChatUnread();
  const unreadCount = unreadData?.unread ?? 0;

  return <MobileBottomNav items={ADMIN_MOBILE_ITEMS} unreadCount={unreadCount} />;
}
