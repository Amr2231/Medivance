"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DOCTOR_NAV_GROUPS } from "../../constants/navigation";
import { useChatUnread } from "../../hooks/use-chat";

export function DoctorNavGroups() {
  const pathname = usePathname();
  const { data: unreadData } = useChatUnread();
  const unreadCount = unreadData?.unread ?? 0;

  return (
    <>
      {DOCTOR_NAV_GROUPS.map((group) => (
        <SidebarGroup key={group.label} className="px-3 py-2">
          <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {group.items.map((item) => {
              const isActive =
                pathname === item.url ||
                (item.url !== "/doctor/dashboard" &&
                  pathname.startsWith(item.url + "/"));
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={
                      isActive
                        ? "bg-emerald-800 text-white hover:bg-emerald-800 hover:text-white shadow-sm shadow-emerald-800/30 font-medium"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent font-normal"
                    }
                  >
                    <Link href={item.url}>
                      <Icon
                        className={`size-4 shrink-0 ${isActive ? "text-white" : "text-sidebar-foreground/50"}`}
                      />
                      <span className="text-sm">{item.title}</span>
                      {item.badge === "chat" && unreadCount > 0 && (
                        <span className="ml-auto text-[10px] font-bold bg-emerald-500 text-white rounded-full min-w-4.5 text-center px-1.5 py-0.5">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
