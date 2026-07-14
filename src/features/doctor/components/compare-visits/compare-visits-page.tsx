"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Equal,
  FileText,
  GitCompare,
  Minus,
  Plus,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  formatFullTimestamp,
  formatRelativeTime,
} from "@/lib/utils/date-format";
import {
  staggerContainer,
  staggerItem,
  springSnappy,
  springSoft,
} from "@/lib/motion/variants";
import { DoctorPageShell } from "../shared/ui";
import { useHistoricalPatients } from "../../hooks/use-historical-patients";
import { useGetReport } from "../../hooks/use-report";
import { useDebounce } from "use-debounce";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SelectedVisit = {
  studyId: string;
  firstName: string;
  lastName: string;
  study: string;
  receivedDate: string;
};

type SlotKey = "A" | "B";

const SLOT_META: Record<
  SlotKey,
  { label: string; accent: string; ring: string }
> = {
  A: {
    label: "Visit A",
    accent: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-500/30",
  },
  B: {
    label: "Visit B",
    accent: "from-sky-500 to-indigo-500",
    ring: "ring-sky-500/30",
  },
};

function initialsOf(first?: string, last?: string) {
  return (
    `${first?.charAt(0) ?? ""}${last?.charAt(0) ?? ""}`.toUpperCase() || "?"
  );
}

// ---------------------------------------------------------------------------
// Picker dialog — replaces the old always-open search list with an on-demand
// "draft pick" modal, so the main page stays focused on the comparison.
// ---------------------------------------------------------------------------

function VisitPickerDialog({
  open,
  onOpenChange,
  slot,
  onPick,
  excludeStudyId,
  initialSearch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: SlotKey;
  onPick: (visit: SelectedVisit) => void;
  excludeStudyId?: string;
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const [debounced] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const LIMIT = 8;

  const { data, isLoading } = useHistoricalPatients({
    keyword: debounced.trim() || undefined,
    page,
    limit: LIMIT,
  });

  const patients = data?.patients ?? [];
  const totalPages = data?.pages ?? 1;
  const meta = SLOT_META[slot];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <DialogHeader className="p-5 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-white text-xs font-bold shrink-0",
                meta.accent,
              )}
            >
              {slot}
            </span>
            <DialogTitle>Choose {meta.label}</DialogTitle>
          </div>
          <DialogDescription>
            Pick a patient image to slot into this side of the comparison.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              autoFocus
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search patients..."
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        <div className="mt-3 max-h-72 overflow-y-auto px-2 pb-2">
          {isLoading ? (
            <div className="space-y-1.5 px-2 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">
              No matching patients
            </p>
          ) : (
            <motion.ul
              variants={staggerContainer(0.03)}
              initial="hidden"
              animate="show"
              className="space-y-1"
            >
              {patients.map((p) => {
                const sid = String(p.studies.study_id);
                const disabled = sid === excludeStudyId;
                return (
                  <motion.li key={sid} variants={staggerItem}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        onPick({
                          studyId: sid,
                          firstName: p.first_name,
                          lastName: p.last_name,
                          study: p.study,
                          receivedDate: p.received_date,
                        });
                        onOpenChange(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                        disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer",
                      )}
                    >
                      <Avatar
                        size="sm"
                        className="bg-gray-200 dark:bg-gray-800"
                      >
                        <AvatarFallback className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 bg-transparent">
                          {initialsOf(p.first_name, p.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {p.first_name} {p.last_name}
                        </span>
                        <span className="block truncate text-xs text-gray-400">
                          {p.study} · {formatFullTimestamp(p.received_date)}
                        </span>
                      </span>
                      {disabled && (
                        <span className="text-[10px] text-gray-400 shrink-0">
                          in use
                        </span>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-xs text-gray-500 disabled:opacity-40 hover:text-[#059669] cursor-pointer"
            >
              ← Prev
            </button>
            <span className="text-xs text-gray-400">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs text-gray-500 disabled:opacity-40 hover:text-[#059669] cursor-pointer"
            >
              Next →
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Slot card — the compact "fighter card" on either side of the VS badge.
// ---------------------------------------------------------------------------

function SlotCard({
  slot,
  visit,
  onOpenPicker,
  onClear,
}: {
  slot: SlotKey;
  visit: SelectedVisit | null;
  onOpenPicker: () => void;
  onClear: () => void;
}) {
  const meta = SLOT_META[slot];

  return (
    <motion.div variants={staggerItem} className="relative flex-1 min-w-0">
      <AnimatePresence mode="wait" initial={false}>
        {visit ? (
          <motion.div
            key="filled"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={springSnappy}
            className={cn(
              "relative rounded-2xl border bg-white dark:bg-gray-950 p-4 shadow-glow-sm ring-1",
              meta.ring,
              "border-gray-200 dark:border-gray-800",
            )}
          >
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2.5 right-2.5 text-gray-300 hover:text-gray-500 cursor-pointer transition-colors"
              aria-label={`Clear ${meta.label}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white text-sm font-bold shadow-glow-sm",
                  meta.accent,
                )}
              >
                {initialsOf(visit.firstName, visit.lastName)}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {meta.label}
                </p>
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {visit.firstName} {visit.lastName}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {visit.study} · {formatRelativeTime(visit.receivedDate)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenPicker}
              className="mt-3 w-full rounded-lg border border-dashed border-gray-200 dark:border-gray-800 py-1.5 text-xs text-gray-400 hover:text-[#059669] hover:border-[#059669]/40 cursor-pointer transition-colors"
            >
              Change visit
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            onClick={onOpenPicker}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={springSnappy}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-7 cursor-pointer transition-colors",
              "border-gray-200 dark:border-gray-800 hover:border-[#059669]/50",
              "bg-gray-50/60 dark:bg-gray-900/40",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-white opacity-70 group-hover:opacity-100 transition-opacity",
                meta.accent,
              )}
            >
              <Plus className="w-4.5 h-4.5" />
            </span>
            <span className="text-xs font-medium text-gray-500 group-hover:text-[#059669]">
              Select {meta.label}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// VS connector — purely decorative, ties the two slots together visually.
// ---------------------------------------------------------------------------

function VsConnector({ active }: { active: boolean }) {
  return (
    <motion.div
      variants={staggerItem}
      className="flex sm:flex-col items-center justify-center gap-2 shrink-0 sm:w-16"
    >
      <span className="hidden sm:block h-px flex-1 w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <motion.span
        animate={
          active
            ? {
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 0 0 rgba(5,150,105,0.25)",
                  "0 0 0 8px rgba(5,150,105,0)",
                  "0 0 0 0 rgba(5,150,105,0)",
                ],
              }
            : {}
        }
        transition={{
          duration: 1.8,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-extrabold tracking-tight shrink-0",
          "bg-[image:var(--brand-gradient)] text-white shadow-glow-sm",
        )}
      >
        VS
      </motion.span>
      <span className="hidden sm:block h-px flex-1 w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Comparison rows
// ---------------------------------------------------------------------------

function DiagnosisRow({
  label,
  icon: Icon,
  valueA,
  valueB,
  loadingA,
  loadingB,
  multiline,
}: {
  label: string;
  icon: React.ElementType;
  valueA?: string | null;
  valueB?: string | null;
  loadingA?: boolean;
  loadingB?: boolean;
  multiline?: boolean;
}) {
  const same =
    !loadingA &&
    !loadingB &&
    (valueA ?? "").trim().toLowerCase() ===
      (valueB ?? "").trim().toLowerCase() &&
    (valueA ?? "").trim().length > 0;

  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </div>
        {same && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
            <Equal className="w-3 h-3" /> Matches
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
        {[
          { side: "A" as SlotKey, value: valueA, loading: loadingA },
          { side: "B" as SlotKey, value: valueB, loading: loadingB },
        ].map(({ side, value, loading }) => (
          <div key={side} className="px-4 py-3">
            {loading ? (
              <Skeleton className="h-4 w-4/5" />
            ) : (
              <p
                className={cn(
                  "text-sm text-gray-800 dark:text-gray-200",
                  multiline && "whitespace-pre-wrap",
                  !value && "text-gray-300 dark:text-gray-700 italic",
                )}
              >
                {value || "No data"}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function EfDeltaRow({
  efA,
  efB,
  loadingA,
  loadingB,
}: {
  efA?: number | null;
  efB?: number | null;
  loadingA?: boolean;
  loadingB?: boolean;
}) {
  const hasBoth = efA != null && efB != null;
  const delta = hasBoth ? Math.round((efB! - efA!) * 10) / 10 : null;
  const DeltaIcon =
    delta == null || delta === 0
      ? Minus
      : delta > 0
        ? TrendingUp
        : TrendingDown;
  const deltaColor =
    delta == null || delta === 0
      ? "text-gray-400 bg-gray-100 dark:bg-gray-800"
      : delta > 0
        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50"
        : "text-rose-600 bg-rose-50 dark:bg-rose-950/50";

  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Sparkles className="w-3.5 h-3.5" />
          Ejection Fraction
        </div>
        {hasBoth && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              deltaColor,
            )}
          >
            <DeltaIcon className="w-3 h-3" />
            {delta === 0 ? "No change" : `${delta! > 0 ? "+" : ""}${delta}%`}
          </span>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="text-center">
          {loadingA ? (
            <Skeleton className="mx-auto h-7 w-14" />
          ) : (
            <p className="text-2xl font-bold text-emerald-600">
              {efA != null ? `${efA}%` : "—"}
            </p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
        <div className="text-center">
          {loadingB ? (
            <Skeleton className="mx-auto h-7 w-14" />
          ) : (
            <p className="text-2xl font-bold text-sky-600">
              {efB != null ? `${efB}%` : "—"}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function OpenStudyFooter({
  visitA,
  visitB,
}: {
  visitA: SelectedVisit;
  visitB: SelectedVisit;
}) {
  return (
    <motion.div variants={staggerItem} className="grid grid-cols-2 gap-3 pt-1">
      {[visitA, visitB].map((v, i) => (
        <Link
          key={v.studyId}
          href={`/doctor/patients/${v.studyId}/report`}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-800 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors",
            i === 0
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-sky-700 dark:text-sky-400",
          )}
        >
          Open {SLOT_META[i === 0 ? "A" : "B"].label} full image
          <ArrowRight className="w-3 h-3" />
        </Link>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Result panel wiring for report data on a resolved study.
// ---------------------------------------------------------------------------

function useVisitData(studyId?: string) {
  const { data: reportResponse, isLoading: reportLoading } = useGetReport(
    studyId ?? "",
  );
  const report = reportResponse as
    | { notes?: string; data?: { notes?: string } }
    | undefined;

  return {
    notes: (report?.data?.notes ?? report?.notes) as string | undefined,
    loading: Boolean(studyId) && reportLoading,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function CompareVisitsPage({
  initialNationalId,
}: {
  initialNationalId?: string;
}) {
  const [visitA, setVisitA] = useState<SelectedVisit | null>(null);
  const [visitB, setVisitB] = useState<SelectedVisit | null>(null);
  const [openSlot, setOpenSlot] = useState<SlotKey | null>(null);

  const dataA = useVisitData(visitA?.studyId);
  const dataB = useVisitData(visitB?.studyId);

  const sameVisit = Boolean(
    visitA && visitB && visitA.studyId === visitB.studyId,
  );
  const bothSelected = Boolean(visitA && visitB && !sameVisit);
  const stateKey =
    !visitA || !visitB ? "empty" : sameVisit ? "duplicate" : "compare";

  const swap = () => {
    const a = visitA;
    setVisitA(visitB);
    setVisitB(a);
  };

  return (
    <DoctorPageShell
      title="Compare Visits"
      description="A side-by-side, head-to-head look at two patient images"
    >
      {/* Battle picker row */}
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row items-stretch gap-3"
      >
        <SlotCard
          slot="A"
          visit={visitA}
          onOpenPicker={() => setOpenSlot("A")}
          onClear={() => setVisitA(null)}
        />
        <VsConnector active={bothSelected} />
        <SlotCard
          slot="B"
          visit={visitB}
          onOpenPicker={() => setOpenSlot("B")}
          onClear={() => setVisitB(null)}
        />
      </motion.div>

      {visitA && visitB && !sameVisit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center -mt-2"
        >
          <button
            type="button"
            onClick={swap}
            className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-[#059669] cursor-pointer transition-colors"
          >
            <ArrowLeftRight className="w-3 h-3" />
            Swap sides
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {stateKey === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={springSoft}
          >
            <EmptyState
              icon={GitCompare}
              title="Select two visits to begin"
              description="Tap either card above to pull a patient image into the comparison."
            />
          </motion.div>
        )}

        {stateKey === "duplicate" && (
          <motion.div
            key="duplicate"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={springSoft}
          >
            <EmptyState
              icon={GitCompare}
              title="Different visits required"
              description="Both sides point to the same image — pick a different one."
            />
          </motion.div>
        )}

        {stateKey === "compare" && visitA && visitB && (
          <motion.div
            key={`${visitA.studyId}-${visitB.studyId}`}
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -6 }}
            className="space-y-3"
          >
            <DiagnosisRow
              label="Report Notes"
              icon={FileText}
              valueA={dataA.notes}
              valueB={dataB.notes}
              loadingA={dataA.loading}
              loadingB={dataB.loading}
              multiline
            />
            <OpenStudyFooter visitA={visitA} visitB={visitB} />
          </motion.div>
        )}
      </AnimatePresence>

      <VisitPickerDialog
        open={openSlot === "A"}
        onOpenChange={(o) => setOpenSlot(o ? "A" : null)}
        slot="A"
        onPick={setVisitA}
        excludeStudyId={visitB?.studyId}
        initialSearch={initialNationalId}
      />
      <VisitPickerDialog
        open={openSlot === "B"}
        onOpenChange={(o) => setOpenSlot(o ? "B" : null)}
        slot="B"
        onPick={setVisitB}
        excludeStudyId={visitA?.studyId}
      />
    </DoctorPageShell>
  );
}
