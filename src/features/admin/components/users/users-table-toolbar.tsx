"use client";
import { Search, SlidersHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/tailwind-merge";
import { ROLES } from "@/lib/constants/roles.constants";

export function UsersFilterBar({
  search,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
  activeFilters,
  onOpenFilters,
  onExport,
}: {
  search: string;
  onSearchChange: (val: string) => void;
  filterRole: string;
  onFilterRoleChange: (val: string) => void;
  activeFilters: number;
  onOpenFilters: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 p-4 border-b border-gray-100 dark:border-gray-800 animate-in fade-in duration-300">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9 h-10 text-sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* role filter — matches the live API's role field */}
      <Select value={filterRole} onValueChange={onFilterRoleChange}>
        <SelectTrigger className="h-10 w-full sm:w-44 text-sm text-gray-600">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {ROLES.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* "More" — Export + additional filters (sort + created-date) live
          here so we don't lose that functionality while keeping this bar
          simple */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-10 gap-2 text-sm font-normal text-gray-600 border-gray-200",
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            More
            {activeFilters > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-800 text-[10px] text-white font-bold">
                {activeFilters}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenFilters} className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            More filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
