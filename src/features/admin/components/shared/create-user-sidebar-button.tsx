"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OPEN_ADD_USER_SIGNAL } from "@/lib/constants/ui-signals.constants";

export function CreateUserSidebarButton() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <TooltipProvider>
      <SidebarMenu className="px-1 pb-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Create User"
            className="bg-emerald-800 text-white hover:bg-emerald-900 hover:text-white shadow-sm shadow-emerald-800/30 font-medium justify-center"
          >
            {/* No ?openAdd=1 in the URL on purpose — that param used to get
                stripped right after navigation, which flashed briefly in the
                address bar. The intent to open the modal travels via a
                CustomEvent (page already mounted, e.g. we're already on
                /admin/users) and sessionStorage (page mounts fresh after
                navigating in from elsewhere) instead, so the URL stays
                clean either way. */}
            <Link
              href="/admin/users?tab=users"
              onClick={() => {
                sessionStorage.setItem(OPEN_ADD_USER_SIGNAL, "1");
                window.dispatchEvent(new Event(OPEN_ADD_USER_SIGNAL));
              }}
            >
              <Plus className="size-4 shrink-0" />
              {!isCollapsed && <span className="text-sm">Create User</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </TooltipProvider>
  );
}
