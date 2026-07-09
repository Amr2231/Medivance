import { PulseLoader } from "@/components/ui/pulse-loader";

// loading state for admin pages
export function AdminLoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <PulseLoader />
    </div>
  );
}
