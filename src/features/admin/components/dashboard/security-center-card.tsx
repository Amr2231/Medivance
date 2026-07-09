"use client";

import Link from "next/link";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion/variants";
import { useSecurityOverview } from "../../hooks/use-security";
import { PulseLoader } from "@/components/ui/pulse-loader";

export function SecurityCenterCard() {
  const { data, isLoading } = useSecurityOverview();
  const overview = data?.data;

  const suspiciousIpCount = overview?.top_suspicious_ips.length ?? 0;

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 transition-shadow duration-200 hover:shadow-glow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Security Center
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <PulseLoader />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Failed Login Attempts
              </p>
              <p className="text-xs text-gray-400">Last 24 hours</p>
            </div>
            <span
              className={
                (overview?.failed_logins_24h ?? 0) > 5
                  ? "px-2.5 py-1 rounded-md text-sm font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 tabular-nums"
                  : "px-2.5 py-1 rounded-md text-sm font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 tabular-nums"
              }
            >
              {overview?.failed_logins_24h ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Suspicious IPs Flagged
              </p>
              <p className="text-xs text-gray-400">Repeated failed attempts</p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-sm font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 tabular-nums">
              {suspiciousIpCount}
            </span>
          </div>

          {(overview?.locked_accounts ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-3 py-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {overview?.locked_accounts} account
                {overview?.locked_accounts === 1 ? "" : "s"} currently locked
              </p>
            </div>
          )}

          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/admin/security">View Security Logs</Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
