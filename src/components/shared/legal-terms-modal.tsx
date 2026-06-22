"use client";

import Link from "next/link";
import { Shield, FileText, Cookie, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const legalDocs = [
  {
    icon: Shield,
    label: "Privacy Policy",
    href: "/legal/privacy-policy",
    desc: "How we handle patient and user data",
  },
  {
    icon: FileText,
    label: "Terms & Conditions",
    href: "/legal/terms-and-conditions",
    desc: "Your responsibilities as an authorized user",
  },
  {
    icon: Cookie,
    label: "Cookie Policy",
    href: "/legal/cookie-policy",
    desc: "How we use cookies on this platform",
  },
  {
    icon: Lock,
    label: "Security Policy",
    href: "/legal/security-policy",
    desc: "How we keep your data secure",
  },
];

type LegalTermsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LegalTermsModal({ open, onOpenChange }: LegalTermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terms & Policies</DialogTitle>
          <DialogDescription>
            Please review the following documents before signing in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {legalDocs.map(({ icon: Icon, label, href, desc }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/60 transition-colors group"
            >
              <div className="w-7 h-7 rounded-md bg-background border border-border/60 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">↗</span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
