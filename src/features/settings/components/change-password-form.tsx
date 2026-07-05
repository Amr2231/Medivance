"use client";

import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useZodForm } from "@/lib/shared/forms/create-zod-form";
import { FormFieldError } from "@/lib/shared/forms/form-field-error";
import { staggerContainer, staggerItem, pressable } from "@/lib/motion/variants";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/shared/schemas/settings.schema";
import { useChangePassword } from "../hooks/use-change-password";

type ChangePasswordFormProps = {
  /** Preserves role-specific API contract (admin PATCH vs doctor POST) */
  variant?: "admin" | "doctor";
};

export function ChangePasswordForm({ variant = "admin" }: ChangePasswordFormProps) {
  const { mutate: changePassword, isPending } = useChangePassword(variant);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(changePasswordSchema, {
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword(data, {
      onSuccess: (response) => {
        if (
          response.message === "Password changed successfully" ||
          response.success
        ) {
          reset();
        }
      },
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <motion.div variants={staggerItem} className="space-y-1.5">
          <Label className="text-sm text-gray-600">Current Password</Label>
          <PasswordInput
            placeholder="Enter current password"
            {...register("current_password")}
            error={!!errors.current_password}
          />
          <FormFieldError error={errors.current_password} />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div variants={staggerItem} className="space-y-1.5">
            <Label className="text-sm text-gray-600">New Password</Label>
            <PasswordInput
              placeholder="Enter new password"
              {...register("new_password")}
              error={!!errors.new_password}
            />
            <FormFieldError error={errors.new_password} />
            {!errors.new_password && (
              <p className="text-xs text-gray-400">Min 8 characters</p>
            )}
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-1.5">
            <Label className="text-sm text-gray-600">Confirm New Password</Label>
            <PasswordInput
              placeholder="Confirm new password"
              {...register("confirm_password")}
              error={!!errors.confirm_password}
            />
            <FormFieldError error={errors.confirm_password} />
          </motion.div>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <motion.div {...pressable}>
          <Button
            type="submit"
            disabled={isPending}
            className="h-9 bg-emerald-800 hover:bg-emerald-900 text-white gap-2 text-sm shadow-glow-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            {isPending ? "Changing..." : "Change Password"}
          </Button>
        </motion.div>
      </div>
    </form>
  );
}
