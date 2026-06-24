"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Users, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion/variants";

const STATS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "45", suffix: "sec", label: "Avg Scan Triage" },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-40 md:px-8 md:pb-32 md:pt-48">
      {/* Ambient dotted backdrop + gradient fade, matches the app's ambient-blob vocabulary */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklch, var(--border) 140%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="ambient-blob absolute -top-24 right-[-10%] -z-10 size-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--brand-gradient)" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.div
            variants={staggerItem}
            className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1"
          >
            <BadgeCheck className="size-3.5 text-primary" strokeWidth={2.5} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Now HIPAA &amp; SOC2 Type II Certified
            </span>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            A Smarter Operating System for{" "}
            <span className="text-gradient-brand">Modern Healthcare.</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Medivance unifies patient management, radiology workflows, and
            clinical operations into a single, high-precision instrument.
            Built for the cognitive demands of modern medical teams.
          </motion.p>

          <motion.div variants={staggerItem} className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                Explore the Platform
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#intelligence">View Clinical Accuracy Report</a>
            </Button>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-4 flex items-center gap-8 border-t border-border/70 pt-6"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                  {stat.suffix ? (
                    <span className="text-lg text-muted-foreground">
                      {stat.suffix}
                    </span>
                  ) : null}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
          className="relative hidden h-[560px] overflow-hidden rounded-2xl border border-border bg-card shadow-glow-lg lg:block"
        >
          <MockWorkspacePreview />
        </motion.div>
      </div>
    </section>
  );
}

/** Abstract, decorative dashboard mock — no real patient data, purely visual. */
function MockWorkspacePreview() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-muted/40 px-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-amber-500/60" />
          <span className="size-2.5 rounded-full bg-primary/60" />
        </div>
        <div className="flex gap-3">
          <span className="h-2 w-16 rounded-full bg-muted-foreground/20" />
          <span className="h-2 w-8 rounded-full bg-muted-foreground/20" />
        </div>
      </div>

      <div className="flex flex-1 gap-4 bg-background p-4">
        <div className="flex w-14 flex-col items-center gap-4 rounded-lg border border-border/70 bg-card py-4">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Activity className="size-4" />
          </span>
          <span className="flex size-8 items-center justify-center rounded-md text-muted-foreground">
            <Users className="size-4" />
          </span>
        </div>

        <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-3">
          <div className="relative col-span-2 row-span-2 flex flex-col gap-3 overflow-hidden rounded-lg border border-border/70 bg-card p-3">
            <span className="h-2.5 w-24 rounded-full bg-muted-foreground/20" />
            <div className="relative flex-1 overflow-hidden rounded-md bg-[#0d131a]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 45%, rgba(104,219,169,0.25), transparent 55%)",
                }}
              />
              <div className="absolute right-5 top-5 h-14 w-14 animate-pulse rounded border-2 border-primary/70" />
              <span className="absolute left-3 top-3 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                Study review · Nodule 94%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-card p-3">
            <span className="h-2 w-14 rounded-full bg-muted-foreground/20" />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              142
            </span>
            <div className="mt-auto h-1 rounded-full bg-muted">
              <div className="h-full w-3/4 rounded-full bg-primary" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border/70 bg-card p-3">
            <span className="h-2 w-14 self-start rounded-full bg-muted-foreground/20" />
            <div className="size-12 rounded-full border-4 border-muted border-t-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
