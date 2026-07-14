"use client";

import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/tailwind-merge";
import { DoctorLoadingState, DoctorTableCard, PatientAvatar } from "../shared/ui";
import {
  useRemoveFromWatchlist,
  useWatchlist,
} from "../../hooks/use-watchlist";

const PRIORITY_STYLES: Record<string, string> = {
  critical:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  monitor:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  stable:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
};

// Component — content only (no page shell), meant to be embedded as a tab
// inside the unified Patients page (see patients-hub-page.tsx).
export function WatchlistTable() {
  const { data, isLoading } = useWatchlist();
  const { mutate: remove } = useRemoveFromWatchlist();
  const items = data?.data ?? [];

  if (isLoading) return <DoctorLoadingState />;

  return (
    <DoctorTableCard
      footer={
        items.length > 0 ? (
          <p className="text-sm text-gray-500">
            Showing {items.length} of {items.length} watched patients
          </p>
        ) : undefined
      }
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50">
            {["Patient", "Priority", "Latest Note", "Actions"].map(
              (h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 first:pl-4"
                >
                  {h}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10">
                <EmptyState
                  icon={Star}
                  title="Watchlist is empty"
                  description="Star patients from the Active Patients tab."
                />
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-900/40 group"
              >
                <TableCell className="pl-4 py-3">
                  <Link
                    href={`/doctor/patients/profile/${item.national_id}`}
                    className="flex items-center gap-3 group/link"
                  >
                    <PatientAvatar
                      firstName={item.first_name}
                      lastName={item.last_name}
                      study={item.study_type}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate group-hover/link:underline">
                        {item.first_name} {item.last_name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {item.national_id}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                      PRIORITY_STYLES[item.priority] ??
                        PRIORITY_STYLES.monitor,
                    )}
                  >
                    {item.priority}
                  </span>
                </TableCell>
                <TableCell
                  className="text-sm text-gray-500 max-w-xs truncate"
                  title={item.latest_study_note || item.note || undefined}
                >
                  {item.latest_study_note || item.note || "—"}
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-emerald-800"
                      onClick={() => remove(item.national_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </DoctorTableCard>
  );
}
