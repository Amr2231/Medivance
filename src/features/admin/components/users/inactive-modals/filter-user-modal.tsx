"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROLES } from "@/lib/constants/roles.constants";
import {
  inactiveFiltersSchema,
  type InactiveFiltersSchema,
} from "@/lib/schemas/admin.schema";

// types
type FiltersModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filterRole: string;
  setFilterRole: (v: string) => void;
  sortDate: "newest" | "oldest";
  setSortDate: (v: "newest" | "oldest") => void;
  created_date?: string;
  setCreatedDate: (v: string | undefined) => void;
};

// component
export function InactiveFiltersModal({
  open,
  onOpenChange,
  filterRole,
  setFilterRole,
  sortDate,
  setSortDate,
  created_date,
  setCreatedDate,
}: FiltersModalProps) {
  // form
  const { register, reset, watch } = useForm<InactiveFiltersSchema>({
    resolver: zodResolver(inactiveFiltersSchema),
    defaultValues: {
      sortDate: "newest",
      filterRole: "all",
      created_date: "",
    },
  });

  // modal open
  useEffect(() => {
    if (open) {
      reset({
        sortDate,
        filterRole,
        created_date: created_date ?? "",
      });
    }
  }, [open, sortDate, filterRole, created_date, reset]);

  // sync
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      setFilterRole(values.filterRole ?? "all");
      setSortDate((values.sortDate as "newest" | "oldest") ?? "newest");
      setCreatedDate(values.created_date || undefined);
    });
    return unsubscribe;
  }, [watch, setFilterRole, setSortDate, setCreatedDate]);

  const hasActive =
    filterRole !== "all" || sortDate !== "newest" || !!created_date;

  const handleReset = () => {
    reset({ sortDate: "newest", filterRole: "all", created_date: "" });
    setFilterRole("all");
    setSortDate("newest");
    setCreatedDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
            Filters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* date filter */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Sort by date</p>
            <select
              {...register("sortDate")}
              className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm text-gray-700 dark:text-gray-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-600"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* role filter */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Role</p>
            <select
              {...register("filterRole")}
              className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm text-gray-700 dark:text-gray-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-600"
            >
              <option value="all">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* created date filter */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Created at</p>
            <Input type="date" {...register("created_date")} />
          </div>
        </div>

        {/* footer */}
        <DialogFooter className="gap-2">
          {hasActive && (
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-gray-400 hover:text-gray-700 mr-auto"
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
