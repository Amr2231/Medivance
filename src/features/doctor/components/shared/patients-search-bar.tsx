"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tailwind-merge";

type PatientsSearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilters: number;
  onOpenFilters: () => void;
};

// Meant to be dropped straight into DoctorTableCard's `toolbar` slot — the
// card already provides the flex row, gap, and padding, so this only
// renders its two pieces (search input + filter button).
export function PatientsSearchBar({
  search,
  onSearchChange,
  activeFilters,
  onOpenFilters,
}: PatientsSearchBarProps) {
  return (
    <>
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
        <Input
          placeholder="Search by name or National ID..."
          className="pl-9 h-10 text-sm"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <Button
        variant="outline"
        className={cn(
          "h-10 gap-2 text-sm font-normal text-gray-600 border-gray-200",
          activeFilters > 0 && "border-[#059669] text-[#059669]",
        )}
        onClick={onOpenFilters}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter
        {activeFilters > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-[10px] text-white font-medium">
            {activeFilters}
          </span>
        )}
      </Button>
    </>
  );
}
