"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Shield, FileText, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function TermsAcceptanceModal() {
  const { data: session, status, update } = useSession();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || session.acceptedTerms === true) return null;

  const handleAccept = async () => {
    if (!agreed || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/accept-terms", {
        method: "POST",
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to save your acceptance");
      }

      await update({ acceptedTerms: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Before You Continue
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Please review and accept our legal terms to access Echo Vision.
              This is required once per account.
            </p>
          </div>
        </div>

        {/* Legal documents links */}
        <div className="p-4 bg-muted/40 rounded-xl border border-border/60 space-y-1">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
            Required Documents
          </p>
          {[
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
          ].map(({ icon: Icon, label, href, desc }) => (
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

        {/* Checkbox */}
        <label
          htmlFor="terms-accept"
          className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-muted/20 cursor-pointer select-none"
        >
          <Checkbox
            id="terms-accept"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(!!v)}
            className="mt-0.5 shrink-0"
            disabled={loading}
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            I have read and agree to the{" "}
            <span className="font-medium text-foreground">
              Privacy Policy and Terms & Conditions
            </span>
            . I understand my professional responsibilities as an authorized
            user of this healthcare radiology platform.
          </span>
        </label>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {/* CTA Button */}
        <Button
          className="w-full"
          disabled={!agreed || loading}
          onClick={handleAccept}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving your acceptance...
            </span>
          ) : (
            "Accept & Continue to Dashboard"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You cannot access the platform without accepting these terms. This
          acceptance is recorded for compliance purposes.
        </p>
      </div>
    </div>
  );
}
