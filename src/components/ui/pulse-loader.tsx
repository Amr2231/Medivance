import { cn } from "@/lib/utils/tailwind-merge";

interface PulseLoaderProps {
  className?: string;
}

export function PulseLoader({ className }: PulseLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width="48px" height="48px" viewBox="0 0 48 48">
        {/* Faint track ring */}
        <circle cx="24" cy="24" r="20" fill="none" stroke="#0d948833" strokeWidth="3" />

        {/* Spinning ring, hospital teal */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="#0d9488"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="30 96"
          style={{
            transformOrigin: "24px 24px",
            animation: "pulse-loader-spin 1.1s linear infinite",
          }}
        />

        {/* Medical cross, beating like a heartbeat monitor */}
        <path
          d="M20.5 13.5h7v7h7v7h-7v7h-7v-7h-7v-7h7z"
          fill="#0d9488"
          style={{
            transformOrigin: "24px 24px",
            animation: "pulse-loader-beat 1.4s ease-in-out infinite",
          }}
        />
      </svg>
    </div>
  );
}
