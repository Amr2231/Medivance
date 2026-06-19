import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language for the redesigned shared-component layer
 * (sidebar, page shells, cards, tables). Keeping these centralized means
 * every surface that consumes them automatically feels consistent, and
 * the whole app's motion "voice" can be tuned from one place.
 */

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { ...springSoft } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
};

/** Stagger a group of children (cards, rows, nav items) as they enter. */
export const staggerContainer = (stagger = 0.05, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { ...springSnappy } },
};

/** Subtle hover/tap lift used across cards + interactive rows. */
export const hoverLift = {
  whileHover: { y: -2, transition: springSnappy },
  whileTap: { scale: 0.99 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: springSoft },
};

/** Modal/dialog content — soft overshoot pop instead of a flat zoom. */
export const modalPop: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: springSnappy },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 4,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/** Drawer/sheet slide, per edge — used by the Sheet primitive. */
export const sheetSlide = (side: "left" | "right" | "top" | "bottom" = "right"): Variants => {
  const isHorizontal = side === "left" || side === "right";
  const sign = side === "left" || side === "top" ? -1 : 1;

  if (isHorizontal) {
    return {
      hidden: { opacity: 0, x: sign * 24 },
      show: { opacity: 1, x: 0, transition: springSnappy },
      exit: { opacity: 0, x: sign * 16, transition: { duration: 0.15 } },
    };
  }

  return {
    hidden: { opacity: 0, y: sign * 24 },
    show: { opacity: 1, y: 0, transition: springSnappy },
    exit: { opacity: 0, y: sign * 16, transition: { duration: 0.15 } },
  };
};

/** Sliding active-pill for nav items / tabs / pagination — pair with layoutId. */
export const activeIndicatorTransition: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 38,
};

/** Table row entrance — a touch snappier than the generic staggerItem. */
export const rowEnter: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: springSnappy },
};

/** Route/page-level transition wrapper (used in role `template.tsx`). */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.16, ease: "easeIn" },
  },
};

/** Press feedback for buttons / clickable rows — subtle, not bouncy. */
export const pressable = {
  whileTap: { scale: 0.97 },
  transition: springSnappy,
};
