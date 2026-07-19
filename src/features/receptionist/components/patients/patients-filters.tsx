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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDoctors } from "../../hooks/use-doctors";
import {
  ActiveFiltersProps,
  HistoricalFiltersProps,
} from "@/lib/types/receptionist";
import { STUDY } from "@/lib/constants/study.constants";

//  Active Filters
export function ActiveFiltersModal({
  open,
  onOpenChange,
  filterDoctor,
  setFilterDoctor,
  filterStudy,
  setFilterStudy,
  filterDate,
  setFilterDate,
  sortDate,
  setSortDate,
}: ActiveFiltersProps) {
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();

  const hasActive =
    filterDoctor !== "all" ||
    filterStudy !== "all" ||
    !!filterDate ||
    sortDate !== "newest";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
            Filters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Sort by date</p>
            <Select
              value={sortDate}
              onValueChange={(v) => setSortDate(v as "newest" | "oldest")}
            >
              <SelectTrigger className="h-9 text-sm w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Doctor</p>
            <Select
              value={filterDoctor}
              onValueChange={setFilterDoctor}
              disabled={loadingDoctors}
            >
              <SelectTrigger className="h-9 text-sm w-full">
                <SelectValue
                  placeholder={loadingDoctors ? "Loading..." : "All Doctors"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map((d) => (
                  <SelectItem key={d.user_id} value={String(d.user_id)}>
                    {d.first_name} {d.last_name} ({d.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Image</p>
            <Select value={filterStudy} onValueChange={setFilterStudy}>
              <SelectTrigger className="h-9 text-sm w-full">
                <SelectValue placeholder="All Images" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                {STUDY.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Image date</p>
            <Input
              type="date"
              className="h-9 text-sm w-full"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {hasActive && (
            <Button
              variant="ghost"
              className="text-sm text-gray-400 hover:text-gray-700 mr-auto"
              onClick={() => {
                setFilterDoctor("all");
                setFilterStudy("all");
                setFilterDate("");
                setSortDate("newest");
              }}
            >
              Reset
            </Button>
          )}
          <Button
            variant={"default"}
            onClick={() => onOpenChange(false)}
            className=""
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function HistoricalFiltersModal({
  open,
  onOpenChange,
  filterStudy,
  setFilterStudy,
  filterDate,
  setFilterDate,
  sortDate,
  setSortDate,
}: HistoricalFiltersProps) {
  const hasActive =
    filterStudy !== "all" || !!filterDate || sortDate !== "newest";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
            Filters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Sort by date</p>
            <Select
              value={sortDate}
              onValueChange={(v) => setSortDate(v as "newest" | "oldest")}
            >
              <SelectTrigger className="h-9 text-sm w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Image</p>
            <Select value={filterStudy} onValueChange={setFilterStudy}>
              <SelectTrigger className="h-9 text-sm w-full">
                <SelectValue placeholder="All Images" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                {STUDY.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Image date</p>
            <Input
              type="date"
              className=" text-sm w-full"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {hasActive && (
            <Button
              variant="ghost"
              className="text-sm text-gray-400 hover:text-gray-700 mr-auto"
              onClick={() => {
                setFilterStudy("all");
                setFilterDate("");
                setSortDate("newest");
              }}
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
