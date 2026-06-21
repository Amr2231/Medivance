"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut, ChevronDown } from "lucide-react";

export function HeaderUser({
  name,
  email,
  role,
}: {
  name: string;
  email?: string;
  role?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors outline-none group">
          <Avatar className="size-7 shrink-0">
            <AvatarFallback className="rounded-md bg-emerald-800 text-white text-[11px] font-bold tracking-wide">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* name + role */}
          <div className="hidden sm:grid text-left leading-tight">
            <span className="text-sm font-medium text-foreground truncate max-w-30">
              {name}
            </span>
            {role && (
              <span className="text-[11px] text-muted-foreground truncate">
                {role}
              </span>
            )}
          </div>

          <ChevronDown className="size-3.5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
        {/* User info */}
        <DropdownMenuLabel className="p-0 mb-1">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-muted/50">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="rounded-md bg-emerald-800 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid leading-tight min-w-0">
              <span className="text-sm font-semibold truncate">{name}</span>
              {email && (
                <span className="text-[11px] text-muted-foreground truncate">
                  {email}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          asChild
          className="gap-2 rounded-lg cursor-pointer text-sm"
        >
          <Link href="/receptionist/settings">
            <Settings className="size-4 text-muted-foreground" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          className="gap-2 rounded-lg cursor-pointer text-sm text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
