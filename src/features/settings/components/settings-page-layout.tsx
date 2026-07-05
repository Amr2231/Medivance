"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Bell,
  IdCard,
  Info,
  Lock,
  ScrollText,
  User,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion/variants";

const SECTION_ICONS: Record<string, LucideIcon> = {
  "profile details": User,
  "personal information": User,
  "password & security": Lock,
  "change password": Lock,
  notifications: Bell,
  "account information": Info,
  "danger zone": AlertTriangle,
};

const EXTRA_LINK_ICONS: Record<string, LucideIcon> = {
  users: Users2,
  "audit-logs": ScrollText,
};

export type SettingsExtraLink = {
  label: string;
  href: string;
  /** Key into the icon map above, e.g. "users" or "audit-logs". */
  icon?: keyof typeof EXTRA_LINK_ICONS;
};

export type SettingsSectionMeta = {
  id: string;
  title: string;
};

type SettingsPageLayoutProps = {
  title?: string;
  description?: string;
  sections: SettingsSectionMeta[];
  children: React.ReactNode;
  notifications?: React.ReactNode;
  extraLinks?: SettingsExtraLink[];
};

export function SettingsPageLayout({
  title = "Settings",
  description = "Manage your account settings and preferences",
  sections,
  children,
  notifications,
  extraLinks,
}: SettingsPageLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  const hasNotifications = notifications != null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="max-w-350 mx-auto space-y-6"
      >
        <motion.div variants={staggerItem} className="relative pl-4">
          <span
            aria-hidden
            className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[image:var(--brand-gradient)]"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={cn(
            "grid grid-cols-1 gap-6 items-start",
            hasNotifications
              ? "lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_360px]"
              : "lg:grid-cols-[220px_minmax(0,1fr)]",
          )}
        >
          {sections.length > 0 && (
            <nav className="lg:sticky lg:top-20 lg:col-start-1 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 p-2 space-y-0.5">
              {sections.map(({ id, title: sectionTitle }) => {
                const Icon =
                  SECTION_ICONS[sectionTitle.toLowerCase()] ?? IdCard;
                const isActive = activeId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5",
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{sectionTitle}</span>
                  </button>
                );
              })}

              {extraLinks && extraLinks.length > 0 && (
                <>
                  <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Workspace
                  </p>
                  {extraLinks.map(({ label, href, icon }) => {
                    const Icon = (icon && EXTRA_LINK_ICONS[icon]) || IdCard;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 transition-colors"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{label}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>
          )}

          <div ref={containerRef} className="space-y-6 min-w-0 lg:col-start-2">
            {children}
          </div>

          {hasNotifications && (
            <div className="space-y-6 min-w-0 xl:sticky xl:top-20 xl:col-start-3 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-1">
              {notifications}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
