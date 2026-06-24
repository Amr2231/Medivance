"use client";

import { motion } from "framer-motion";
import { Stethoscope, ClipboardList, ShieldCheck, ArrowUpRight } from "lucide-react";

import { staggerContainer, staggerItem } from "@/lib/motion/variants";

const ROLES = [
  {
    icon: Stethoscope,
    title: "Doctors",
    description:
      "A daily schedule, radiology workspace, and full patient history — organized around clinical decisions, not menus.",
  },
  {
    icon: ClipboardList,
    title: "Receptionists",
    description:
      "Live arrival boards, priority queues, and doctor availability so front-desk operations run without guesswork.",
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    description:
      "Enterprise-grade audit logs, session management, and analytics across every department, in one command center.",
  },
];

export function LandingRoles() {
  return (
    <section id="roles" className="border-y border-border bg-card px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Built around who&apos;s using it
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            One platform, three purpose-built workspaces — every role sees
            exactly what it needs and nothing it doesn&apos;t.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {ROLES.map((role) => (
            <motion.div
              key={role.title}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="flex flex-col rounded-xl border border-border bg-background p-6"
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-card text-primary">
                <role.icon className="size-5" />
              </span>
              <h3 className="mb-1.5 text-lg font-bold text-foreground">
                {role.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                See the workspace
                <ArrowUpRight className="size-3.5" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
