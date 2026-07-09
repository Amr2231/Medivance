import { Button } from "@/components/ui/button";

// types
type AdminErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

// admin error state
export function AdminErrorState({
  title = "Something went wrong",
  message = "Unable to load data. Please try again.",
  onRetry,
}: AdminErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-8 text-center">
      {/* title */}
      <p className="text-sm font-medium text-red-700 dark:text-red-400">
        {title}
      </p>

      {/* message */}
      <p className="text-xs text-red-500 mt-1">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 text-[#059669] border-[#059669]/30"
        >
          Try again
        </Button>
      )}
    </div>
  );
}
