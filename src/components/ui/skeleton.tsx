import { cn } from "@/lib/utils/tailwind-merge"

/** Loading placeholder with a soft shimmer sweep instead of a flat pulse. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted shimmer",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
