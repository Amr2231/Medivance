import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const STUDIES = ["CT", "Echo", "MRI", "Mammogram"];
const REPORT_STATUSES = ["not written", "written", "signed"];

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filterStudy: string;
  setFilterStudy: (v: string) => void;
  filterReportStatus?: string;
  setFilterReportStatus?: (v: string) => void;
  filterDate: string;
  setFilterDate: (v: string) => void;
  sortDate: "newest" | "oldest";
  setSortDate: (v: "newest" | "oldest") => void;
};

export function PatientsFiltersModal({
  open,
  onOpenChange,
  filterStudy,
  setFilterStudy,
  filterReportStatus = "all",
  setFilterReportStatus,
  filterDate,
  setFilterDate,
  sortDate,
  setSortDate,
}: Props) {
  const hasActive =
    filterStudy !== "all" ||
    filterReportStatus !== "all" ||
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
            <select
              value={sortDate}
              onChange={(e) =>
                setSortDate(e.target.value as "newest" | "oldest")
              }
              className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Image</p>
            <select
              value={filterStudy}
              onChange={(e) => setFilterStudy(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 text-gray-700 "
            >
              <option value="all">All Images</option>
              {STUDIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {setFilterReportStatus && (
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400">Report Status</p>
              <select
                value={filterReportStatus}
                onChange={(e) => setFilterReportStatus(e.target.value)}
                className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 text-gray-700 "
              >
                <option value="all">All Statuses</option>
                {REPORT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Received Date</p>
            <Input
              type="date"
              className="text-sm w-full"
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
                setFilterReportStatus?.("all");
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
