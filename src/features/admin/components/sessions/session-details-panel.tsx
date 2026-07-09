"use client";

import { Radio } from "lucide-react";
import type { ActiveSession } from "@/lib/types/admin-features";
import { EmptyState } from "@/components/ui/empty-state";
import { SessionDetailsContent } from "./session-details-content";

// types
type SessionDetailsPanelProps = {
  session: ActiveSession | null;
  onForceLogout: (session: ActiveSession) => void;
  logoutPending?: boolean;
};

// component
export function SessionDetailsPanel({
  session,
  onForceLogout,
  logoutPending,
}: SessionDetailsPanelProps) {
  return (
    <div className="hidden lg:block rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-5 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Session Details
        </p>
        {session && (
          <span className="text-[10px] font-mono text-gray-300 dark:text-gray-600">
            ID: {session.user_id}
          </span>
        )}
      </div>

      {session ? (
        <SessionDetailsContent
          session={session}
          onForceLogout={onForceLogout}
          logoutPending={logoutPending}
        />
      ) : (
        <EmptyState
          icon={Radio}
          title="No session selected"
          description="Select a row from the table to view its details."
        />
      )}
    </div>
  );
}
