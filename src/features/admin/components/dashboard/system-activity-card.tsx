"use client";

import {
  Activity,
  Brain,
  FileSignature,
  ImagePlus,
  LogIn,
  LogOut,
  ShieldOff,
  UserCog,
  UserPlus,
  UserX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion/variants";
import { formatRelativeTime } from "@/lib/utils/date-format";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuditLogs } from "../../hooks/use-audit-logs";
import type { AuditAction } from "@/lib/types/audit-logs";

// icon per audit action — mirrors the palette in action-badge.tsx
const ACTION_ICON: Partial<Record<AuditAction, LucideIcon>> = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  AI_RUN: Brain,
  AI_APPROVE: Brain,
  AI_REJECT: Brain,
  AI_EDIT: Brain,
  REPORT_SIGNED: FileSignature,
  IMAGE_UPLOAD: ImagePlus,
  USER_CREATE: UserPlus,
  USER_DEACTIVATE: UserX,
  USER_REACTIVATE: UserCog,
  DOCTOR_REASSIGN: UserCog,
  PATIENT_DEACTIVATE: ShieldOff,
};

function actionTitle(action: string) {
  return action
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export function SystemActivityCard() {
  const { data, isLoading } = useAuditLogs({
    limit: 4,
    sort: "created_at",
    order: "DESC",
  });

  const logs = data?.data ?? [];

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 transition-shadow duration-200 hover:shadow-glow-sm"
    >
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        System Activity
      </p>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <PulseLoader />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState icon={Activity} title="No recent activity" />
      ) : (
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {logs.map((log, i) => {
            const Icon = ACTION_ICON[log.action as AuditAction] ?? Activity;
            return (
              <motion.div
                key={`${log.audit_log_id ?? log.id}-${i}`}
                variants={staggerItem}
                className="flex items-start gap-3"
              >
                <div className="p-1.5 rounded-lg bg-[image:var(--brand-gradient-soft)] shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {actionTitle(log.action)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {log.description ?? `${log.entity} · ${log.actor_name ?? "System"}`}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 tabular-nums">
                    {formatRelativeTime(log.created_at)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
