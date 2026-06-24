"use client";

import { motion } from "framer-motion";
import { Users2, Microscope, BrainCircuit, Activity } from "lucide-react";

import { staggerContainer, staggerItem } from "@/lib/motion/variants";

export function LandingEcosystem() {
  return (
    <section
      id="platform"
      className="border-y border-border bg-card px-4 py-24 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            A Unified Clinical Ecosystem
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Siloed data costs lives and time. Medivance brings every aspect
            of clinical operations into a single, cohesive interface.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid auto-rows-[280px] grid-cols-1 gap-4 md:grid-cols-3"
        >
          {/* Patient Management */}
          <motion.div
            variants={staggerItem}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/40 md:col-span-2"
          >
            <div
              aria-hidden
              className="absolute -right-8 -top-8 size-48 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-125"
            />
            <span className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-card text-primary">
              <Users2 className="size-5" />
            </span>
            <h3 className="mb-1 text-lg font-bold text-foreground">
              Patient Management
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Longitudinal health records, automated scheduling, and
              real-time vitals monitoring. Designed for zero-click context
              gathering.
            </p>
            <div className="mt-auto flex w-fit items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-glow-sm">
              <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                JD
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">
                  John Doe
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  DOB: 1982 · MRN: 49201
                </div>
              </div>
              <span className="ml-3 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                Admitted
              </span>
            </div>
          </motion.div>

          {/* Radiology PACS — inverted surface, echoes dark radiology workspace */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-[#0d131a] p-6"
          >
            <span className="mb-4 flex size-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-400">
              <Microscope className="size-5" />
            </span>
            <h3 className="mb-1 text-lg font-bold text-white">
              Radiology PACS
            </h3>
            <p className="text-sm text-white/60">
              Zero-footprint DICOM viewer with multi-planar reconstruction
              built right into the browser.
            </p>
          </motion.div>

          {/* Clinical radiology */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/40"
          >
            <span className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-card text-primary">
              <BrainCircuit className="size-5" />
            </span>
            <h3 className="mb-1 text-lg font-bold text-foreground">
              Clinical radiology
            </h3>
            <p className="text-sm text-muted-foreground">
              Automated anomaly detection and preliminary report generation
              acting as a second pair of eyes.
            </p>
          </motion.div>

          {/* Hospital Operations */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/40 md:col-span-2"
          >
            <span className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-card text-primary">
              <Activity className="size-5" />
            </span>
            <h3 className="mb-1 text-lg font-bold text-foreground">
              Hospital Operations
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Real-time telemetry on bed availability, staff allocation, and
              ED wait times.
            </p>
            <div className="mt-auto flex gap-4">
              <div className="flex-1 rounded-lg border border-border bg-card p-3">
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  ER Capacity
                </div>
                <div className="text-lg font-bold text-foreground">82%</div>
                <div className="mt-2 h-1 rounded-full bg-muted">
                  <div className="h-full w-[82%] rounded-full bg-destructive" />
                </div>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-card p-3">
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Avg Wait
                </div>
                <div className="text-lg font-bold text-foreground">14m</div>
                <div className="mt-2 h-1 rounded-full bg-muted">
                  <div className="h-full w-[30%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
