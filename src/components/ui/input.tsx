"use client";

import * as React from "react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Search } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  search?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, search, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {search && (
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
        )}

        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg border bg-transparent px-3 py-1 text-base shadow-sm transition-all duration-200 ease-expo outline-none",
            "text-foreground placeholder:text-muted-foreground",
            "border-white/10 hover:border-white/20 focus:border-emerald-500 focus:shadow-glow-sm",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:border-none",
            search && "pl-10",
            error &&
              "border-destructive hover:border-destructive focus:border-destructive",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
