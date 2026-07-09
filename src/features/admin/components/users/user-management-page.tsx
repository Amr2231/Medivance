"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Users2 } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { activeIndicatorTransition } from "@/lib/motion/variants";
import { UsersTable } from "./users-table";
import { InactiveUsersTable } from "./inactive-users-table";
import { DeactivatedPatientsTable } from "./deactivated-patients-table";
import { OPEN_ADD_USER_SIGNAL } from "@/lib/constants/ui-signals.constants";

// tabs
const TABS = [
  { id: "users", label: "Users" },
  { id: "inactive", label: "Inactive Users" },
  { id: "patients", label: "Deactivated Patients" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isTabId(value: string | null): value is TabId {
  return TABS.some((t) => t.id === value);
}

// Component
export function UserManagementPage() {
  // read the requested tab from the URL — the sidebar's "Create User"
  // shortcut links here with ?tab=users so it always lands on the right tab
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");

  // state
  const [activeTab, setActiveTab] = useState<TabId>(
    isTabId(requestedTab) ? requestedTab : "users",
  );
  const [addUserOpen, setAddUserOpen] = useState(false);

  // Keep the tab synced with ?tab=... even when this page was already
  // mounted (e.g. clicking the sidebar's "Create User" shortcut while
  // already on Users management — a same-page navigation doesn't remount
  // the component, so the useState initializer above wouldn't rerun).
  useEffect(() => {
    if (isTabId(requestedTab) && requestedTab !== activeTab) {
      setActiveTab(requestedTab);
    }
    // Only re-sync when the URL's tab param itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedTab]);

  // The sidebar's "Create User" shortcut signals through a CustomEvent
  // (this page is already mounted) and sessionStorage (this page mounts
  // fresh after navigating in from elsewhere) instead of a URL param, so
  // the address bar never flashes a query string that gets stripped right
  // after. Either way, land on the Users tab and open the modal.
  useEffect(() => {
    const openAddUser = () => {
      setActiveTab("users");
      setAddUserOpen(true);
    };
    if (sessionStorage.getItem(OPEN_ADD_USER_SIGNAL) === "1") {
      sessionStorage.removeItem(OPEN_ADD_USER_SIGNAL);
      openAddUser();
    }
    window.addEventListener(OPEN_ADD_USER_SIGNAL, openAddUser);
    return () => window.removeEventListener(OPEN_ADD_USER_SIGNAL, openAddUser);
  }, []);

  return (
    <div className="space-y-5 p-5">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-3"
      >
        <span className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <Users2 className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage system access, roles, inactive accounts, and deactivated
            patients.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors -mb-px",
              activeTab === tab.id
                ? "text-emerald-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400",
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                layoutId="user-mgmt-tab-indicator"
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-emerald-600"
                transition={activeIndicatorTransition}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "users" && (
        <UsersTable
          addUserOpen={addUserOpen}
          onAddUserOpenChange={setAddUserOpen}
        />
      )}
      {activeTab === "inactive" && <InactiveUsersTable />}
      {activeTab === "patients" && <DeactivatedPatientsTable />}
    </div>
  );
}
