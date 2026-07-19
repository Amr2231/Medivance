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
import { OPEN_ADD_PATIENT_SIGNAL } from "@/lib/constants/ui-signals.constants";

export function CreatePatientSidebarButton() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <TooltipProvider>
      <SidebarMenu className="px-1 pb-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Add Patient"
            className="justify-center bg-emerald-800 font-medium text-white shadow-sm shadow-emerald-800/30 hover:bg-emerald-900 hover:text-white"
          >
            {/* No ?openAdd=1 in the URL on purpose — that param never got
                stripped, so once you closed the modal the URL still said
                openAdd=1 and clicking this link again did nothing (same
                URL = no navigation = no remount = nothing re-reads the
                param). The intent to open the modal travels via a
                CustomEvent (page already mounted) and sessionStorage (page
                mounts fresh after navigating in from elsewhere) instead. */}
            <Link
              href="/receptionist/patients"
              onClick={() => {
                sessionStorage.setItem(OPEN_ADD_PATIENT_SIGNAL, "1");
                window.dispatchEvent(new Event(OPEN_ADD_PATIENT_SIGNAL));
              }}
            >
              <Plus className="size-4 shrink-0" />
              {!isCollapsed && <span className="text-sm">Add Patient</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </TooltipProvider>
  );
}
