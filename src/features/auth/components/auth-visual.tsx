"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldPlus } from "lucide-react";

// Shared animation settings for the orbs
const orbAnimation = {
  scale: [1, 1.15, 1],
  opacity: [0.25, 0.4, 0.25],
};

// Orb transition settings
const orbTransition = {
  duration: 4,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

// Main component
export default function AuthVisual() {
  return (
    <div className="hidden lg:flex flex-1 min-h-screen items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <Image
        src="/heart.png"
        alt="heart in Research Institute"
        fill
        priority
        quality={75}
        sizes="50vw"
        className="object-cover z-0 select-none pointer-events-none"
      />

      {/* Brand-tinted overlay (replaces flat black overlay) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-primary/40 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent"
      />

      {/* ECG Line */}
      <svg
        className="absolute inset-0 w-full h-full z-20 opacity-20 pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M 0 400 L 250 400 L 290 250 L 340 550 L 390 320 L 430 400 L 1200 400"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            willChange: "transform",
          }}
        />
      </svg>

      {/* Orb Top Right */}
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white/5 blur-xl z-20"
        animate={orbAnimation}
        transition={orbTransition}
        style={{
          willChange: "transform, opacity",
        }}
      />

      {/* Orb Bottom Left */}
      <motion.div
        className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-white/5 blur-xl z-20"
        animate={orbAnimation}
        transition={{
          ...orbTransition,
          duration: 5,
        }}
        style={{
          willChange: "transform, opacity",
        }}
      />

      {/* Center Pulse */}
      <motion.div
        className="absolute w-44 h-44 rounded-full bg-white/5 blur-md z-20"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
        }}
        style={{
          willChange: "transform, opacity",
        }}
      />

      {/* Brand block (logo + name + tagline) */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end p-12 pointer-events-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-white/15 border border-white/30 shadow-sm shrink-0 backdrop-blur-sm">
            <ShieldPlus className="size-5 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-2xl font-bold text-white">Medivance</span>
        </div>
        <p className="text-white/90 text-lg max-w-md leading-relaxed">
          Clinical Clarity. Radiology workflows that help doctors
          read faster and decide with confidence.
        </p>
      </div>
    </div>
  );
}
