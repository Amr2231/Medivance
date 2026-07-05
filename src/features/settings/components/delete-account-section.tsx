"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { pressable } from "@/lib/motion/variants";
import { useDeleteAccount } from "../hooks/use-delete-account";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const canConfirm = password.length > 0 && confirmText === "DELETE";

  const handleClose = () => {
    setOpen(false);
    setPassword("");
    setConfirmText("");
  };

  const handleDelete = () => {
    if (!canConfirm) return;
    deleteAccount(password, {
      onSettled: () => handleClose(),
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        whileHover={{ y: -2 }}
        className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/10 p-4 space-y-3 transition-shadow duration-300 hover:shadow-glow-sm"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="shrink-0 mt-0.5"
          >
            <AlertTriangle className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
              Delete account
            </p>
            <p className="text-sm text-emerald-800/80 dark:text-emerald-400/70 mt-1">
              Permanently remove your account and sign out. This action cannot be undone.
            </p>
          </div>
        </div>
        <motion.div {...pressable} className="inline-block">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Delete my account
          </Button>
        </motion.div>
      </motion.div>

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              Enter your password and type DELETE to confirm. You will be signed out immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="delete-password">Password</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="delete-confirm">Type DELETE to confirm</Label>
              <Input
                id="delete-confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!canConfirm || isPending}
              onClick={handleDelete}
            >
              {isPending ? "Deleting..." : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
