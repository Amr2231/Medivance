"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const FOOTER_LINKS = [
  { href: "/legal/privacy-policy", label: "Privacy" },
  { href: "/legal/terms-and-conditions", label: "Terms" },
  { href: "/legal/security-policy", label: "Security" },
];

export function LandingCtaFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#0d131a] px-4 py-24 text-center md:px-8">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(133,248,196,0.9) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Ready to upgrade your clinical workflow?
        </h2>
        <p className="text-base text-white/60 md:text-lg">
          Join leading hospitals using Medivance to reduce burnout and
          improve patient outcomes.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/login">Request a Full Demo</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <a href="mailto:sales@evplatform.health">Contact Sales</a>
          </Button>
        </div>

        <div className="mt-14 flex w-full flex-col items-center gap-4 border-t border-white/10 pt-8 text-xs font-semibold text-white/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Medivance. All rights reserved.</span>
          <div className="flex gap-5">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-emerald-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
