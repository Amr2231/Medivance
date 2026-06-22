import { cn } from "@/lib/utils/tailwind-merge";
import { XCircle } from "lucide-react";

// Types
type SubmissionFeedbackProps = React.HTMLAttributes<HTMLParagraphElement>;

// Component
export default function SubmissionFeedback({
  children,
  className,
  ...props
}: SubmissionFeedbackProps) {
  // If no children, return null
  if (!children) return null;

  return (
    <p
      className={cn(
        "text-sm text-destructive p-2.5 border border-destructive relative bg-red-50 font-medium text-center",
        className,
      )}
      {...props}
    >
      {/* Icon */}
      <XCircle className="size-5 bg-white rounded-full absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 " />
      {/* Message */}
      {children}
    </p>
  );
}
