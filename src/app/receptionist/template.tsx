"use client";

import type { ReactNode } from "react";
import { RouteTransition } from "@/components/shared/route-transition";

export default function Template({ children }: { children: ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
