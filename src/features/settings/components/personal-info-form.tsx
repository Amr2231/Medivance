"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useZodForm } from "@/lib/shared/forms/create-zod-form";
import { FormFieldError } from "@/lib/shared/forms/form-field-error";
import { staggerContainer, staggerItem, pressable } from "@/lib/motion/variants";
import {
  personalInfoSchema,
  type PersonalInfoFormValues,
} from "@/lib/shared/schemas/settings.schema";
import { useUpdateProfile } from "../hooks/use-update-profile";

export function PersonalInfoForm() {
  const { data: session } = useSession();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(personalInfoSchema, {
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!session?.user) return;

    const fullName = session.user.name?.trim() ?? "";
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const first_name = nameParts[0] ?? "";
    const last_name = nameParts.slice(1).join(" ");

    reset({
      first_name,
      last_name,
      username: session.user.username ?? "",
      email: session.user.email ?? "",
    });
  }, [session, reset]);

  const onSubmit = (data: PersonalInfoFormValues) => {
    updateProfile(data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <motion.div variants={staggerItem} className="space-y-1.5">
          <Label className="text-sm text-gray-600">First Name</Label>
          <Input
            {...register("first_name")}
          />
          <FormFieldError error={errors.first_name} />
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-1.5">
          <Label className="text-sm text-gray-600">Last Name</Label>
          <Input
            {...register("last_name")}
          />
          <FormFieldError error={errors.last_name} />
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-1.5">
          <Label className="text-sm text-gray-600">Username</Label>
          <Input
            {...register("username")}
          />
          <FormFieldError error={errors.username} />
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-1.5">
          <Label className="text-sm text-gray-600">Email Address</Label>
          <Input
            type="email"
            {...register("email")}
          />
          <FormFieldError error={errors.email} />
        </motion.div>
      </motion.div>

      <div className="flex justify-end">
        <motion.div {...pressable}>
          <Button
            type="submit"
            disabled={isPending}
            className="h-9 bg-emerald-800 hover:bg-emerald-900 text-white gap-2 text-sm shadow-glow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </div>
    </form>
  );
}
