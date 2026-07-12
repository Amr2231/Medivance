"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldAlert } from "lucide-react";

// AuditLogsError component
export default function AuditLogsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 p-6">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {/* Display error message or fallback message */}
        <EmptyState
          title="Failed to load audit logs"
          description={
            error.digest
              ? `Error Code: ${error.digest}`
              : "An unexpected error occurred while fetching audit logs."
          }
          icon={ShieldAlert}
        />
      </p>
      <p className="text-xs text-gray-500 max-w-sm text-center">
        {/* Display error message */}
        {error.message || "An unexpected error occurred."}
      </p>
      {/* Button to try again */}
      <Button
        variant="outline"
        size="sm"
        onClick={reset}
        className="text-emerald-900 border-emerald-600/30"
      >
        Try again
      </Button>
    </div>
  );
}
