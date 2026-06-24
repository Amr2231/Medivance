"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

const FINDINGS = [
  {
    label: "Pulmonary Nodule",
    confidence: "94%",
    detail: "Right Upper Lobe (RUL). Solid appearance. Meas: 8.4mm x 7.1mm.",
    tone: "critical" as const,
  },
  {
    label: "Mild Atelectasis",
    confidence: "42%",
    detail: "Left Lower Lobe (LLL). Dependent changes suspected.",
    tone: "benign" as const,
  },
];

export function LandingIntelligence() {
  return (
    <section id="intelligence" className="px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 flex flex-col gap-5 lg:order-1"
        >
          <div className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Imaging workspace
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            A second pair of eyes on every scan.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            Medivance reads DICOM series inline and surfaces clinically relevant
            findings directly on the image — with quantitative metrics,
            confidence scores, and a clear approve / edit / reject workflow so
            radiologists stay firmly in control.
          </p>
          <ul className="flex flex-col gap-3">
            {[
              "Nodule, atelectasis & volumetric detection with millimeter-level measurements",
              "Every clinical value stays editable — overrides are tracked, never silent",
              "Sub-minute triage from scan upload to prioritized worklist",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 overflow-hidden rounded-xl border border-border bg-[#0d131a] shadow-glow-lg lg:order-2"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-xs font-medium text-white/50">
              Series: 3 &nbsp;·&nbsp; Img: 114 / 420
            </span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
              Workspace Active
            </span>
          </div>

          <div className="relative aspect-[4/3]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 42%, rgba(104,219,169,0.22), transparent 55%)",
              }}
            />
            <div className="absolute right-10 top-10 h-16 w-16 animate-pulse rounded border-2 border-primary" />
            <span className="absolute right-8 top-8 -translate-y-full rounded bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
              Nodule review 94%
            </span>
          </div>

          <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
            {FINDINGS.map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {f.label}
                  </span>
                  <span
                    className={
                      f.tone === "critical"
                        ? "rounded bg-destructive/20 px-1.5 py-0.5 text-[10px] font-bold text-red-300"
                        : "rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70"
                    }
                  >
                    {f.confidence}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-white/50">
                  {f.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
