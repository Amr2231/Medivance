"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Info, ListOrdered, Sparkles, Timer } from "lucide-react";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import {
  ReceptionLoadingState,
  PriorityBadge,
  StatusBadge,
} from "../shared/ui";
import { usePriorityOverview, useUpdateAppointmentPriority } from "../../hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_LEVELS } from "../../constants";
import { EmptyState } from "@/components/ui/empty-state";
import { TableCard } from "@/components/shared/table-card";
import { PatientAvatar } from "@/components/shared/patient-avatar";

export function PriorityQueuePage() {
  const { data: queue = [], isLoading } = usePriorityOverview();
  const { mutate: updatePriority } = useUpdateAppointmentPriority();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const maxScore = Math.max(...queue.map((item) => item.priority_score), 1);
  const visibleQueue = useMemo(
    () =>
      queue.filter(
        (item) =>
          priorityFilter === "All" || item.priority_level === priorityFilter,
      ),
    [priorityFilter, queue],
  );

  if (isLoading && queue.length === 0) return <ReceptionLoadingState />;

  return (
    <ReceptionPageShell
      title="Priority Queue System"
      description="Automatic prioritization with transparent queue reasoning"
    >
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 mb-4 flex gap-3">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-emerald-900 dark:text-emerald-200">
            Priority Rules
          </p>
          <p className="text-emerald-800/80 dark:text-emerald-300/80 mt-1">
            Emergency patients are always first. VIP, Pregnant, and Senior
            Citizen levels receive elevated scores. Wait time adds +2 points per
            minute to prevent starvation.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Queue intelligence
              </p>
              <p className="mt-1 text-sm font-medium">
                Scores rebalance automatically as waiting time changes.
              </p>
            </div>
            <Sparkles className="size-6 text-emerald-600" />
          </div>
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All priorities</SelectItem>
            {PRIORITY_LEVELS.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TableCard>
        {visibleQueue.length === 0 ? (
          <EmptyState
            icon={ListOrdered}
            title="Priority Queue is Empty"
            description="There are currently no patients in the priority queue."
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900/50">
              <tr>
                <th className="px-3 py-3 pl-4 text-left text-xs font-semibold text-gray-500">
                  Position
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">
                  Patient
                </th>
                <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-500 md:table-cell">
                  Score & reason
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleQueue.map((item, i) => (
                <motion.tr
                  layout
                  key={`${item.queue_id}-${i}`}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-900/40"
                >
                  <td className="px-3 py-3 pl-4">
                    <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {item.queue_position}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <PatientAvatar
                        firstName={item.patient_name.split(" ")[0]}
                        lastName={item.patient_name
                          .split(" ")
                          .slice(1)
                          .join(" ")}
                        study={null}
                      />
                      <span className="font-medium">{item.patient_name}</span>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 md:table-cell">
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Shield className="size-3" /> Score{" "}
                      <span className="font-mono font-bold text-foreground">
                        {item.priority_score}
                      </span>
                      <Timer className="ml-2 size-3" /> {item.waiting_minutes}m
                    </p>
                    <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(8, (item.priority_score / maxScore) * 100)}%`,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
                      />
                    </div>
                    {item.priority_reason && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.priority_reason}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge label={item.board_status} />
                  </td>
                  <td className="px-3 py-3">
                    {editingId === item.appointment_id ? (
                      <Select
                        defaultValue={item.priority_level}
                        onValueChange={(value) => {
                          updatePriority({
                            id: item.appointment_id,
                            priority_level: value,
                          });
                          setEditingId(null);
                        }}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_LEVELS.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingId(item.appointment_id)}
                      >
                        <PriorityBadge label={item.priority_level} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
    </ReceptionPageShell>
  );
}
