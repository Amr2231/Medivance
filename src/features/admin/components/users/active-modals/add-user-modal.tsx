"use client";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  ClipboardList,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/tailwind-merge";
import { useAddUser } from "../../../hooks/use-add-user";
import { addUserSchema, type AddUserSchema } from "@/lib/schemas/admin.schema";
import type { Role } from "@/lib/types/admin";

const STEPS = [
  { key: "personal", label: "Personal Info" },
  { key: "security", label: "Security" },
  { key: "role", label: "Role & Access" },
  { key: "review", label: "Review" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

const ROLE_OPTIONS: {
  value: Role;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "Admin",
    label: "Admin",
    description: "System configuration and user management.",
    icon: ShieldCheck,
  },
  {
    value: "Doctor",
    label: "Doctor",
    description: "Clinical diagnostics and patient care.",
    icon: Stethoscope,
  },
  {
    value: "Receptionist",
    label: "Receptionist",
    description: "Scheduling and patient intake.",
    icon: ClipboardList,
  },
];

// fields validated before allowing "Next Step" out of each step
const STEP_FIELDS: Record<StepKey, (keyof AddUserSchema)[]> = {
  personal: ["first_name", "last_name", "username", "email"],
  security: ["password", "confirm_password"],
  role: ["role_name"],
  review: [],
};

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label} {required && <span className="text-emerald-800">*</span>}
    </label>
  );
}

export function AddUserModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const { mutate: addUser, isPending } = useAddUser({
    onSuccessCallback: () => {
      reset();
      setStepIndex(0);
      onOpenChange(false);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<AddUserSchema>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { role_name: undefined },
  });

  const values = watch();

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    const pwd = Array.from(
      { length: 12 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
    setValue("password", pwd, { shouldValidate: true });
    setValue("confirm_password", pwd, { shouldValidate: true });
  };

  const handleClose = (next: boolean) => {
    if (!next) {
      reset();
      setStepIndex(0);
    }
    onOpenChange(next);
  };

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step.key]);
    if (!valid) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const handleBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const selectedRole = useMemo(
    () => ROLE_OPTIONS.find((r) => r.value === values.role_name),
    [values.role_name],
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
            Create New User
          </DialogTitle>
        </DialogHeader>

        {/* stepper */}
        <div className="flex items-center px-6 pt-5 pb-4">
          {STEPS.map((s, i) => {
            const isDone = i < stepIndex;
            const isActive = i === stepIndex;
            return (
              <div
                key={s.key}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border-2 transition-colors",
                      isDone && "bg-emerald-700 border-emerald-700 text-white",
                      isActive &&
                        "border-emerald-700 text-emerald-700 bg-white dark:bg-gray-950",
                      !isDone &&
                        !isActive &&
                        "border-gray-200 text-gray-400 dark:border-gray-700",
                    )}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium whitespace-nowrap",
                      isActive
                        ? "text-emerald-700"
                        : "text-gray-400 dark:text-gray-500",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 mb-4 rounded-full transition-colors",
                      isDone
                        ? "bg-emerald-700"
                        : "bg-gray-200 dark:bg-gray-800",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* step body */}
        <div className="px-6 pb-2 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              {step.key === "personal" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-emerald-700" />
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Personal Information
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <FieldLabel label="First Name" required />
                      <Input
                        placeholder="e.g. John"
                        {...register("first_name")}
                        className={cn(
                          "h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm",
                          errors.first_name && "border-red-400",
                        )}
                      />
                      {errors.first_name && (
                        <p className="text-xs text-red-500">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel label="Last Name" required />
                      <Input
                        placeholder="e.g. Smith"
                        {...register("last_name")}
                        className={cn(
                          "h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm",
                          errors.last_name && "border-red-400",
                        )}
                      />
                      {errors.last_name && (
                        <p className="text-xs text-red-500">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel label="Username" required />
                      <Input
                        placeholder="e.g. john_smith"
                        {...register("username")}
                        className={cn(
                          "h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm",
                          errors.username && "border-red-400",
                        )}
                      />
                      {errors.username && (
                        <p className="text-xs text-red-500">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel label="Email Address" required />
                      <Input
                        type="email"
                        placeholder="e.g. john@medidash.com"
                        {...register("email")}
                        className={cn(
                          "h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm",
                          errors.email && "border-red-400",
                        )}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step.key === "security" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <KeyRound className="w-4 h-4 text-emerald-700" />
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Account Security
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 -mt-3">
                    Set a password for this account. The user can change it
                    later.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <FieldLabel label="Password" required />
                      <div className="flex gap-2">
                        <PasswordInput
                          placeholder="Enter password"
                          {...register("password")}
                          error={!!errors.password}
                          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generatePassword}
                          className="h-10 px-2.5 text-emerald-600 border-emerald-900/30 hover:bg-emerald-100 shrink-0"
                          title="Generate password"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      {errors.password ? (
                        <p className="text-xs text-red-500">
                          {errors.password.message}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">
                          Min 8 characters
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel label="Confirm Password" required />
                      <PasswordInput
                        placeholder="Confirm password"
                        {...register("confirm_password")}
                        error={!!errors.confirm_password}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                      {errors.confirm_password && (
                        <p className="text-xs text-red-500">
                          {errors.confirm_password.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step.key === "role" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Portal Access Role
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Choose the role that defines what this user can see and
                      do.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {ROLE_OPTIONS.map((r) => {
                      const Icon = r.icon;
                      const isSelected = values.role_name === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() =>
                            setValue("role_name", r.value, {
                              shouldValidate: true,
                            })
                          }
                          className={cn(
                            "text-left rounded-xl border-2 p-3 transition-colors",
                            isSelected
                              ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300",
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4 h-4 mb-2",
                              isSelected ? "text-emerald-700" : "text-gray-400",
                            )}
                          />
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {r.label}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                            {r.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {errors.role_name && (
                    <p className="text-xs text-red-500">
                      {errors.role_name.message}
                    </p>
                  )}
                </div>
              )}

              {step.key === "review" && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Review &amp; Confirm
                  </p>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-gray-400">Name</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {values.first_name} {values.last_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-gray-400">Username</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {values.username}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-gray-400">Email</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {values.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-gray-400">Role</span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                        {selectedRole && (
                          <selectedRole.icon className="w-3.5 h-3.5 text-emerald-700" />
                        )}
                        {values.role_name}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Double-check the details above — you can go back to fix
                    anything before creating the account.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/30">
          <Button
            type="button"
            variant="ghost"
            onClick={stepIndex === 0 ? () => handleClose(false) : handleBack}
            className="text-sm text-gray-500"
          >
            {stepIndex === 0 ? "Cancel" : "Back"}
          </Button>

          {step.key === "review" ? (
            <Button
              onClick={handleSubmit((data) => addUser(data))}
              disabled={isPending}
              className="h-9 bg-emerald-800 hover:bg-emerald-900 text-white text-sm"
            >
              {isPending ? "Creating..." : "Create User"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="h-9 bg-emerald-800 hover:bg-emerald-900 text-white text-sm gap-1.5"
            >
              Next Step →
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
