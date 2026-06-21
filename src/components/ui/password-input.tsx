"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

export interface PasswordInputProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "type"
> {
  label?: string;
  rtl?: boolean;
  error?: boolean;
}

export const PasswordInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  PasswordInputProps
>(({ rtl = false, disabled, error, className, ...props }, ref) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        type={show ? "text" : "password"}
        disabled={disabled}
        className={cn(
          "text-sm appearance-none",
          rtl ? "pl-11 pr-4" : "pr-11 pl-4",
          "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
          error && "border-red-500 focus-visible:ring-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...props}
      />

      <button
        type="button"
        disabled={disabled}
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((p) => !p)}
        className={cn(
          "absolute top-1/2 cursor-pointer -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors",
          rtl ? "left-3" : "right-3",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        {show ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
