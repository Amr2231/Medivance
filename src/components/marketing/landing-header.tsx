"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#roles", label: "Roles" },
];

export function LandingHeader() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border/60 bg-background/70 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldPlus className="size-4.5" strokeWidth={2.25} />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-foreground">
            Medivance
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-primary hover:underline md:inline-block"
          >
            Log In
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Request Demo</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
