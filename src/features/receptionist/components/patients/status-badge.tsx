import { CalendarClock, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { StudyStatus } from "@/lib/types/receptionist";

export const StatusBadge = ({ status }: { status: StudyStatus }) => {
  const config: Record<
    StudyStatus,
    { icon: React.ElementType; className: string; label: string }
  > = {
    Completed: {
      icon: CheckCircle2,
      className: "bg-green-100 text-green-700 border-green-200",
      label: "Completed",
    },
    Scheduled: {
      icon: CalendarClock,
      className: "bg-gray-100 text-gray-500 border-gray-200",
      label: "Scheduled",
    },
    Pending: {
      icon: Clock,
      className: "bg-emerald-50 text-emerald-600 border-emerald-200",
      label: "Pending",
    },
    "In Progress": {
      icon: Clock,
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      label: "In Progress",
    },
  };

  const { icon: Icon, className, label } = config[status] ?? config.Scheduled;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};
